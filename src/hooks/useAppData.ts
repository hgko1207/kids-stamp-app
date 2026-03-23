import { useState, useEffect } from 'react'
import { AppData, DEFAULT_APP_DATA } from '../types'
import { CHILD1_STAMP_ASSETS, CHILD2_STAMP_ASSETS } from '../utils/stampAssets'

const STORAGE_KEY = 'kids-stamp-app-v1'

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const base = raw ? JSON.parse(raw) as AppData : null
    // stampImages는 항상 폴더 기반으로 덮어씀
    // → child1/, child2/ 폴더에 이미지 추가/삭제 후 빌드하면 자동 반영
    return {
      son1: { ...DEFAULT_APP_DATA.son1, ...(base?.son1 ?? {}), stampImages: CHILD1_STAMP_ASSETS },
      son2: { ...DEFAULT_APP_DATA.son2, ...(base?.son2 ?? {}), stampImages: CHILD2_STAMP_ASSETS },
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
