/**
 * 뉴스레터 초안 생성 API
 * POST /api/newsletter-draft
 *
 * Body:
 *   weekLabel   string   "2026년 6월 1주차"
 *   rankings    array    [{ name, category, clicks, growthPct }, ...]
 *   season      string   "에어컨/냉방"
 *   memo        string   (선택) 에디터 메모
 *   stream      boolean  SSE 스트리밍 여부 (기본 true)
 */

export const config = { runtime: "edge" };

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5-20251001";

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
  const apiKey = readEnv("ANTHROPIC_API_KEY");
  if (!apiKey) {
    return new Response(
      JSON.stringify({ ok: false, error: "ANTHROPIC_API_KEY가 설정되지 않았습니다." }),
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

  const { weekLabel = "", rankings = [], season = "", memo = "", stream = true } = body;

  const rankingText = rankings
    .map((r, i) => `${i + 1}. ${r.category} — ${r.name}: 최근3M ${r.clicks?.toLocaleString?.() ?? r.clicks}클릭 (${r.growthPct > 0 ? "+" : ""}${r.growthPct}%)`)
    .join("\n");

  const systemPrompt = `당신은 노써치(nosearch.com) 뉴스레터 에디터입니다.
노써치는 가전/전자제품 랭킹·추천 서비스로, 매주 '랭킹 변화 + 추천 제품' 뉴스레터를 발송합니다.

작성 원칙:
- 친근하되 전문적인 톤 (반말 금지, 과도한 경어 금지)
- 데이터 수치를 자연스럽게 인용 (클릭 수, 성장률)
- 이모지 절제 (섹션당 1개 이내)
- 단락당 3~4문장, 모바일 가독성 우선
- 쿠팡 링크 방문을 자연스럽게 유도`;

  const userPrompt = `아래 데이터로 뉴스레터 초안을 작성해주세요.

주차: ${weekLabel || "이번 주"}
계절 테마: ${season || "없음"}
${memo ? `에디터 메모: ${memo}` : ""}

이번 주 TOP 랭킹:
${rankingText || "데이터 없음"}

아래 JSON 형식으로 정확히 출력하세요 (다른 텍스트 없이):
{
  "subject": "제목 (30자 이내, [노써치 위클리] 접두사 제외)",
  "opening": "인사말 (2~3문장, 계절·트렌드 자연스럽게 언급)",
  "highlight": "하이라이트 — 가장 주목할 랭킹 1개 집중 소개 (4~5문장, 수치 포함)",
  "topGrowers": "성장 랭킹 소개 (각 1~2줄, 왜 올랐는지 추론 포함)",
  "seasonalTip": "계절 추천 코멘트 (2~3문장)",
  "closing": "마무리 + nosearch.com 방문 유도 (2문장)"
}`;

  const anthropicBody = {
    model: MODEL,
    max_tokens: 1500,
    stream: stream,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  };

  const upstream = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(anthropicBody),
  });

  if (!upstream.ok) {
    const err = await upstream.text();
    return new Response(
      JSON.stringify({ ok: false, error: `Claude API 오류: ${upstream.status}`, detail: err }),
      { status: 502, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }

  if (!stream) {
    const data = await upstream.json();
    const text = data.content?.[0]?.text ?? "";
    return new Response(
      JSON.stringify({ ok: true, raw: text }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders() } }
    );
  }

  // SSE 스트리밍 — Claude delta를 그대로 클라이언트에 전달
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  (async () => {
    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        // Claude SSE 이벤트를 파싱해 delta 텍스트만 추출
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (raw === "[DONE]") continue;
          try {
            const evt = JSON.parse(raw);
            const delta = evt.delta?.text ?? "";
            if (delta) {
              await writer.write(encoder.encode(`data: ${JSON.stringify({ delta })}\n\n`));
            }
            if (evt.type === "message_stop") {
              await writer.write(encoder.encode("data: [DONE]\n\n"));
            }
          } catch {
            // 파싱 실패 무시
          }
        }
      }
    } finally {
      await writer.close();
    }
  })();

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      ...corsHeaders(),
    },
  });
}
