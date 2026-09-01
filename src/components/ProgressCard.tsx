import { useState } from 'react'
import { Gift, Award, ChevronDown } from 'lucide-react'
import { ChildProfile } from '../types'
import { calcStreak } from '../utils/streak'
import { calcGiftProgress, monthlyBreakdown } from '../utils/progress'

interface Props {
  profile: ChildProfile
  /** 달력에서 보고 있는 달에 찍은 도장 수 */
  monthCount: number
  /** "이번 달" 또는 "8월" 처럼 보고 있는 달의 이름 */
  monthLabel: string
  onShowPicker: () => void
}

export function ProgressCard({ profile, monthCount, monthLabel, onShowPicker }: Props) {
  const { total, current, goal, remaining, reached, claimedCount } = calcGiftProgress(profile)
  const pct = Math.min((current / goal) * 100, 100)
  const streak = calcStreak(profile.stamps)

  const [showGiftNames, setShowGiftNames] = useState(false)
  const [showMonths, setShowMonths] = useState(false)
  const months = monthlyBreakdown(profile.stamps)

  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-0.5">선물까지 모은 도장</h2>
          <p className="text-gray-500 text-sm">
            목표 <span className="font-bold text-gray-700">{goal}개</span> 중{' '}
            <span className="font-bold text-indigo-600">{current}개</span> 모았어요!
          </p>
          {streak >= 2 && (
            <p className="text-orange-500 font-bold text-sm mt-1">
              🔥 {streak}일 연속 중!
            </p>
          )}
        </div>
        <div className="flex items-center justify-center w-12 h-12 bg-indigo-50 rounded-2xl shrink-0">
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
        {[25, 50, 75].map(m => (
          <div
            key={m}
            className="absolute top-1 bottom-1 w-0.5 bg-white/40"
            style={{ left: `${m}%` }}
          />
        ))}
      </div>

      {/* 도장 개수 미니 아이콘 */}
      <div className="flex gap-1 mt-2.5 flex-wrap">
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

      {/* 받을 수 있는 선물 — 무엇을 향해 모으는지 항상 눈에 두기 위한 줄 */}
      {profile.gifts.length > 0 && (
        <div className={`mt-3.5 pt-3.5 border-t rounded-b-xl ${reached ? 'border-orange-200' : 'border-slate-100'}`}>
          <button
            onClick={() => setShowGiftNames(v => !v)}
            className="w-full flex items-center justify-between mb-2 active:opacity-60 transition-opacity"
          >
            <span className="text-sm font-bold text-gray-700">
              🎁 {reached ? '선물을 고를 수 있어요!' : `${remaining}개 더 모으면 이 중 하나!`}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-300 shrink-0 transition-transform ${showGiftNames ? 'rotate-180' : ''}`}
            />
          </button>

          {showGiftNames ? (
            <div className="flex flex-wrap gap-1.5">
              {profile.gifts.map(gift => (
                <span
                  key={gift.id}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold break-keep ${
                    reached ? 'bg-orange-50 text-orange-700' : 'bg-slate-50 text-gray-500'
                  }`}
                >
                  <span className="text-base">{gift.emoji}</span>
                  {gift.name}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {profile.gifts.map(gift => (
                <span
                  key={gift.id}
                  className={`text-2xl leading-none transition-all ${reached ? '' : 'grayscale-[0.35] opacity-70'}`}
                >
                  {gift.emoji}
                </span>
              ))}
            </div>
          )}

          {reached && (
            <button
              onClick={onShowPicker}
              className="w-full mt-3 p-3.5 bg-gradient-to-r from-yellow-300 to-orange-400 text-white rounded-2xl font-bold shadow-md active:scale-95 transition-transform text-base"
            >
              🎉 선물 고르러 가기! 🎉
            </button>
          )}
        </div>
      )}

      {/* 누적 기록 — 달이 바뀌어도 절대 줄지 않는 숫자. 탭하면 월별 내역 */}
      <button
        onClick={() => setShowMonths(v => !v)}
        className="w-full mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-sm active:opacity-60 transition-opacity"
      >
        <span className="text-gray-500 flex items-center gap-1">
          🏆 지금까지 모은 도장{' '}
          <span className="font-extrabold text-gray-700">총 {total}개</span>
          <ChevronDown
            className={`w-4 h-4 text-gray-300 transition-transform ${showMonths ? 'rotate-180' : ''}`}
          />
        </span>
        <span className="text-xs text-gray-400 font-bold shrink-0">
          {monthLabel} {monthCount}개
        </span>
      </button>

      {showMonths && (
        <div className="mt-2 space-y-1">
          {months.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-2">아직 찍은 도장이 없어요</p>
          )}
          {months.map(m => (
            <div
              key={m.key}
              className="flex items-center justify-between bg-slate-50 rounded-xl px-3 py-2"
            >
              <span className="text-xs font-bold text-gray-500">{m.label}</span>
              <span className="text-xs font-extrabold text-gray-700">{m.count}개</span>
            </div>
          ))}
          {claimedCount > 0 && (
            <p className="text-xs text-gray-400 pt-1">
              🎁 지금까지 선물 {claimedCount}번 받았어요
            </p>
          )}
        </div>
      )}
    </div>
  )
}
