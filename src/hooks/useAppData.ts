import { useState, useEffect } from 'react'
import { AppData, DEFAULT_APP_DATA } from '../types'

const STORAGE_KEY = 'kids-stamp-app-v1'

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_APP_DATA
    const parsed = JSON.parse(raw) as AppData
    // 기본값과 병합 (새 필드 추가 시 누락 방지)
    return {
      son1: { ...DEFAULT_APP_DATA.son1, ...parsed.son1 },
      son2: { ...DEFAULT_APP_DATA.son2, ...parsed.son2 },
    }
  } catch {
    return DEFAULT_APP_DATA
  }
}

export function useAppData() {
  const [appData, setAppData] = useState<AppData>(loadData)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData))
  }, [appData])

  return { appData, setAppData }
}
