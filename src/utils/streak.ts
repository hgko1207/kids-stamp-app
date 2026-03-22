import { StampData } from '../types'

/** 오늘 기준 연속으로 도장 찍은 날 수 계산 */
export function calcStreak(stamps: Record<string, StampData>): number {
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    if (stamps[key]) {
      streak++
    } else {
      break
    }
  }
  return streak
}

const PRAISE_MESSAGES = [
  '최고야! 🌟',
  '대단해요! 👏',
  '잘했어요! 💪',
  '훌륭해요! 🎉',
  '멋있어요! 😎',
  '굿잡! 👍',
  '완벽해요! ✨',
  '짝짝짝! 🙌',
  '너무 잘했어! 🥳',
  '오늘도 최고! 🏆',
]

export function getRandomPraise(): string {
  return PRAISE_MESSAGES[Math.floor(Math.random() * PRAISE_MESSAGES.length)]
}
