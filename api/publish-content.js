const DEFAULT_BRANCH = "main";
const DEFAULT_PATH = "content-data/site-content.json";
const API_VERSION = "2022-11-28";

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function readEnv(name, fallback = "") {
  const value = process.env[name];
  return typeof value === "string" ? value : fallback;
}

function parseRepo(repo) {
  const [owner, name] = String(repo || "").split("/");
  if (!owner || !name) {
    return null;
  }
  return { owner, name };
}

async function fetchJson(url, init) {
  const response = await fetch(url, init);
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (error) {
    data = { raw: text };
  }
  return { response, data };
}

export async function GET() {
  return json({
    ok: true,
    message: "Publish endpoint is ready.",
    repo: readEnv("GITHUB_REPO"),
    branch: readEnv("GITHUB_BRANCH", DEFAULT_BRANCH),
    path: readEnv("GITHUB_FILE_PATH", DEFAULT_PATH),
    requiresSecret: Boolean(readEnv("BACKOFFICE_PUBLISH_SECRET"))
  });
}

export async function POST(request) {
  const githubToken = readEnv("GITHUB_TOKEN");
  const githubRepo = readEnv("GITHUB_REPO");
  const githubBranch = readEnv("GITHUB_BRANCH", DEFAULT_BRANCH);
  const githubFilePath = readEnv("GITHUB_FILE_PATH", DEFAULT_PATH);
  const publishSecret = readEnv("BACKOFFICE_PUBLISH_SECRET");

  if (!githubToken || !githubRepo) {
    return json(
      {
        ok: false,
        error: "GitHub publish env vars are missing.",
        missing: {
          GITHUB_TOKEN: !githubToken,
          GITHUB_REPO: !githubRepo
        }
      },
      500
    );
  }

  if (publishSecret) {
    const requestSecret = request.headers.get("x-backoffice-secret") || "";
    if (requestSecret !== publishSecret) {
      return json(
        {
          ok: false,
          error: "Invalid publish secret."
        },
        401
      );
    }
  }

  const repo = parseRepo(githubRepo);
  if (!repo) {
    return json(
      {
        ok: false,
        error: "GITHUB_REPO must use owner/name format."
      },
      500
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch (error) {
    return json(
      {
        ok: false,
        error: "Request body must be valid JSON."
      },
      400
    );
  }

  if (!payload || typeof payload.bundle !== "object" || !payload.bundle) {
    return json(
      {
        ok: false,
        error: "bundle is required."
      },
      400
    );
  }

  const commitMessage =
    typeof payload.commitMessage === "string" && payload.commitMessage.trim()
      ? payload.commitMessage.trim()
      : "Publish site content from backoffice";

  const content = JSON.stringify(payload.bundle, null, 2) + "\n";
  const contentBase64 = Buffer.from(content, "utf8").toString("base64");
  const baseUrl = `https://api.github.com/repos/${repo.owner}/${repo.name}/contents/${githubFilePath}`;
  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${githubToken}`,
    "X-GitHub-Api-Version": API_VERSION,
    "User-Agent": "nosearch-backoffice-publisher"
  };

  const current = await fetchJson(`${baseUrl}?ref=${encodeURIComponent(githubBranch)}`, {
    method: "GET",
    headers
  });

  let currentSha = null;
  if (current.response.ok) {
    currentSha = current.data && current.data.sha ? current.data.sha : null;
  } else if (current.response.status !== 404) {
    return json(
      {
        ok: false,
        error: "Failed to read current GitHub file before publish.",
        details: current.data
      },
      502
    );
  }

  const putBody = {
    message: commitMessage,
    content: contentBase64,
    branch: githubBranch
  };

  if (currentSha) {
    putBody.sha = currentSha;
  }

  const update = await fetchJson(baseUrl, {
    method: "PUT",
    headers: {
      ...headers,
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(putBody)
  });

  if (!update.response.ok) {
    return json(
      {
        ok: false,
        error: "GitHub publish failed.",
        details: update.data
      },
      502
    );
  }

  const commit = update.data && update.data.commit ? update.data.commit : null;
  return json({
    ok: true,
    message: "Published to GitHub.",
    branch: githubBranch,
    path: githubFilePath,
    commit: commit
      ? {
          sha: commit.sha,
          html_url: commit.html_url,
          message: commit.message
        }
      : null
  });
}
