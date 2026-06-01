/**
 * Stibee 드래프트 전송 API
 * POST /api/newsletter-stibee
 *
 * Body: { subject, html }
 * Returns: { ok, emailId, message }
 */

export const config = { runtime: "edge" };

function readEnv(name) {
  return process.env[name] ?? "";
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function POST(request) {
  const stibeeKey   = readEnv("STIBEE_API_KEY");
  const listId      = readEnv("STIBEE_LIST_ID");
  const senderName  = readEnv("STIBEE_SENDER_NAME") || "노써치";
  const senderEmail = readEnv("STIBEE_SENDER_EMAIL");
  const replyTo     = readEnv("STIBEE_REPLY_TO") || senderEmail;

  if (!stibeeKey || !senderEmail) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "STIBEE_API_KEY 또는 STIBEE_SENDER_EMAIL이 설정되지 않았습니다.",
      }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: "요청 본문이 올바른 JSON이 아닙니다." }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }

  const { subject, html } = body;
  if (!subject || !html) {
    return new Response(
      JSON.stringify({ ok: false, error: "subject와 html은 필수입니다." }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }

  const payload = {
    name: subject,
    subject,
    fromName: senderName,
    fromEmail: senderEmail,
    replyTo,
    ...(listId ? { listId } : {}),
    content: { type: "html", html },
  };

  const res = await fetch("https://api.stibee.com/v2/emails", {
    method: "POST",
    headers: {
      AccessToken: stibeeKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return new Response(
      JSON.stringify({ ok: false, error: `Stibee API 오류: ${res.status}`, detail: data }),
      { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }

  const emailId = data.id ?? data.data?.id ?? "";
  return new Response(
    JSON.stringify({
      ok: true,
      emailId: String(emailId),
      message: "Stibee 드래프트 생성 완료. 대시보드에서 검토 후 발송하세요.",
    }),
    { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } }
  );
}
