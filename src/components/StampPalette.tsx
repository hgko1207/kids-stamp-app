import { useEffect, useRef, useState } from 'react'
import { isImageSrc, getStampName } from '../utils/stamp'

interface Props {
  stamps: string[]
  selected: string
  onSelect: (stamp: string) => void
  childName?: string
  childEmoji?: string
}

// 모든 버튼 동일 크기: 이미지 영역 + 이름 영역
const BTN_CLS = 'w-24 h-28'
const IMG_AREA = 'w-full flex items-center justify-center' // 이미지/이모지 영역
const NAME_AREA = 'w-full px-2 pb-1.5 text-center' // 이름 텍스트 영역

// 2줄까지만 보이고 나머지는 안에서 스크롤
// (버튼 높이 112px x 2줄) + (줄 간격 8px) + (선택 시 확대 여유 8px) = 240px
const LIST_MAX_H = 'max-h-[240px]'

export function StampPalette({ stamps, selected, onSelect, childName, childEmoji }: Props) {
  const listRef = useRef<HTMLDivElement>(null)
  const [scrollable, setScrollable] = useState(false)

  // 2줄을 넘겨서 스크롤이 생길 때만 하단 그라데이션 힌트 표시
  useEffect(() => {
    const el = listRef.current
    if (!el) return
    const check = () => setScrollable(el.scrollHeight > el.clientHeight + 1)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [stamps.length])

  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <span>🎨</span> 어떤 도장을 찍을까요?
        </h2>
        {childName && (
          <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-full">
            {childEmoji} {childName} 도장
          </span>
        )}
      </div>

      <div className="relative">
        <div
          ref={listRef}
          className={`flex flex-wrap gap-2 overflow-y-auto overscroll-contain px-1 py-1 -mx-1 ${LIST_MAX_H}`}
        >

          {/* 랜덤 버튼 */}
          <button
            onClick={() => onSelect('random')}
            className={`${BTN_CLS} shrink-0 flex flex-col items-center justify-center rounded-2xl border-2 transition-all active:scale-90 ${
              selected === 'random'
                ? 'border-indigo-500 bg-indigo-50 shadow-md scale-105'
                : 'border-gray-100 bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className={`${IMG_AREA} flex-1`}>
              <span className="text-4xl">🎲</span>
            </div>
            <div className={NAME_AREA}>
              <span className="text-[11px] font-bold text-gray-500">랜덤</span>
            </div>
          </button>

          {/* 개별 도장 버튼 */}
          {stamps.map((stamp, idx) => {
            const name = getStampName(stamp)
            return (
              <button
                key={idx}
                onClick={() => onSelect(stamp)}
                className={`${BTN_CLS} shrink-0 flex flex-col items-center rounded-2xl border-2 transition-all overflow-hidden active:scale-90 ${
                  selected === stamp
                    ? 'border-indigo-500 bg-indigo-50 shadow-md scale-105'
                    : 'border-gray-100 bg-white hover:bg-gray-50'
                }`}
              >
                <div className={`${IMG_AREA} flex-1 pt-1.5`}>
                  {isImageSrc(stamp) ? (
                    <img src={stamp} alt={name} className="w-[68px] h-[68px] object-contain" />
                  ) : (
                    <span className="text-4xl">{stamp}</span>
                  )}
                </div>
                <div className={NAME_AREA}>
                  <span className="text-[11px] font-bold text-gray-700 leading-tight block break-keep">
                    {name || stamp}
                  </span>
                </div>
              </button>
            )
          })}
        </div>

        {/* 아래에 도장이 더 있다는 힌트 */}
        {scrollable && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-7 bg-gradient-to-t from-white via-white/80 to-transparent" />
        )}
      </div>
    </div>
  )
}
