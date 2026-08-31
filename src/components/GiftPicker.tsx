import { useState } from 'react'
import { GiftItem } from '../types'

interface Props {
  childName: string
  gifts: GiftItem[]
  goalCount: number
  /** 아이가 선물을 확정한 순간 호출 — 이 시점에 진행도가 소진된다 */
  onClaim: (gift: GiftItem) => void
  onClose: () => void
}

type Phase = 'intro' | 'picking' | 'result'

export function GiftPicker({ childName, gifts, goalCount, onClaim, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [picked, setPicked] = useState<GiftItem | null>(null)

  // 부모가 선물을 모두 지운 경우 — 갇히지 않도록 안내하고 닫을 수 있게 한다
  if (gifts.length === 0) {
    return (
      <Backdrop>
        <div className="relative bg-white rounded-[2rem] p-6 max-w-sm w-full text-center shadow-2xl animate-popIn">
          <div className="text-6xl mb-3">🎁</div>
          <h2 className="text-xl font-extrabold text-gray-800 mb-2">선물이 아직 없어요</h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            엄마아빠한테 선물을 정해달라고 말해주세요!<br />
            (설정 → 선물 목록)
          </p>
          <button
            onClick={onClose}
            className="w-full py-4 bg-slate-100 text-gray-600 text-lg font-bold rounded-2xl active:scale-95 transition-all"
          >
            알겠어요
          </button>
        </div>
      </Backdrop>
    )
  }

  const handleConfirm = () => {
    if (!picked) return
    onClaim(picked)
    setPhase('result')
  }

  return (
    <Backdrop>
      <div className="relative bg-white rounded-[2rem] p-6 max-w-md w-full text-center shadow-2xl animate-popIn max-h-[90vh] overflow-y-auto">
        {phase === 'intro' && (
          <>
            <div className="text-6xl mb-3">🏆</div>
            <h2 className="text-2xl font-extrabold text-indigo-600 mb-2">해냈어요!</h2>
            <p className="text-gray-700 font-bold mb-1 leading-relaxed">
              <span className="text-indigo-500 text-lg">{childName}</span>가<br />
              도장 <span className="text-orange-500 text-xl font-extrabold">{goalCount}개</span>를 모두 모았어요!
            </p>
            <p className="text-gray-500 text-sm mb-6">
              열심히 모았으니까 <span className="font-bold text-gray-700">직접 고를</span> 수 있어요 🎁
            </p>
            <button
              onClick={() => setPhase('picking')}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xl font-bold rounded-2xl shadow-lg active:scale-95 transition-all"
            >
              🎁 선물 고르러 가기!
            </button>
            <button onClick={onClose} className="mt-3 text-gray-400 text-sm w-full py-2">
              나중에 할게요
            </button>
          </>
        )}

        {phase === 'picking' && (
          <>
            <h2 className="text-xl font-extrabold text-gray-800 mb-1">어떤 선물을 받을까요?</h2>
            <p className="text-gray-400 text-sm mb-5">하나만 고를 수 있어요</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
              {gifts.map(gift => {
                const isPicked = picked?.id === gift.id
                return (
                  <button
                    key={gift.id}
                    onClick={() => setPicked(gift)}
                    className={`flex flex-col items-center justify-center gap-2 p-4 min-h-[120px] rounded-2xl border-[3px] transition-all active:scale-95 ${
                      isPicked
                        ? 'border-indigo-500 bg-indigo-50 shadow-md scale-105'
                        : 'border-gray-100 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-4xl">{gift.emoji}</span>
                    <span className={`text-sm font-bold leading-tight break-keep ${
                      isPicked ? 'text-indigo-600' : 'text-gray-600'
                    }`}>
                      {gift.name}
                    </span>
                  </button>
                )
              })}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!picked}
              className={`w-full py-4 text-xl font-bold rounded-2xl transition-all ${
                picked
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg active:scale-95'
                  : 'bg-slate-100 text-gray-300'
              }`}
            >
              {picked ? `${picked.emoji} 이걸로 할래요!` : '선물을 골라주세요'}
            </button>
            <button onClick={onClose} className="mt-3 text-gray-400 text-sm w-full py-2">
              나중에 할게요
            </button>
          </>
        )}

        {phase === 'result' && picked && (
          <>
            <div className="text-8xl mb-3 animate-popIn">{picked.emoji}</div>
            <h2 className="text-2xl font-extrabold text-indigo-600 mb-1">
              {childName}의 선물!
            </h2>
            <p className="text-3xl font-extrabold text-gray-800 mb-2">{picked.name}</p>
            <p className="text-gray-500 text-sm mb-6">
              도장 {goalCount}개를 모아서 받은 거예요.<br />
              엄마아빠한테 보여주세요! 📣
            </p>
            <button
              onClick={onClose}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xl font-bold rounded-2xl shadow-lg active:scale-95 transition-all"
            >
              야호! 신난다! 🎉
            </button>
          </>
        )}
      </div>
    </Backdrop>
  )
}

/** 폭죽이 떨어지는 반투명 배경 */
function Backdrop({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => {
          const emojis = ['🎉', '🎈', '⭐', '✨', '🎁', '🎊', '🏆']
          const emoji = emojis[i % emojis.length]
          return (
            <div
              key={i}
              className="absolute animate-fall"
              style={{
                left: `${(i * 3.3) % 100}%`,
                top: '-40px',
                fontSize: `${20 + (i % 3) * 8}px`,
                animationDuration: `${2 + (i % 3)}s`,
                animationDelay: `${(i * 0.1) % 2}s`,
              }}
            >
              {emoji}
            </div>
          )
        })}
      </div>
      {children}
    </div>
  )
}
