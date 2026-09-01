import { useState, useEffect } from 'react'
import { Star, Settings } from 'lucide-react'
import { useAppData } from './hooks/useAppData'
import { useStampFeedback } from './hooks/useStampFeedback'
import { ProgressCard } from './components/ProgressCard'
import { StampPalette } from './components/StampPalette'
import { Calendar } from './components/Calendar'
import { GiftPicker } from './components/GiftPicker'
import { ParentSettings } from './components/ParentSettings'
import { PraiseToast } from './components/PraiseToast'
import { AppData, GENDER_EMOJI, GiftItem } from './types'
import { getRandomPraise } from './utils/streak'
import { countStampsInMonth } from './utils/progress'

type ChildKey = 'son1' | 'son2'

export default function App() {
  const { appData, setAppData } = useAppData()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [activeTab, setActiveTab] = useState<ChildKey>('son1')
  const [selectedStamp, setSelectedStamp] = useState('random')
  const [showCelebration, setShowCelebration] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [celebrationShownFor, setCelebrationShownFor] = useState<string | null>(null)
  const [praiseMessage, setPraiseMessage] = useState<string | null>(null)

  const stampFeedback = useStampFeedback()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const profile = appData[activeTab]

  useEffect(() => {
    setSelectedStamp('random')
  }, [activeTab])

  // 달력에서 보고 있는 달이 실제 이번 달인지 (라벨용)
  const today = new Date()
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth()
  const monthLabel = isCurrentMonth ? '이번 달' : `${month + 1}월`
  const viewedMonthCount = countStampsInMonth(profile.stamps, year, month)

  const handleToggleStamp = (day: number) => {
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

    setAppData(prev => {
      const stamps = { ...prev[activeTab].stamps }

      if (stamps[dateKey]) {
        delete stamps[dateKey]
        return { ...prev, [activeTab]: { ...prev[activeTab], stamps } }
      }

      // 도장 찍기 — 효과음 + 진동 + 칭찬 메시지
      stampFeedback()
      setTimeout(() => setPraiseMessage(getRandomPraise()), 50)

      const stampArray = prev[activeTab].stampImages
      const icon =
        selectedStamp === 'random'
          ? stampArray[Math.floor(Math.random() * stampArray.length)]
          : selectedStamp
      const rotation = Math.floor(Math.random() * 30) - 15
      stamps[dateKey] = { icon, rotation }

      // 누적 기준: 마지막 선물 이후 모은 도장이 목표에 닿았는지
      const claims = prev[activeTab].claims ?? []
      const base = claims.length > 0 ? claims[claims.length - 1].atCount : 0
      const newCount = Object.keys(stamps).length - base

      // 선물을 받을 때마다 키가 바뀌므로 다음 판에서 다시 축하가 뜬다
      const goalKey = `${activeTab}-${claims.length}`
      if (newCount === prev[activeTab].goal && celebrationShownFor !== goalKey) {
        setTimeout(() => {
          setShowCelebration(true)
          setCelebrationShownFor(goalKey)
        }, 400)
      }

      return { ...prev, [activeTab]: { ...prev[activeTab], stamps } }
    })
  }

  const handleSaveSettings = (newData: AppData) => {
    setAppData(newData)
  }

  // 선물을 뽑는 순간 기록 — 이 시점의 누적 개수가 다음 판의 시작점이 된다
  const handleClaimGift = (gift: GiftItem) => {
    setAppData(prev => {
      const child = prev[activeTab]
      const now = new Date()
      const claims = child.claims ?? []
      const base = claims.length > 0 ? claims[claims.length - 1].atCount : 0
      const claim = {
        id: String(Date.now()),
        date: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
        emoji: gift.emoji,
        name: gift.name,
        // 딱 목표만큼만 소진한다 — 목표를 넘겨 모은 도장은 다음 판으로 이월된다
        atCount: base + Math.max(1, child.goal),
      }
      return { ...prev, [activeTab]: { ...child, claims: [...claims, claim] } }
    })
  }

  const tabColor = {
    son1: { active: 'bg-white text-blue-600', inactive: 'text-gray-500' },
    son2: { active: 'bg-white text-red-500', inactive: 'text-gray-500' },
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="w-full bg-white min-h-screen flex flex-col">

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
                {GENDER_EMOJI[appData[key].gender]} {appData[key].name}
              </button>
            ))}
          </div>
        </div>

        {/* 본문 */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          <ProgressCard
            profile={profile}
            monthCount={viewedMonthCount}
            monthLabel={monthLabel}
            onShowPicker={() => setShowCelebration(true)}
          />

          <StampPalette
            stamps={profile.stampImages}
            selected={selectedStamp}
            onSelect={setSelectedStamp}
            childName={profile.name}
            childEmoji={GENDER_EMOJI[profile.gender]}
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

      {/* 칭찬 메시지 토스트 */}
      <PraiseToast
        message={praiseMessage}
        onDone={() => setPraiseMessage(null)}
      />

      {/* 선물 고르기 모달 */}
      {showCelebration && (
        <GiftPicker
          childName={profile.name}
          gifts={profile.gifts}
          goalCount={profile.goal}
          onClaim={handleClaimGift}
          onClose={() => setShowCelebration(false)}
        />
      )}

      {/* 부모 설정 */}
      {showSettings && (
        <ParentSettings
          appData={appData}
          initialChild={activeTab}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
