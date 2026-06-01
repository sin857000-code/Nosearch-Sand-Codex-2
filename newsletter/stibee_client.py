"""
Stibee API v2 클라이언트
공식 문서: https://stibeev2.apidocumentation.com/docs
"""
import requests
from dataclasses import dataclass
from config import STIBEE_API_KEY, STIBEE_BASE_URL, STIBEE_LIST_ID, STIBEE_SENDER_NAME, STIBEE_SENDER_EMAIL, STIBEE_REPLY_TO


@dataclass
class StibeeEmail:
    subject: str
    html_body: str
    list_id: str = ""
    sender_name: str = ""
    sender_email: str = ""
    reply_to: str = ""


class StibeeClient:
    def __init__(self, api_key: str = STIBEE_API_KEY):
        self.api_key = api_key
        self.base = STIBEE_BASE_URL
        self.headers = {
            "AccessToken": api_key,
            "Content-Type": "application/json",
        }

    def _request(self, method: str, path: str, **kwargs) -> dict:
        url = f"{self.base}{path}"
        resp = requests.request(method, url, headers=self.headers, **kwargs)
        resp.raise_for_status()
        return resp.json()

    # ── 이메일(레터) 생성 ────────────────────────────────────────────────────
    def create_email_draft(self, email: StibeeEmail) -> dict:
        """Stibee에 뉴스레터 드래프트 생성 → 팀이 UI에서 검토 후 발송"""
        payload = {
            "name": email.subject,          # 캠페인 내부 이름
            "subject": email.subject,
            "fromName": email.sender_name or STIBEE_SENDER_NAME,
            "fromEmail": email.sender_email or STIBEE_SENDER_EMAIL,
            "replyTo": email.reply_to or STIBEE_REPLY_TO,
            "listId": email.list_id or STIBEE_LIST_ID,
            "content": {
                "type": "html",
                "html": email.html_body,
            },
        }
        return self._request("POST", "/emails", json=payload)

    def get_email(self, email_id: str) -> dict:
        """생성된 이메일 상세 조회"""
        return self._request("GET", f"/emails/{email_id}")

    def list_emails(self, page: int = 1, page_size: int = 10) -> dict:
        """이메일 목록 조회"""
        return self._request("GET", "/emails", params={"page": page, "pageSize": page_size})

    # ── 구독자 관리 ──────────────────────────────────────────────────────────
    def add_subscribers(self, list_id: str, subscribers: list[dict]) -> dict:
        """
        구독자 추가 (최대 1,000명/요청)
        subscribers: [{"email": "...", "name": "...", ...}, ...]
        """
        payload = {"subscribers": subscribers[:1000]}
        return self._request("POST", f"/lists/{list_id}/subscribers", json=payload)

    def get_list_stats(self, list_id: str) -> dict:
        """주소록 통계 (구독자 수, 수신거부 수 등)"""
        return self._request("GET", f"/lists/{list_id}")

    # ── 발송 통계 ────────────────────────────────────────────────────────────
    def get_email_stats(self, email_id: str) -> dict:
        """발송 후 오픈율·클릭률 조회"""
        return self._request("GET", f"/emails/{email_id}/stats")


def push_draft_to_stibee(subject: str, html_body: str) -> str:
    """드래프트 생성 후 Stibee 이메일 ID 반환 (간편 래퍼)"""
    client = StibeeClient()
    email = StibeeEmail(subject=subject, html_body=html_body)
    result = client.create_email_draft(email)
    email_id = result.get("id") or result.get("data", {}).get("id", "")
    print(f"✅ Stibee 드래프트 생성 완료 — ID: {email_id}")
    print(f"   Stibee 대시보드에서 검토 후 발송하세요.")
    return str(email_id)
