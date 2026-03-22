import { useState } from 'react'
import { GiftItem } from '../types'

interface Props {
  childName: string
  gifts: GiftItem[]
  goalCount: number
  onClose: () => void
}

type Phase = 'intro' | 'spinning' | 'result'

export function GiftRoulette({ childName, gifts, goalCount, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [resultGift, setResultGift] = useState<GiftItem | null>(null)

  const handleSpin = () => {
    setPhase('spinning')

    // 랜덤으로 당첨 선물 결정
    const winner = gifts[Math.floor(Math.random() * gifts.length)]
    setResultGift(winner)

    setTimeout(() => {
      setPhase('result')
    }, 2500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      {/* 폭죽 */}
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

      <div className="relative bg-white rounded-[2rem] p-6 max-w-sm w-full text-center shadow-2xl animate-popIn">
        {phase === 'intro' && (
          <>
            <div className="text-6xl mb-3">🏆</div>
            <h2 className="text-2xl font-extrabold text-indigo-600 mb-2">대단해요!</h2>
            <p className="text-gray-700 font-bold mb-1 leading-relaxed">
              <span className="text-indigo-500 text-lg">{childName}</span>가<br />
              도장 <span className="text-orange-500 text-xl font-extrabold">{goalCount}개</span>를 모두 모았어요!
            </p>
            <p className="text-gray-500 text-sm mb-6">선물 뽑기를 해볼까요? 🎁</p>
            <button
              onClick={handleSpin}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xl font-bold rounded-2xl shadow-lg active:scale-95 transition-all"
            >
              🎰 선물 뽑기!
            </button>
            <button onClick={onClose} className="mt-3 text-gray-400 text-sm w-full py-2">
              나중에 할게요
            </button>
          </>
        )}

        {phase === 'spinning' && (
          <>
            <div className="text-5xl mb-4 animate-bounce">🎰</div>
            <h2 className="text-xl font-extrabold text-gray-800 mb-6">두구두구두구...</h2>
            {/* 슬롯 효과 */}
            <div className="overflow-hidden h-24 rounded-2xl bg-gradient-to-b from-indigo-50 to-purple-50 border-4 border-indigo-200 mx-4 mb-6 relative">
              <div
                className="flex flex-col items-center"
                style={{
                  animation: 'slotSpin 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
                }}
              >
                {gifts.map((g, i) => (
                  <div key={i} className="h-24 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-5xl">{g.emoji}</span>
                    <span className="text-sm font-bold text-gray-600">{g.name}</span>
                  </div>
                ))}
              </div>
              <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-indigo-50 to-transparent pointer-events-none" />
              <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-purple-50 to-transparent pointer-events-none" />
            </div>
            <p className="text-gray-500 text-sm">잠깐만요...</p>
          </>
        )}

        {phase === 'result' && resultGift && (
          <>
            <div className="text-8xl mb-3 animate-popIn">{resultGift.emoji}</div>
            <h2 className="text-2xl font-extrabold text-indigo-600 mb-1">당첨!</h2>
            <p className="text-3xl font-extrabold text-gray-800 mb-2">{resultGift.name}</p>
            <p className="text-gray-500 text-sm mb-6">엄마아빠한테 보여주세요! 📣</p>
            <button
              onClick={onClose}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xl font-bold rounded-2xl shadow-lg active:scale-95 transition-all"
            >
              야호! 신난다! 🎉
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes slotSpin {
          0% { transform: translateY(0); }
          100% { transform: translateY(-${96 * (gifts.length - 1)}px); }
        }
      `}</style>
    </div>
  )
}
