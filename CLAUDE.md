# 우리아이 칭찬 달력 (Kids Stamp App)

두 아이에게 칭찬 도장을 찍어 주는 아이패드용 PWA. 도장이 목표만큼 쌓이면 아이가 선물을 고른다. 사용법은 `README.md`.

- 스택: React 19 + Vite 6, TypeScript (strict), Tailwind CSS v3, lucide-react
- 저장: 기기 localStorage (`useAppData` 훅). 서버 없음
- 배포: Vercel. `master`에 push하면 자동 배포 (https://kids-stamp-app.vercel.app)

## 주요 명령어

```bash
npm run dev        # 개발 서버 (http://localhost:5173)
npm run build      # 프로덕션 빌드 (tsc -b && vite build)
npm run preview    # 빌드 결과 미리보기
```

## 검증 명령

`verify` 스킬이 이 순서로 실행한다. 실제로 실행해 확인한 명령만 적는다.

1. 타입체크: `npx tsc --noEmit -p tsconfig.app.json` (루트 `npx tsc --noEmit`은 references만 있어 아무 파일도 검사하지 않는다)
2. 린트·테스트: 없음 (eslint·테스트 러너 미설치)
3. 빌드: `npm run build`

## 폴더 구조

```
src/
├── App.tsx                  # 메인 앱 (아이 탭, 상태 조율)
├── types.ts                 # 전체 타입 + DEFAULT_APP_DATA
├── hooks/                   # useAppData(localStorage), useStampFeedback(소리·진동)
├── utils/                   # progress(누적 진행·월별 집계), streak, stamp, stampAssets
├── components/              # Calendar, StampPalette, ProgressCard, GiftPicker, ParentSettings, PraiseToast
└── assets/stamps/child1|2/  # 캐릭터 도장 이미지 (파일 이름 = 캐릭터 이름)
```

- 데이터 구조는 `src/types.ts`가 기준이다. 목표는 누적 방식: 도장 총합에서 `claims`의 마지막 `atCount`를 뺀 값이 다음 선물까지의 진행이다.

## 컨벤션

- 타입: `any` 사용 금지
- 컴포넌트: 명명된 export (`export function Foo`)
- 스타일: Tailwind 클래스만 사용, 인라인 style은 런타임 값(회전·진행률 너비)에만
- 커밋: 한글로 작성

## 아이패드 최적화 포인트

- `max-w-2xl`로 가로 제한, 세로는 스크롤
- 터치 영역 최소 44px (active:scale-90 피드백)
- `-webkit-tap-highlight-color: transparent`로 탭 하이라이트 제거
- PWA: `apple-mobile-web-app-capable` 메타태그 설정 완료

## 원칙

1. **코딩 전에 생각한다** — 모르면 모른다고 한다. 방법이 여럿이면 선택지를 먼저 보인다.
2. **단순하게** — 요청을 푸는 최소한의 코드만. 나중을 위한 추상화를 미리 넣지 않는다.
3. **요청 범위만 고친다** — 옆 코드를 겸사겸사 고치지 않는다. 다른 개선거리는 따로 제안한다.
4. **검증될 때까지** — 완료 기준을 정하고, 실제 실행 결과로 확인될 때까지 반복한다.
5. **근거를 붙인다** — 주장에는 `파일:줄`이나 실행 출력을 붙이고, 못 붙이면 "확인 안 함"이라고 쓴다.

## 작업 방식

- 파일 여러 개를 고치는 작업은 `/team-ai:plan-feature`로 계획을 세워 `plan.md`에 적고, 승인 후 구현한다.
- `plan.md` 항목을 끝내면 `[x]`로 표시하고 "완료"로 옮긴다.
- 구현 후 `/team-ai:verify`로 검증한다. 검증하지 않고 완료라고 말하지 않는다.
- 내 PC의 에이전트(`@planner`, `@implementer`, `@reviewer`, `@deployer`)도 쓸 수 있다.

## 작업 진행 방식

- 내 입력이 필요 없는 단계면 계속 진행한다. 진행 메모는 다음 작업과 같은 메시지에 쓴다.
- 나 없이는 진행할 수 없을 때, 또는 삭제처럼 되돌리기 어려운 작업 전에만 멈추고 묻는다.

## 하지 말 것

- localStorage 키(`kids-stamp-app-v1`, `src/hooks/useAppData.ts`)를 바꾸지 않는다 — 아이패드에 저장된 기록이 사라진다. 구조를 바꿀 땐 기존 데이터 마이그레이션을 넣는다.
- 도장 목표를 월별 리셋 방식으로 되돌리지 않는다 — 누적 방식이다.
- 기본 브랜치(`master`)에 직접 커밋하지 않는다. push하면 Vercel에 바로 배포된다.
- 비밀값(.env, 키)을 읽거나 코드에 넣지 않는다.
