import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ChildProfile, StampData } from '../types'

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

  const blanks = Array(firstDay).fill(null)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-5 px-1">
        <button
          onClick={onPrevMonth}
          className="p-2.5 hover:bg-gray-100 rounded-full transition-colors active:scale-90"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-xl font-extrabold text-gray-800">
          {year}년 {MONTH_NAMES[month]}
        </h2>
        <button
          onClick={onNextMonth}
          className="p-2.5 hover:bg-gray-100 rounded-full transition-colors active:scale-90"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_NAMES.map((d, i) => (
          <div
            key={d}
            className={`text-center text-sm font-bold pb-2 ${
              i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-400'
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
          const isToday =
            today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year
          const dayOfWeek = new Date(year, month, day).getDay()

          return (
            <button
              key={day}
              onClick={() => onToggleStamp(day)}
              className={`relative aspect-square rounded-2xl border-2 flex items-center justify-center transition-all duration-150 shadow-sm active:scale-90
                ${isToday ? 'border-indigo-400 bg-indigo-50/40' : 'border-transparent hover:border-gray-200'}
                ${stampData ? 'bg-slate-50/60' : 'bg-white hover:bg-gray-50'}
              `}
            >
              {/* 날짜 숫자 */}
              <span
                className={`absolute top-1.5 left-2 text-xs font-semibold z-10 ${
                  dayOfWeek === 0 ? 'text-red-500' : dayOfWeek === 6 ? 'text-blue-500' : 'text-gray-700'
                }`}
              >
                {day}
              </span>

              {/* 도장 */}
              {stampData && (
                <div
                  className="absolute inset-0 flex items-center justify-center animate-stampIn pointer-events-none"
                  style={{ transform: `rotate(${stampData.rotation}deg)` }}
                >
                  {stampData.icon.startsWith('http') || stampData.icon.startsWith('data:image') ? (
                    <img src={stampData.icon} alt="" className="w-[72%] h-[72%] object-contain drop-shadow-md" />
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
