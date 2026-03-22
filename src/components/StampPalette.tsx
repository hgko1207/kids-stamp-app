interface Props {
  stamps: string[]
  selected: string
  onSelect: (stamp: string) => void
}

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
          className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl border-2 transition-all active:scale-90 ${
            selected === 'random'
              ? 'border-indigo-500 bg-indigo-50 shadow-md scale-105'
              : 'border-gray-100 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <span className="text-2xl">🎲</span>
          <span className="text-[9px] font-bold text-gray-500 mt-0.5">랜덤</span>
        </button>

        {stamps.map((stamp, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(stamp)}
            className={`flex items-center justify-center w-14 h-14 rounded-2xl border-2 transition-all overflow-hidden active:scale-90 ${
              selected === stamp
                ? 'border-indigo-500 bg-indigo-50 shadow-md scale-105'
                : 'border-gray-100 bg-white hover:bg-gray-50'
            }`}
          >
            {stamp.startsWith('http') || stamp.startsWith('data:image') ? (
              <img src={stamp} alt="" className="w-[70%] h-[70%] object-contain" />
            ) : (
              <span className="text-3xl">{stamp}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
