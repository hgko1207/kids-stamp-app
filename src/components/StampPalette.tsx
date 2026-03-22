import { isImageSrc, getStampName } from '../utils/stamp'

interface Props {
  stamps: string[]
  selected: string
  onSelect: (stamp: string) => void
}

// 모든 버튼 동일 크기: 이미지 영역 + 이름 영역
const BTN_CLS = 'w-20 h-24'
const IMG_AREA = 'w-full flex items-center justify-center' // 이미지/이모지 영역
const NAME_AREA = 'w-full px-2 pb-1.5 text-center' // 이름 텍스트 영역

export function StampPalette({ stamps, selected, onSelect }: Props) {
  return (
    <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 mb-4">
      <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
        <span>🎨</span> 어떤 도장을 찍을까요?
      </h2>
      <div className="flex flex-wrap gap-2">

        {/* 랜덤 버튼 */}
        <button
          onClick={() => onSelect('random')}
          className={`${BTN_CLS} flex flex-col items-center justify-center rounded-2xl border-2 transition-all active:scale-90 ${
            selected === 'random'
              ? 'border-indigo-500 bg-indigo-50 shadow-md scale-105'
              : 'border-gray-100 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <div className={`${IMG_AREA} flex-1`}>
            <span className="text-3xl">🎲</span>
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
              className={`${BTN_CLS} flex flex-col items-center rounded-2xl border-2 transition-all overflow-hidden active:scale-90 ${
                selected === stamp
                  ? 'border-indigo-500 bg-indigo-50 shadow-md scale-105'
                  : 'border-gray-100 bg-white hover:bg-gray-50'
              }`}
            >
              <div className={`${IMG_AREA} flex-1 pt-1`}>
                {isImageSrc(stamp) ? (
                  <img src={stamp} alt={name} className="w-14 h-14 object-contain" />
                ) : (
                  <span className="text-3xl">{stamp}</span>
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
    </div>
  )
}
