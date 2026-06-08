# Claude Code 커스텀 스킬 저장소

이 폴더는 Claude Code의 프로젝트 전용 슬래시 커맨드(스킬)를 저장합니다.
이 레포지토리를 클론하면 어느 PC에서도 동일한 스킬을 사용할 수 있습니다.

## 사용 방법

`.claude/commands/` 폴더에 `.md` 파일을 추가하면 Claude Code에서 슬래시 커맨드로 사용 가능합니다.

```
.claude/commands/my-skill.md  →  /my-skill
```

## 파일 형식

각 `.md` 파일은 Claude에게 전달할 프롬프트를 담습니다.

**예시: `.claude/commands/summarize.md`**
```markdown
현재 변경사항을 한국어로 간단히 요약해줘.
```

그러면 `/summarize` 커맨드로 실행할 수 있습니다.

## 현재 등록된 스킬

| 파일 | 커맨드 | 설명 |
|------|--------|------|
| (아직 없음) | - | - |

## 참고

- 파일명에 공백 대신 `-` 또는 `_` 사용
- 하위 폴더도 지원: `commands/sub/skill.md` → `/sub:skill`
- 공식 문서: https://docs.anthropic.com/en/docs/claude-code/slash-commands
