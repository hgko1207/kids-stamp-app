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
  gender: 'male' | 'female'  // 남자: 👦, 여자: 👧
  color: string
  textColor: string
  theme?: string       // 더 이상 탭에 표시하지 않음 (하위 호환용)
  emoji?: string       // gender로 자동 설정됨 (하위 호환용)
  goal: number
  stampLock: boolean
  stamps: Record<string, StampData>
  stampImages: string[]
  gifts: GiftItem[]
}

export const GENDER_EMOJI: Record<'male' | 'female', string> = {
  male: '👦',
  female: '👧',
}

export interface AppData {
  son1: ChildProfile
  son2: ChildProfile
}

export const DEFAULT_APP_DATA: AppData = {
  son1: {
    name: '첫째',
    gender: 'male',
    color: 'blue',
    textColor: 'text-blue-600',
    goal: 20,
    stampLock: true,
    stamps: {},
    stampImages: [
      '/stamps/이글하이더.jpg',
      '/stamps/마이티캅스.jpg',
      '/stamps/파워크루저.jpg',
      '/stamps/사파리세이버.jpg',
      '/stamps/스타가디언.png',
    ],
    gifts: [
      { id: '1', emoji: '🍦', name: '아이스크림' },
      { id: '2', emoji: '🎮', name: '게임 30분' },
      { id: '3', emoji: '🧸', name: '장난감' },
      { id: '4', emoji: '🍕', name: '피자 파티' },
    ],
  },
  son2: {
    name: '둘째',
    gender: 'male',
    color: 'red',
    textColor: 'text-red-500',
    goal: 20,
    stampLock: true,
    stamps: {},
    stampImages: [
      '/stamps/이글하이더.jpg',
      '/stamps/마이티캅스.jpg',
      '/stamps/파워크루저.jpg',
      '/stamps/사파리세이버.jpg',
      '/stamps/스타가디언.png',
    ],
    gifts: [
      { id: '1', emoji: '🍦', name: '아이스크림' },
      { id: '2', emoji: '🎮', name: '게임 30분' },
      { id: '3', emoji: '🧸', name: '장난감' },
      { id: '4', emoji: '🎠', name: '놀이공원' },
    ],
  },
}
