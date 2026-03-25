/**
 * 문자열이 이미지 경로인지 이모지인지 판별
 */
export function isImageSrc(value: string): boolean {
  return (
    value.startsWith('http') ||
    value.startsWith('/') ||
    value.startsWith('data:image')
  )
}

/**
 * 도장 이름 추출
 * - 이미지 경로: 파일명에서 확장자 제거 (예: /stamps/드릴버스트.png → 드릴버스트)
 * - 이모지: 빈 문자열 반환 (이름 표시 안 함)
 */
export function getStampName(value: string): string {
  if (!isImageSrc(value)) return ''
  const filename = value.split('/').pop() ?? ''
  // 확장자 제거
  let name = filename.replace(/\.[^.]+$/, '')
  // URL 인코딩된 한글 디코딩 (%EC%9D%B4... → 이글하이더)
  try { name = decodeURIComponent(name) } catch { /* ignore */ }
  // Vite 해시 접미사 제거 (-Ccia_-Tg 같은 영숫자 6자 이상)
  name = name.replace(/-[A-Za-z0-9_-]{6,}$/, '')
  return name
}
