import { useState, useEffect } from 'react'
import { AppData, DEFAULT_APP_DATA, StampData } from '../types'
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
      },
      son2: {
        ...DEFAULT_APP_DATA.son2,
        ...(base?.son2 ?? {}),
        stampImages: CHILD2_STAMP_ASSETS,
        stamps: migrateStamps(base?.son2?.stamps ?? {}, allAssets),
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
