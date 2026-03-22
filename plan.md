# 우리아이 칭찬 달력 개발 플랜

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | 우리아이 칭찬 달력 |
| 플랫폼 | 아이패드 (PWA) + 모바일 웹 |
| 기술 스택 | React 19 + Vite + TypeScript + Tailwind CSS v3 |
| 배포 | 미정 (Vercel 또는 로컬 네트워크) |
| 목표 | 두 아들의 월별 칭찬 도장 관리 앱 |
| 개발 서버 | `npm run dev -- --host` → localhost:5173 / 192.168.219.100:5173 |

---

## 완료된 기능 ✅

### 프로젝트 세팅
- [x] Vite + React 19 + TypeScript 프로젝트 초기화
- [x] Tailwind CSS v3 설정 (`tailwind.config.js`, `postcss.config.js`)
  - 커스텀 애니메이션: `stampIn`, `fall` (폭죽), `popIn` (모달)
- [x] 아이패드 PWA 메타태그 (`apple-mobile-web-app-capable` 등)
- [x] TypeScript strict 모드, `vite-env.d.ts` 설정

### 데이터 구조 (`src/types.ts`)
- [x] `StampData` — `{ icon: string, rotation: number }`
- [x] `GiftItem` — `{ id, emoji, name }`
- [x] `ChildProfile` — 이름/이모지/테마/목표/도장맵/도장이미지목록/선물목록
- [x] `AppData` — `{ son1, son2 }`
- [x] `DEFAULT_APP_DATA` — 기본값 (첫째/둘째, 목표 20개, 기본 이모지 도장 8개씩, 선물 4개씩)

### 상태 관리 (`src/hooks/useAppData.ts`)
- [x] `useAppData` 훅 — localStorage 읽기/쓰기 자동 연동
- [x] 스토리지 키: `kids-stamp-app-v1`
- [x] 기본값 병합 처리 (새 필드 추가 시 기존 데이터 깨지지 않음)

### 메인 앱 (`src/App.tsx`)
- [x] 두 아이 탭 전환 (`son1` / `son2`)
- [x] 탭 전환 시 도장 선택 자동 초기화 (랜덤으로 리셋)
- [x] 이달 도장 개수 계산 (연/월 필터링)
- [x] 도장 찍기 로직 — 랜덤 or 선택 도장, 랜덤 각도(-15°~+15°)
- [x] 목표 달성 감지 — 달성 시 200ms 딜레이 후 룰렛 팝업 표시
- [x] 중복 팝업 방지 (`celebrationShownFor` 키로 월별 1회만)
- [x] 헤더 sticky 고정 (스크롤해도 탭/타이틀 유지)
- [x] 설정 버튼 (⚙️) → `ParentSettings` 열기

### 진행 상황 카드 (`src/components/ProgressCard.tsx`)
- [x] 이달 도장 수 / 목표 텍스트 표시
- [x] 그라디언트 프로그레스 바 (미달성: 초록, 달성: 황금)
- [x] 25% / 50% / 75% 마일스톤 구분선
- [x] 목표 개수만큼 미니 도트 표시 (채워진 것 황금색)
- [x] 목표 달성 시 "선물 뽑으러 가기" 버튼 + 펄스 애니메이션

### 도장 팔레트 (`src/components/StampPalette.tsx`)
- [x] 🎲 랜덤 버튼 (기본 선택)
- [x] 아이별 도장 이미지 목록 표시
- [x] 이모지 / 이미지 URL 자동 판별 렌더링
- [x] 선택된 도장 하이라이트 (border-indigo-500, scale-105)
- [x] 탭 전환 시 자동 랜덤 복귀

### 달력 (`src/components/Calendar.tsx`)
- [x] 월 이동 (이전/다음)
- [x] 요일 헤더 (일:빨강, 토:파랑)
- [x] 오늘 날짜 하이라이트 (indigo 테두리)
- [x] 도장 찍기/지우기 토글 (터치 1회)
- [x] 도장 표시 — 랜덤 각도 회전, `animate-stampIn` 효과
- [x] 이모지 / 이미지 URL 자동 판별 렌더링
- [x] 터치 피드백 `active:scale-90`

