import { Gift, Award } from 'lucide-react'
import { ChildProfile } from '../types'
import { calcStreak } from '../utils/streak'
import { calcGiftProgress } from '../utils/progress'

interface Props {
  profile: ChildProfile
  /** 달력에서 보고 있는 달에 찍은 도장 수 */
  monthCount: number
  /** "이번 달" 또는 "8월" 처럼 보고 있는 달의 이름 */
  monthLabel: string
}

export function ProgressCard({ profile, monthCount, monthLabel }: Props) {
  const { total, current, goal, remaining, reached, claimedCount } = calcGiftProgress(profile)
  const pct = Math.min((current / goal) * 100, 100)
  const streak = calcStreak(profile.stamps)

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-0.5">선물까지 모은 도장</h2>
          <p className="text-gray-500 text-sm">
            목표 <span className="font-bold text-gray-700">{goal}개</span> 중{' '}
            <span className="font-bold text-indigo-600">{current}개</span> 모았어요!
          </p>
          {!reached && (
            <p className="text-gray-400 text-xs mt-0.5">
              {remaining}개만 더 찍으면 선물이에요 🎁
            </p>
          )}
          {streak >= 2 && (
            <p className="text-orange-500 font-bold text-sm mt-1">
              🔥 {streak}일 연속 중!
            </p>
          )}
        </div>
        <div className="flex items-center justify-center w-12 h-12 bg-indigo-50 rounded-2xl">
          {reached
            ? <Gift className="w-7 h-7 text-indigo-500" />
            : <Award className="w-7 h-7 text-gray-400" />
          }
        </div>
      </div>

      {/* 프로그레스 바 */}
      <div className="relative h-7 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 transition-all duration-1000 ease-out rounded-full flex items-center justify-end pr-3 ${
            reached
              ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
              : 'bg-gradient-to-r from-emerald-400 to-teal-400'
          }`}
          style={{ width: `${pct}%` }}
        >
          {pct > 12 && (
            <span className="text-white text-xs font-bold drop-shadow-sm">{current}</span>
          )}
        </div>
        {/* 마일스톤 표시 (25%, 50%, 75%) */}
        {[25, 50, 75].map(m => (
          <div
            key={m}
            className="absolute top-1 bottom-1 w-0.5 bg-white/40"
            style={{ left: `${m}%` }}
          />
        ))}
      </div>

      {/* 도장 개수 미니 아이콘 */}
      <div className="flex gap-1 mt-3 flex-wrap">
        {Array.from({ length: goal }).map((_, i) => (
          <div
            key={i}
            className={`w-5 h-5 rounded-full transition-all duration-300 ${
              i < current
                ? 'bg-gradient-to-br from-yellow-300 to-orange-400 shadow-sm'
                : 'bg-gray-100'
            }`}
          />
        ))}
      </div>

      {/* 누적 기록 — 달이 바뀌어도 절대 줄지 않는 숫자 */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-sm">
        <span className="text-gray-500">
          🏆 지금까지 모은 도장{' '}
          <span className="font-extrabold text-gray-700">총 {total}개</span>
        </span>
        <span className="text-xs text-gray-400 font-bold">
          {monthLabel} {monthCount}개
        </span>
      </div>
      {claimedCount > 0 && (
        <p className="text-xs text-gray-400 mt-1">
          🎁 지금까지 선물 {claimedCount}번 받았어요
        </p>
      )}

    </div>
  )
}
