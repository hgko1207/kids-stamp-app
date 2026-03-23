// Vite import.meta.glob — 빌드 시 폴더를 자동 스캔해서 URL 목록 생성
//
// 도장 이미지 추가 방법:
//   첫번째 탭 → src/assets/stamps/child1/ 폴더에 이미지 파일 넣기
//   두번째 탭 → src/assets/stamps/child2/ 폴더에 이미지 파일 넣기
//   (나중에 탭이 늘어나면 child3/, child4/ 폴더 추가)
//   파일 추가 후 npm run build 로 빌드하면 자동 반영됩니다.

const child1Modules = import.meta.glob(
  '../assets/stamps/child1/*.{png,jpg,jpeg,webp,gif,PNG,JPG,JPEG,WEBP,GIF}',
  { eager: true }
)
const child2Modules = import.meta.glob(
  '../assets/stamps/child2/*.{png,jpg,jpeg,webp,gif,PNG,JPG,JPEG,WEBP,GIF}',
  { eager: true }
)

function toUrls(modules: Record<string, unknown>): string[] {
  return Object.values(modules).map(m => (m as { default: string }).default)
}

export const CHILD1_STAMP_ASSETS: string[] = toUrls(child1Modules)
export const CHILD2_STAMP_ASSETS: string[] = toUrls(child2Modules)
