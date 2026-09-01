import { ChildProfile } from '../types'

export interface GiftProgress {
  /** 지금까지 찍은 도장 총 개수 (달 구분 없음, 절대 줄지 않음) */
  total: number
  /** 마지막 선물 이후 모은 도장 수 — 프로그레스 바에 쓰는 값 */
  current: number
  /** 선물까지 필요한 도장 수 */
  goal: number
  /** 선물까지 남은 개수 */
  remaining: number
  /** 지금 선물을 뽑을 수 있는지 */
  reached: boolean
  /** 지금까지 받은 선물 횟수 */
  claimedCount: number
}

/**
 * 누적 방식 진행도 계산.
 *
 * 기준점은 마지막으로 받은 선물의 atCount다. goal 값을 나중에 바꿔도
 * 이미 받은 선물이 무효가 되거나 중복 지급되지 않는다.
 */
export function calcGiftProgress(profile: ChildProfile): GiftProgress {
  const total = Object.keys(profile.stamps).length
  const claims = profile.claims ?? []
  const base = claims.length > 0 ? claims[claims.length - 1].atCount : 0
  // 도장을 지우면 total이 줄 수 있으므로 음수 방지
  const current = Math.max(0, total - base)
  const goal = Math.max(1, profile.goal)

  return {
    total,
    current,
    goal,
    remaining: Math.max(0, goal - current),
    reached: current >= goal,
    claimedCount: claims.length,
  }
}

/** 특정 연/월에 찍은 도장 수 */
export function countStampsInMonth(
  stamps: ChildProfile['stamps'],
  year: number,
  month: number // 0-based
): number {
  return Object.keys(stamps).filter(key => {
    const [y, m] = key.split('-')
    return parseInt(y) === year && parseInt(m) === month + 1
  }).length
}

export interface MonthlyCount {
  key: string    // YYYY-MM
  label: string  // "2026년 8월"
  count: number
}

/** 도장을 월별로 묶어 최신 달부터 반환 — "나머지는 어느 달에 찍었지?"에 답하기 위한 것 */
export function monthlyBreakdown(stamps: ChildProfile['stamps']): MonthlyCount[] {
  const byMonth = new Map<string, number>()
  for (const dateKey of Object.keys(stamps)) {
    const ym = dateKey.slice(0, 7)
    byMonth.set(ym, (byMonth.get(ym) ?? 0) + 1)
  }
  return [...byMonth.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, count]) => {
      const [y, m] = key.split('-')
      return { key, label: `${y}년 ${parseInt(m)}월`, count }
    })
}
