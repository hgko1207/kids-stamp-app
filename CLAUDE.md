# 우리아이 칭찬 달력 (Kids Stamp App)

## 기술 스택

| 항목 | 내용 |
|------|------|
| 프레임워크 | React 19 + Vite |
| 언어 | TypeScript (strict) |
| 스타일 | Tailwind CSS v3 |
| 상태 저장 | localStorage (useAppData 훅) |
| 배포 | 미정 (Vercel 또는 로컬 PWA) |
| 패키지 매니저 | npm |

## 주요 명령어

```bash
npm run dev        # 개발 서버 (http://localhost:5173)
npm run build      # 프로덕션 빌드
npm run preview    # 빌드 결과 미리보기
npx tsc --noEmit   # 타입체크
```

## 폴더 구조

```
src/
├── App.tsx                  # 메인 앱 (탭, 상태 조율)
├── types.ts                 # 전체 타입 정의
├── hooks/
│   └── useAppData.ts        # localStorage 연동 상태 훅
└── components/
    ├── ProgressCard.tsx     # 이달 진행 상황 + 프로그레스 바
    ├── StampPalette.tsx     # 도장 선택 팔레트
    ├── Calendar.tsx         # 달력 + 도장 표시
    ├── GiftRoulette.tsx     # 목표 달성 시 선물 뽑기 모달
    └── ParentSettings.tsx   # 부모 설정 화면
```

## 핵심 데이터 구조

```typescript
AppData {
  son1: ChildProfile
  son2: ChildProfile
}

ChildProfile {
  name: string           // 아이 이름
  emoji: string          // 탭 아이콘
  theme: string          // 테마 이름
  goal: number           // 이달 목표 도장 수
  stamps: Record<string, StampData>  // { '2026-03-22': { icon, rotation } }
  stampImages: string[]  // 이모지 또는 이미지 URL
  gifts: GiftItem[]      // 선물 뽑기 목록
}
```

## 컨벤션

- 타입: `any` 사용 금지
- 컴포넌트: 명명된 export (`export function Foo`)
- 스타일: Tailwind 클래스만 사용, 인라인 style은 transform/animation에만 허용
- 커밋: 한글로 작성
- localStorage 키: `kids-stamp-app-v1`

## 아이패드 최적화 포인트

- `max-w-2xl`로 가로 제한, 세로는 스크롤
- 터치 영역 최소 44px (active:scale-90 피드백)
- `-webkit-tap-highlight-color: transparent`로 탭 하이라이트 제거
- PWA: `apple-mobile-web-app-capable` 메타태그 설정 완료

## 에이전트 사용법

| 명령 | 용도 |
|------|------|
| `@planner 기능 추가해줘` | plan.md에 플랜 작성 |
| `@implementer 구현해줘` | plan.md 기반 코드 구현 |
| `@reviewer 리뷰해줘` | 코드 리뷰 |
| `@deployer 배포해줘` | 빌드 → 커밋 → 배포 |

## 스킬 사용법

| 명령 | 용도 |
|------|------|
| `/plan 요청사항` | plan.md에 요청 정리 |
| `/deploy` | 빌드 → 커밋 → 배포 |
