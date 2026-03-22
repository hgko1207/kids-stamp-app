import { Gift, Award } from 'lucide-react'
import { ChildProfile } from '../types'
import { calcStreak } from '../utils/streak'

interface Props {
  profile: ChildProfile
  count: number
  onShowCelebration: () => void
}

export function ProgressCard({ profile, count, onShowCelebration }: Props) {
  const pct = Math.min((count / profile.goal) * 100, 100)
  const isGoalReached = count >= profile.goal
  const streak = calcStreak(profile.stamps)

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-0.5">이번 달 칭찬 도장</h2>
          <p className="text-gray-500 text-sm">
            목표 <span className="font-bold text-gray-700">{profile.goal}개</span> 중{' '}
            <span className="font-bold text-indigo-600">{count}개</span> 모았어요!
          </p>
          {streak >= 2 && (
            <p className="text-orange-500 font-bold text-sm mt-1">
              🔥 {streak}일 연속 중!
            </p>
          )}
        </div>
        <div className="flex items-center justify-center w-12 h-12 bg-indigo-50 rounded-2xl">
          {isGoalReached
            ? <Gift className="w-7 h-7 text-indigo-500" />
            : <Award className="w-7 h-7 text-gray-400" />
          }
        </div>
      </div>

      {/* 프로그레스 바 */}
      <div className="relative h-7 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 transition-all duration-1000 ease-out rounded-full flex items-center justify-end pr-3 ${
            isGoalReached
              ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
              : 'bg-gradient-to-r from-emerald-400 to-teal-400'
          }`}
          style={{ width: `${pct}%` }}
        >
          {pct > 12 && (
            <span className="text-white text-xs font-bold drop-shadow-sm">{count}</span>
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
        {Array.from({ length: profile.goal }).map((_, i) => (
          <div
            key={i}
            className={`w-5 h-5 rounded-full transition-all duration-300 ${
              i < count
                ? 'bg-gradient-to-br from-yellow-300 to-orange-400 shadow-sm'
                : 'bg-gray-100'
            }`}
          />
        ))}
      </div>

      {isGoalReached && (
        <button
          onClick={onShowCelebration}
          className="w-full mt-4 p-3.5 bg-gradient-to-r from-yellow-300 to-orange-400 text-white rounded-2xl font-bold shadow-md active:scale-95 transition-transform animate-pulse text-base"
        >
          🎉 목표 달성! 선물 뽑으러 가기! 🎉
        </button>
      )}
    </div>
  )
}
