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
  return filename.replace(/\.[^.]+$/, '')
}
