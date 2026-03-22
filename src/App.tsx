import { useState, useEffect } from 'react'
import { Star, Settings } from 'lucide-react'
import { useAppData } from './hooks/useAppData'
import { ProgressCard } from './components/ProgressCard'
import { StampPalette } from './components/StampPalette'
import { Calendar } from './components/Calendar'
import { GiftRoulette } from './components/GiftRoulette'
import { ParentSettings } from './components/ParentSettings'
import { AppData } from './types'

type ChildKey = 'son1' | 'son2'

export default function App() {
  const { appData, setAppData } = useAppData()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [activeTab, setActiveTab] = useState<ChildKey>('son1')
  const [selectedStamp, setSelectedStamp] = useState('random')
  const [showCelebration, setShowCelebration] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [celebrationShownFor, setCelebrationShownFor] = useState<string | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const profile = appData[activeTab]

  // 탭 전환 시 도장 선택 초기화
  useEffect(() => {
    setSelectedStamp('random')
  }, [activeTab])

  // 현재 월 도장 개수
  const currentMonthCount = Object.keys(profile.stamps).filter(key => {
    const [y, m] = key.split('-')
    return parseInt(y) === year && parseInt(m) === month + 1
  }).length

  const handleToggleStamp = (day: number) => {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    setAppData(prev => {
      const stamps = { ...prev[activeTab].stamps }

      if (stamps[dateKey]) {
        delete stamps[dateKey]
        return { ...prev, [activeTab]: { ...prev[activeTab], stamps } }
      }

      // 도장 찍기
      const stampArray = prev[activeTab].stampImages
      const icon =
        selectedStamp === 'random'
          ? stampArray[Math.floor(Math.random() * stampArray.length)]
          : selectedStamp
      const rotation = Math.floor(Math.random() * 30) - 15
      stamps[dateKey] = { icon, rotation }

      // 목표 달성 체크
      const newCount = Object.keys(stamps).filter(k => {
        const [y, m] = k.split('-')
        return parseInt(y) === year && parseInt(m) === month + 1
      }).length

      const goalKey = `${activeTab}-${year}-${month + 1}`
      if (newCount === prev[activeTab].goal && celebrationShownFor !== goalKey) {
        setTimeout(() => {
          setShowCelebration(true)
          setCelebrationShownFor(goalKey)
        }, 200)
      }

      return { ...prev, [activeTab]: { ...prev[activeTab], stamps } }
    })
  }

  const handleSaveSettings = (newData: AppData) => {
    setAppData(newData)
  }

  const tabColor = {
    son1: { active: 'bg-white text-blue-600', inactive: 'text-gray-500' },
    son2: { active: 'bg-white text-red-500', inactive: 'text-gray-500' },
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex justify-center">
      <div className="w-full max-w-2xl bg-white min-h-screen flex flex-col">

        {/* 헤더 */}
        <div className="bg-white px-5 pt-6 pb-3 border-b border-gray-100 sticky top-0 z-30">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
              <Star className="w-7 h-7 text-yellow-400 fill-yellow-400" />
              우리아이 칭찬 달력
            </h1>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2.5 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="설정"
            >
              <Settings className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* 탭 */}
          <div className="flex p-1.5 bg-gray-100 rounded-2xl gap-1">
            {(['son1', 'son2'] as ChildKey[]).map(key => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 py-2.5 text-base font-bold rounded-xl transition-all duration-200 ${
                  activeTab === key
                    ? `${tabColor[key].active} shadow-sm`
                    : tabColor[key].inactive
                }`}
              >
                {appData[key].emoji} {appData[key].name}
                <span className="text-xs font-normal text-gray-400 block sm:inline sm:ml-1.5">
                  ({appData[key].theme})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 본문 */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          <ProgressCard
            profile={profile}
            count={currentMonthCount}
            onShowCelebration={() => setShowCelebration(true)}
          />

          <StampPalette
            stamps={profile.stampImages}
            selected={selectedStamp}
            onSelect={setSelectedStamp}
          />

          <Calendar
            profile={profile}
            year={year}
            month={month}
            onPrevMonth={() => setCurrentDate(new Date(year, month - 1, 1))}
            onNextMonth={() => setCurrentDate(new Date(year, month + 1, 1))}
            onToggleStamp={handleToggleStamp}
          />

          <p className="text-center text-xs text-gray-400 pb-4">
            날짜를 터치하면 도장이 찍히고, 다시 터치하면 지워져요 ✏️
            <br />
            아이패드 사파리에서 홈 화면에 추가하면 앱처럼 쓸 수 있어요!
          </p>
        </div>
      </div>

      {/* 선물 뽑기 모달 */}
      {showCelebration && (
        <GiftRoulette
          childName={profile.name}
          gifts={profile.gifts}
          goalCount={profile.goal}
          onClose={() => setShowCelebration(false)}
        />
      )}

      {/* 부모 설정 */}
      {showSettings && (
        <ParentSettings
          appData={appData}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
