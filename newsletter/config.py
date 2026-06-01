"""
뉴스레터 자동화 설정
환경변수(.env 또는 GitHub Secrets)로 관리
"""
import os
from dotenv import load_dotenv

load_dotenv()

# ── API Keys ──────────────────────────────────────────────────────────────────
ANTHROPIC_API_KEY = os.environ["ANTHROPIC_API_KEY"]
STIBEE_API_KEY    = os.environ["STIBEE_API_KEY"]

# ── Stibee 설정 ───────────────────────────────────────────────────────────────
STIBEE_BASE_URL      = "https://api.stibee.com/v2"
STIBEE_LIST_ID       = os.environ.get("STIBEE_LIST_ID", "")      # 주소록 ID
STIBEE_SENDER_NAME   = os.environ.get("STIBEE_SENDER_NAME", "노써치")
STIBEE_SENDER_EMAIL  = os.environ.get("STIBEE_SENDER_EMAIL", "")
STIBEE_REPLY_TO      = os.environ.get("STIBEE_REPLY_TO", "")

# ── Claude 모델 ───────────────────────────────────────────────────────────────
CLAUDE_MODEL = "claude-haiku-4-5-20251001"   # 비용 최적화; 품질 우선 시 claude-sonnet-4-6

# ── 발송 설정 ─────────────────────────────────────────────────────────────────
NEWSLETTER_SUBJECT_PREFIX = "[노써치 위클리]"
WEEKLY_SEND_DAY = "thursday"   # 발송 요일

# ── 데이터 경로 (로컬 실행 시) ────────────────────────────────────────────────
DATA_EXCEL_PATH = os.environ.get("DATA_EXCEL_PATH", "data/nosearch_data.xlsx")
