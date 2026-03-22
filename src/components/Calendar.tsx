import { ChevronLeft, ChevronRight, Lock } from 'lucide-react'
import { ChildProfile, StampData } from '../types'
import { isImageSrc } from '../utils/stamp'

interface Props {
  profile: ChildProfile
  year: number
  month: number
  onPrevMonth: () => void
  onNextMonth: () => void
  onToggleStamp: (day: number) => void
}

const MONTH_NAMES = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
const DAY_NAMES = ['일','월','화','수','목','금','토']

export function Calendar({ profile, year, month, onPrevMonth, onNextMonth, onToggleStamp }: Props) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const blanks = Array(firstDay).fill(null)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-5 px-1">
        <button
          onClick={onPrevMonth}
          className="p-2.5 hover:bg-indigo-50 rounded-full transition-colors active:scale-90"
        >
          <ChevronLeft className="w-6 h-6 text-indigo-400" />
        </button>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-extrabold text-gray-800">
            {year}년 {MONTH_NAMES[month]}
          </h2>
          {profile.stampLock && (
            <span className="flex items-center gap-1 bg-orange-50 text-orange-500 text-xs font-bold px-2 py-0.5 rounded-full border border-orange-200">
              <Lock className="w-3 h-3" /> 오늘만
            </span>
          )}
        </div>
        <button
          onClick={onNextMonth}
          className="p-2.5 hover:bg-indigo-50 rounded-full transition-colors active:scale-90"
        >
          <ChevronRight className="w-6 h-6 text-indigo-400" />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_NAMES.map((d, i) => (
          <div
            key={d}
            className={`text-center text-sm font-extrabold pb-2 ${
              i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7 gap-1.5">
        {blanks.map((_, i) => (
          <div key={`b${i}`} className="aspect-square" />
        ))}

        {days.map(day => {
          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const stampData: StampData | undefined = profile.stamps[dateKey]
          const isToday = dateKey === todayKey
          const dayOfWeek = new Date(year, month, day).getDay()

          const isLocked = profile.stampLock && !isToday

          const dayColor =
            dayOfWeek === 0 ? 'text-red-500' :
            dayOfWeek === 6 ? 'text-blue-500' :
            'text-gray-600'

          return (
            <button
              key={day}
              onClick={() => !isLocked && onToggleStamp(day)}
              disabled={isLocked}
              className={`relative aspect-square rounded-2xl flex items-center justify-center transition-all duration-150
                shadow-sm
                ${isToday
                  ? 'border-2 border-indigo-400 bg-indigo-50/40 shadow-indigo-100'
                  : stampData
                    ? 'border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50'
                    : 'border-2 border-gray-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/30 hover:shadow-md'
                }
                ${!isLocked ? 'active:scale-90' : 'cursor-default'}
              `}
            >
              {/* 날짜 숫자 */}
              <span
                className={`absolute top-1.5 left-2 text-xs font-bold z-10
                  ${isToday ? 'text-indigo-600' : dayColor}
                `}
              >
                {day}
              </span>

              {/* 도장 */}
              {stampData && (
                <div
                  className="absolute inset-0 flex items-center justify-center animate-stampIn pointer-events-none"
                  style={{ transform: `rotate(${stampData.rotation}deg)` }}
                >
                  {isImageSrc(stampData.icon) ? (
                    <img src={stampData.icon} alt="" className="w-[88%] h-[88%] object-contain drop-shadow-md" />
                  ) : (
                    <span className="text-3xl drop-shadow-md leading-none">{stampData.icon}</span>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
