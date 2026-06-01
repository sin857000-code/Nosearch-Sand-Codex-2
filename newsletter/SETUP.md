# 노써치 뉴스레터 자동화 — 셋업 가이드

## 전체 흐름

```
매주 목요일 오전 9시
    │
    ▼ GitHub Actions 트리거
[엑셀 데이터 읽기]  ←── Google Drive 또는 repo 내 data/
    │
    ▼
[Claude API: 초안 생성]
  • 제목 3안 → 첫 번째 채택
  • 본문 5섹션 (오프닝/하이라이트/성장랭킹/계절추천/클로징)
    │
    ▼
[HTML 렌더링]
  • Jinja2 + templates/weekly.html
    │
    ▼
[Stibee API: 드래프트 등록]
    │
    ▼
[팀원 검토] ← Stibee 대시보드
    │
    ▼
[발송]
```

---

## 1단계 — 로컬 설치

```bash
cd newsletter
pip install -r requirements.txt
cp .env.example .env
# .env 파일 편집 (API 키 입력)
```

## 2단계 — 데이터 파일 준비

`data/` 폴더에 Excel 파일 배치:
```
newsletter/
└── data/
    └── nosearch_data.xlsx   ← 노써치 마스터플랜 파일
```

지원 시트: `🔢 572개 랭킹 전수분류` 또는 `전체 분류`

## 3단계 — 로컬 테스트

```bash
# dry-run: Stibee 업로드 없이 HTML만 생성
python run.py --dry-run

# 생성된 HTML 확인
open output/YYYYMMDD_*.html
```

## 4단계 — GitHub Actions 설정

리포지토리 Settings > Secrets and variables > Actions 에 추가:

| Secret 이름 | 값 |
|-------------|-----|
| `ANTHROPIC_API_KEY` | Claude API 키 |
| `STIBEE_API_KEY` | 스티비 API 키 |
| `STIBEE_LIST_ID` | 스티비 주소록 ID |
| `STIBEE_SENDER_NAME` | 발신자 이름 (노써치) |
| `STIBEE_SENDER_EMAIL` | 발신 이메일 |
| `STIBEE_REPLY_TO` | 회신 이메일 |

선택적:
| Variable 이름 | 값 |
|--------------|-----|
| `SLACK_WEBHOOK_URL` | Slack Incoming Webhook URL |
| `GDRIVE_FILE_ID` | Google Drive 파일 ID |

## 5단계 — 수동 실행

GitHub Actions 탭 > `노써치 뉴스레터 자동 생성` > `Run workflow`

---

## 스티비 API 키 발급 방법

1. app.stibee.com 로그인
2. 워크스페이스 설정 (우상단 톱니바퀴)
3. API 키 메뉴
4. "새 API 키 만들기" 클릭
5. 생성된 키 복사 → GitHub Secret에 추가

## 주소록 ID 확인 방법

1. 스티비 > 주소록 탭
2. 사용할 주소록 클릭
3. URL: `app.stibee.com/lists/XXXXX` → XXXXX가 LIST_ID

---

## 커스터마이징

- **발송 요일 변경**: `.github/workflows/newsletter.yml`의 cron 수정
  - 월: `0 0 * * 1` / 화: `0 0 * * 2` / 목: `0 0 * * 4`
- **Claude 모델 변경**: `config.py`의 `CLAUDE_MODEL`
  - 비용 절감: `claude-haiku-4-5-20251001`
  - 품질 향상: `claude-sonnet-4-6`
- **템플릿 디자인 수정**: `templates/weekly.html`
