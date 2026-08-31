import { ChildProfile } from '../types'
import { calcGiftProgress } from '../utils/progress'

interface Props {
  profile: ChildProfile
  onShowPicker: () => void
}

/**
 * 아이 화면에 항상 보이는 "받을 수 있는 선물" 카드.
 * 20일이라는 긴 목표가 추상적으로 느껴지지 않도록, 도장을 찍는 내내
 * 무엇을 향해 모으고 있는지 눈앞에 두는 것이 목적이다.
 */
export function GiftPreview({ profile, onShowPicker }: Props) {
  const { goal, remaining, reached } = calcGiftProgress(profile)

  if (profile.gifts.length === 0) return null

  return (
    <div
      className={`rounded-3xl p-4 shadow-sm border mb-4 transition-colors ${
        reached
          ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-orange-200'
          : 'bg-white border-slate-100'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <span>🎁</span>
          {reached ? '선물을 고를 수 있어요!' : `도장 ${goal}개 모으면 이 중 하나!`}
        </h2>
        {!reached && (
          <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2.5 py-1 rounded-full shrink-0">
            {remaining}개 남음
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {profile.gifts.map(gift => (
          <div
            key={gift.id}
            className={`w-[88px] h-[92px] flex flex-col items-center justify-center gap-1.5 px-1.5 rounded-2xl border transition-all ${
              reached
                ? 'bg-white border-orange-200 shadow-sm'
                : 'bg-slate-50 border-slate-100'
            }`}
          >
            <span className={`text-3xl transition-all ${reached ? '' : 'grayscale-[0.35] opacity-70'}`}>
              {gift.emoji}
            </span>
            <span className="text-[10px] font-bold text-gray-500 text-center leading-tight break-keep">
              {gift.name}
            </span>
          </div>
        ))}
      </div>

      {reached ? (
        <button
          onClick={onShowPicker}
          className="w-full mt-3 p-3.5 bg-gradient-to-r from-yellow-300 to-orange-400 text-white rounded-2xl font-bold shadow-md active:scale-95 transition-transform text-base"
        >
          🎉 지금 선물 고르러 가기! 🎉
        </button>
      ) : (
        <p className="text-center text-xs text-gray-400 mt-3">
          {remaining}개만 더 모으면 이 중에서 <span className="font-bold text-gray-500">직접 골라요</span> ✨
        </p>
      )}
    </div>
  )
}
