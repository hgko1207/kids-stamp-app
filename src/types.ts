export interface StampData {
  icon: string
  rotation: number
}

export interface GiftItem {
  id: string
  emoji: string
  name: string
}

export interface ChildProfile {
  name: string
  emoji: string
  color: string        // Tailwind bg color class for tab active
  textColor: string    // Tailwind text color class
  theme: string
  goal: number
  stamps: Record<string, StampData>  // { '2026-03-22': { icon, rotation } }
  stampImages: string[]              // emoji or http URLs
  gifts: GiftItem[]
}

export interface AppData {
  son1: ChildProfile
  son2: ChildProfile
}

export const DEFAULT_APP_DATA: AppData = {
  son1: {
    name: '첫째',
    emoji: '👦',
    color: 'blue',
    textColor: 'text-blue-600',
    theme: '헬로카봇',
    goal: 20,
    stamps: {},
    stampImages: ['🤖', '🚗', '⚡', '🦾', '🌟', '💪', '🔥', '🏆'],
    gifts: [
      { id: '1', emoji: '🍦', name: '아이스크림' },
      { id: '2', emoji: '🎮', name: '게임 30분' },
      { id: '3', emoji: '🧸', name: '장난감' },
      { id: '4', emoji: '🍕', name: '피자 파티' },
    ],
  },
  son2: {
    name: '둘째',
    emoji: '🧒',
    color: 'red',
    textColor: 'text-red-500',
    theme: '헬로카봇',
    goal: 20,
    stamps: {},
    stampImages: ['🚒', '🚓', '🚑', '🚜', '🚁', '🚂', '🚤', '🚧'],
    gifts: [
      { id: '1', emoji: '🍦', name: '아이스크림' },
      { id: '2', emoji: '🎮', name: '게임 30분' },
      { id: '3', emoji: '🧸', name: '장난감' },
      { id: '4', emoji: '🎠', name: '놀이공원' },
    ],
  },
}
