"""
Jinja2로 HTML 이메일 렌더링
"""
from pathlib import Path
from jinja2 import Environment, FileSystemLoader


_env = None

def _get_env() -> Environment:
    global _env
    if _env is None:
        tmpl_dir = Path(__file__).parent / "templates"
        _env = Environment(loader=FileSystemLoader(str(tmpl_dir)), autoescape=False)
    return _env


def render_weekly(draft: dict) -> str:
    """
    draft: generator.generate_draft() 반환값
    returns: 완성된 HTML 문자열
    """
    env = _get_env()
    tmpl = env.get_template("weekly.html")

    digest = draft["digest_data"]
    sections = draft["sections"]

    return tmpl.render(
        subject        = draft["subject"],
        week_label     = digest["week_label"],
        sections       = type("S", (), {k: v or "" for k, v in sections.items()})(),
        stats          = digest["stats"],
        top_growers    = digest["top_growers"],
        seasonal_picks = digest["seasonal_picks"],
        unsubscribe_url= "{{unsubscribeUrl}}",        # Stibee 치환 변수
    )
