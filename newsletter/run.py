"""
노써치 뉴스레터 자동화 메인 실행 파일

사용법:
  python run.py                          # 데이터 경로 기본값(config.py)
  python run.py --data path/to/data.xlsx # 데이터 파일 직접 지정
  python run.py --dry-run                # Stibee 업로드 없이 로컬 HTML 저장만
  python run.py --week "2026년 6월 2주차" # 주차 레이블 직접 지정
"""
import argparse
import datetime
import sys
from pathlib import Path

from config import DATA_EXCEL_PATH
from extractor import load_rankings, build_weekly_digest, digest_to_dict
from generator import generate_draft
from renderer import render_weekly
from stibee_client import push_draft_to_stibee


def current_week_label() -> str:
    today = datetime.date.today()
    week_of_month = (today.day - 1) // 7 + 1
    return f"{today.year}년 {today.month}월 {week_of_month}주차"


def save_local(html: str, subject: str) -> Path:
    out_dir = Path("output")
    out_dir.mkdir(exist_ok=True)
    slug = subject.replace(" ", "_").replace("/", "-")[:40]
    date_str = datetime.date.today().strftime("%Y%m%d")
    out_path = out_dir / f"{date_str}_{slug}.html"
    out_path.write_text(html, encoding="utf-8")
    return out_path


def main():
    parser = argparse.ArgumentParser(description="노써치 뉴스레터 자동 생성")
    parser.add_argument("--data",    default=DATA_EXCEL_PATH, help="Excel 데이터 파일 경로")
    parser.add_argument("--week",    default="",              help="주차 레이블 (기본: 자동)")
    parser.add_argument("--dry-run", action="store_true",     help="Stibee 업로드 없이 HTML 저장만")
    args = parser.parse_args()

    week_label = args.week or current_week_label()

    # 1. 데이터 추출
    print(f"📂 데이터 로드: {args.data}")
    try:
        rankings = load_rankings(args.data)
    except FileNotFoundError as e:
        print(f"❌ {e}")
        print("   --data 옵션으로 Excel 파일 경로를 지정하거나 config.py의 DATA_EXCEL_PATH를 설정하세요.")
        sys.exit(1)

    print(f"   랭킹 {len(rankings)}개 로드 완료")

    digest = build_weekly_digest(rankings, week_label)
    digest_data = digest_to_dict(digest)

    print(f"\n📊 주간 요약:")
    print(f"   주차: {week_label}")
    print(f"   노출 랭킹: {digest_data['stats']['total_active']}개")
    print(f"   성장 랭킹: {digest_data['stats']['growth_count']}개")
    if digest_data['top_growers']:
        top = digest_data['top_growers'][0]
        print(f"   최고 성장: {top['name']} ({top['growth_pct']:+.1f}%)")

    # 2. Claude로 초안 생성
    print(f"\n🤖 Claude AI 초안 생성 중...")
    draft = generate_draft(digest_data)
    print(f"   제목: {draft['subject']}")

    # 3. HTML 렌더링
    print(f"\n🎨 HTML 렌더링...")
    html = render_weekly(draft)

    # 4. 로컬 저장 (항상)
    local_path = save_local(html, draft["subject"])
    print(f"   로컬 저장: {local_path}")

    # 5. Stibee 드래프트 업로드
    if args.dry_run:
        print(f"\n⚠️  dry-run 모드 — Stibee 업로드 건너뜀")
        print(f"   HTML 파일을 브라우저로 열어 확인하세요: {local_path}")
    else:
        print(f"\n📤 Stibee 드래프트 업로드...")
        try:
            email_id = push_draft_to_stibee(draft["subject"], html)
            print(f"\n✅ 완료!")
            print(f"   Stibee 대시보드 → 이메일 목록에서 검토 후 발송하세요.")
            print(f"   이메일 ID: {email_id}")
        except Exception as e:
            print(f"❌ Stibee 업로드 실패: {e}")
            print(f"   로컬 HTML은 저장되었습니다: {local_path}")
            sys.exit(1)


if __name__ == "__main__":
    main()
