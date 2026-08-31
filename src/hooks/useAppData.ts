import { useState, useEffect } from 'react'
import { AppData, DEFAULT_APP_DATA, StampData, GiftItem } from '../types'
import { CHILD1_STAMP_ASSETS, CHILD2_STAMP_ASSETS } from '../utils/stampAssets'
import { getStampName } from '../utils/stamp'

const STORAGE_KEY = 'kids-stamp-app-v1'

// 파일명(해시/확장자 제거)으로 두 문자열 매칭
function bareFilename(url: string): string {
  return getStampName(url).toLowerCase()
}

// 구버전 경로(/stamps/파일명.jpg)를 새 에셋 URL로 마이그레이션
function migrateIcon(icon: string, assets: string[]): string {
  if (!icon.startsWith('/stamps/')) return icon
  const oldName = bareFilename(icon)
  const matched = assets.find(a => bareFilename(a) === oldName)
  return matched ?? icon
}

function migrateStamps(
  stamps: Record<string, StampData>,
  assets: string[]
): Record<string, StampData> {
  return Object.fromEntries(
    Object.entries(stamps).map(([k, v]) => [k, { ...v, icon: migrateIcon(v.icon, assets) }])
  )
}

// 손대지 않은 구버전 기본 선물 목록 — 이것과 일치하면 새 기본값으로 교체한다
const LEGACY_GIFT_NAMES = [
  ['아이스크림', '게임 30분', '장난감', '피자 파티'].join('|'),
  ['아이스크림', '게임 30분', '장난감', '놀이공원'].join('|'),
]

/**
 * 부모가 직접 고친 선물 목록은 절대 건드리지 않고,
 * 예전 기본값 그대로인 경우에만 새 기본값으로 바꾼다.
 */
function migrateGifts(saved: GiftItem[] | undefined, next: GiftItem[]): GiftItem[] {
  if (!saved || saved.length === 0) return next
  const key = saved.map(g => g.name).join('|')
  return LEGACY_GIFT_NAMES.includes(key) ? next : saved
}

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const base = raw ? JSON.parse(raw) as AppData : null
    const allAssets = [...CHILD1_STAMP_ASSETS, ...CHILD2_STAMP_ASSETS]
    return {
      son1: {
        ...DEFAULT_APP_DATA.son1,
        ...(base?.son1 ?? {}),
        stampImages: CHILD1_STAMP_ASSETS,
        stamps: migrateStamps(base?.son1?.stamps ?? {}, allAssets),
        gifts: migrateGifts(base?.son1?.gifts, DEFAULT_APP_DATA.son1.gifts),
      },
      son2: {
        ...DEFAULT_APP_DATA.son2,
        ...(base?.son2 ?? {}),
        stampImages: CHILD2_STAMP_ASSETS,
        stamps: migrateStamps(base?.son2?.stamps ?? {}, allAssets),
        gifts: migrateGifts(base?.son2?.gifts, DEFAULT_APP_DATA.son2.gifts),
      },
    }
  } catch {
    return {
      ...DEFAULT_APP_DATA,
      son1: { ...DEFAULT_APP_DATA.son1, stampImages: CHILD1_STAMP_ASSETS },
      son2: { ...DEFAULT_APP_DATA.son2, stampImages: CHILD2_STAMP_ASSETS },
    }
  }
}

export function useAppData() {
  const [appData, setAppData] = useState<AppData>(loadData)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData))
  }, [appData])

  return { appData, setAppData }
}
