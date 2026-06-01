"""
Claude API로 뉴스레터 초안 생성
"""
import json
import anthropic
from config import ANTHROPIC_API_KEY, CLAUDE_MODEL, NEWSLETTER_SUBJECT_PREFIX


_client = None

def _get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        _client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    return _client


SYSTEM_PROMPT = """당신은 노써치(nosearch.com) 뉴스레터 에디터입니다.
노써치는 가전/전자제품 랭킹·추천 서비스로, 매주 '랭킹 변화 + 추천 제품' 뉴스레터를 발송합니다.

작성 원칙:
- 친근하되 전문적인 톤 (반말 금지, 과도한 경어 금지)
- 데이터 기반 서술 — 수치를 구체적으로 인용
- 쿠팡 어필리에이트 링크를 자연스럽게 유도
- 모바일 가독성: 단락당 3~4문장 이내
- 이모지 절제 사용 (섹션당 1~2개)
- HTML 태그 없이 순수 텍스트 초안으로 작성 (템플릿에서 HTML 처리)"""


def generate_subject(digest_data: dict) -> str:
    """뉴스레터 제목 생성"""
    client = _get_client()

    top = digest_data.get("top_growers", [])
    season = digest_data.get("seasonal_picks", [])
    week = digest_data.get("week_label", "")

    hint = ""
    if top:
        hint = f"이번 주 가장 급상승한 랭킹: {top[0]['name']} ({top[0]['growth_pct']:+.0f}%)"
    elif season:
        hint = f"이번 주 계절 추천: {season[0]['category']}"

    response = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=100,
        system=SYSTEM_PROMPT,
        messages=[{
            "role": "user",
            "content": f"""뉴스레터 제목을 3가지 제안해주세요.
기간: {week}
힌트: {hint}

조건:
- 30자 이내
- 클릭을 유도하는 호기심 자극
- {NEWSLETTER_SUBJECT_PREFIX} 접두사 제외하고 제목만
- 번호 없이 한 줄씩

예시 형식:
이번 주 가장 뜨는 원룸 에어컨은?
6월 성수기, 지금 사야 할 가전 TOP5"""
        }],
    )

    lines = [l.strip() for l in response.content[0].text.strip().splitlines() if l.strip()]
    # 첫 번째 제안 반환 (검토자가 선택)
    return lines[0] if lines else f"{week} 가전 랭킹 동향"


def generate_body_sections(digest_data: dict) -> dict[str, str]:
    """뉴스레터 본문 섹션별 텍스트 생성"""
    client = _get_client()

    data_json = json.dumps(digest_data, ensure_ascii=False, indent=2)

    response = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=2000,
        system=SYSTEM_PROMPT,
        messages=[{
            "role": "user",
            "content": f"""아래 데이터를 바탕으로 뉴스레터 본문을 작성해주세요.

## 데이터
{data_json}

## 출력 형식 (섹션 구분자 포함, JSON으로 출력)
{{
  "opening": "이번 주 인사말 (2~3문장, 계절·트렌드 언급)",
  "highlight": "이번 주 하이라이트 — 가장 주목할 랭킹 1개 집중 소개 (4~6문장, 수치 포함)",
  "top_growers": "성장률 상위 랭킹 소개 (각 1~2줄씩, 왜 올랐는지 추론 포함)",
  "seasonal_tip": "계절 추천 코멘트 (2~3문장)",
  "closing": "마무리 인사 + 랭킹 페이지 방문 유도 (2문장)"
}}

JSON만 출력하세요."""
        }],
    )

    text = response.content[0].text.strip()
    # JSON 파싱 (```json 블록 제거)
    if "```" in text:
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # 파싱 실패 시 raw text를 opening에 담아 반환
        return {"opening": text, "highlight": "", "top_growers": "", "seasonal_tip": "", "closing": ""}


def generate_draft(digest_data: dict) -> dict:
    """제목 + 본문 초안 통합 생성"""
    subject = generate_subject(digest_data)
    sections = generate_body_sections(digest_data)

    return {
        "subject": f"{NEWSLETTER_SUBJECT_PREFIX} {subject}",
        "sections": sections,
        "digest_data": digest_data,
    }
