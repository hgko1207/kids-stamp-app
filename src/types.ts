export interface StampData {
  icon: string
  rotation: number
}

export interface GiftItem {
  id: string
  emoji: string
  name: string
}

/** 선물을 받은 기록 — 누적 도장에서 어디까지 보상받았는지 기준점이 된다 */
export interface GiftClaim {
  id: string
  date: string     // 선물을 받은 날짜 (YYYY-MM-DD)
  emoji: string
  name: string
  atCount: number  // 여기까지의 도장을 보상으로 소진했다는 기준점 (다음 판의 시작 위치)
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
  claims: GiftClaim[]
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
      { id: '1', emoji: '🎢', name: '놀이공원 가기' },
      { id: '2', emoji: '🦁', name: '동물원 가기' },
      { id: '3', emoji: '🏰', name: '키즈카페 가기' },
      { id: '4', emoji: '🏊', name: '수영장 가기' },
      { id: '5', emoji: '🎭', name: '뮤지컬 보러 가기' },
      { id: '6', emoji: '🧸', name: '장난감 사러 가기' },
      { id: '7', emoji: '🃏', name: '포켓몬 카드 사기' },
      { id: '8', emoji: '📺', name: '하루 종일 TV 보기' },
      { id: '9', emoji: '🎮', name: '하루 종일 게임하기' },
    ],
    claims: [],
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
      { id: '1', emoji: '🎢', name: '놀이공원 가기' },
      { id: '2', emoji: '🦁', name: '동물원 가기' },
      { id: '3', emoji: '🏰', name: '키즈카페 가기' },
      { id: '4', emoji: '🏊', name: '수영장 가기' },
      { id: '5', emoji: '🎭', name: '뮤지컬 보러 가기' },
      { id: '6', emoji: '🧸', name: '장난감 사러 가기' },
      { id: '7', emoji: '🃏', name: '포켓몬 카드 사기' },
      { id: '8', emoji: '📺', name: '하루 종일 TV 보기' },
      { id: '9', emoji: '🎮', name: '하루 종일 게임하기' },
    ],
    claims: [],
  },
}
