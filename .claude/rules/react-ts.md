---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---

# React + TypeScript 규칙

## 구조
- 화면 조각은 `src/components/`, 상태·부수효과 훅은 `src/hooks/`, 순수 계산은 `src/utils/`(예: `progress.ts`, `streak.ts`), 타입은 `src/types.ts`에 둔다.
- 저장은 `useAppData` 훅을 통해서만 한다. 컴포넌트에서 localStorage를 직접 읽고 쓰지 않는다.
- 도장 캐릭터 이미지는 `src/assets/stamps/child1/`, `child2/`에 파일로 넣는다. 파일 이름이 캐릭터 이름이 된다.

## 코드 스타일
- 컴포넌트는 명명된 export(`export function Foo`). `App.tsx`만 default export다.
- props는 컴포넌트 파일 안의 `interface Props`로 정의한다.
- `any` 금지. tsconfig가 strict + `noUnusedLocals`/`noUnusedParameters`라 안 쓰는 변수·인자도 빌드가 실패한다.
- 스타일은 Tailwind 클래스. 인라인 `style`은 회전·진행률 너비처럼 값이 런타임에 정해질 때만 쓴다.

## 검증
- `npx tsc --noEmit -p tsconfig.app.json` 후 `npm run build`. 루트 `npx tsc --noEmit`은 아무것도 검사하지 않는다.