### 선물 뽑기 룰렛 (`src/components/GiftRoulette.tsx`)
- [x] 3단계 플로우: `intro` → `spinning` → `result`
- [x] 폭죽 이펙트 (30개 이모지 `animate-fall`)
- [x] 슬롯 스핀 애니메이션 (2.5초, cubic-bezier)
- [x] 랜덤 당첨 선물 결정 → 결과 화면 표시
- [x] "나중에 할게요" 버튼 (닫기)

### 부모 설정 (`src/components/ParentSettings.tsx`)
- [x] 전체화면 슬라이드인 UI
- [x] 아이 탭 전환 (설정 내에서)
- [x] 아코디언 섹션 (기본정보 / 목표 / 도장이미지 / 선물 / 데이터관리)
- [x] 아이 이름 / 이모지 / 테마 텍스트 편집
- [x] 목표 프리셋 버튼 (5/10/15/20/25/30개) + 직접 입력
- [x] 도장 이미지 추가(URL/이모지 prompt) / X버튼으로 삭제
- [x] 선물 추가(이름+이모지 prompt) / 삭제 (최대 6개)
- [x] 이번 달 도장 초기화 / 전체 도장 초기화 (confirm 확인)
- [x] 저장 버튼 → `appData` 업데이트 → localStorage 자동 저장

---

## 다음 작업 (구현 예정)

### 1. 헬로카봇 이미지 실제 적용
- **구현 내용**: 부모 설정 → 도장 이미지 관리에서 헬로카봇 이미지 URL 추가
- **방법**: 공식 홈페이지/검색에서 이미지 우클릭 → "이미지 주소 복사" → URL 붙여넣기
- **목적**: 아이들이 좋아하는 실제 캐릭터로 도장 사용

### 2. 도장 찍기 효과음
- **구현 내용**: `Web Audio API`로 짧은 "쾅!" 효과음 생성 (외부 파일 없이)
- **목적**: 아이들이 찍을 때마다 청각 피드백으로 재미 극대화

### 3. 연속 도장 스트릭 표시
- **구현 내용**: 오늘 기준 연속 며칠 도장 찍었는지 계산 → 프로필 카드에 🔥 N일 표시
- **목적**: 꾸준함에 대한 동기부여

### 4. 배포 (Vercel)
- **구현 내용**: `npm run build` → Vercel 무료 배포 → 고정 URL 생성
- **목적**: 어디서나 아이패드로 접속 가능한 실제 앱 환경

---

## 향후 확장

| 순위 | 기능 | 난이도 | 설명 |
|------|------|--------|------|
| 1 | 도장 효과음 | 쉬움 | Web Audio API, 외부 파일 불필요 |
| 2 | 연속 스트릭 | 보통 | 연속 달성 날 수 + 🔥 아이콘 |
| 3 | 월별 히스토리 | 보통 | 지난 달 도장 기록 요약 보기 |
| 4 | 테마 색상 변경 | 보통 | 아이별 포인트 색상 커스터마이징 |
| 5 | 달력 이미지 저장 | 어려움 | html2canvas로 이달 달력 사진 저장 |
| 6 | 알림 기능 | 어려움 | Service Worker로 매일 알림 |

---

## 파일별 역할 요약

| 파일 | 역할 |
|------|------|
| `src/types.ts` | 전체 타입 + 기본값 상수 |
| `src/hooks/useAppData.ts` | localStorage 연동 상태 훅 |
| `src/App.tsx` | 최상위 상태 조율, 탭/도장/모달 관리 |
| `src/components/ProgressCard.tsx` | 이달 진행 상황 카드 |
| `src/components/StampPalette.tsx` | 도장 선택 팔레트 |
| `src/components/Calendar.tsx` | 달력 + 도장 찍기 |
| `src/components/GiftRoulette.tsx` | 목표 달성 선물 뽑기 모달 |
| `src/components/ParentSettings.tsx` | 부모 전용 설정 화면 |
