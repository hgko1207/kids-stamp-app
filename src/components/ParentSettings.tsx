import { useState } from 'react'
import { X, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { AppData, GiftItem, GENDER_EMOJI } from '../types'
import { isImageSrc } from '../utils/stamp'

interface Props {
  appData: AppData
  onSave: (data: AppData) => void
  onClose: () => void
}

type ChildKey = 'son1' | 'son2'

export function ParentSettings({ appData, onSave, onClose }: Props) {
  const [draft, setDraft] = useState<AppData>(JSON.parse(JSON.stringify(appData)))
  const [activeChild, setActiveChild] = useState<ChildKey>('son1')
  const [expandedSection, setExpandedSection] = useState<string>('basic')

  const child = draft[activeChild]

  const update = (key: keyof typeof child, value: unknown) => {
    setDraft(prev => ({
      ...prev,
      [activeChild]: { ...prev[activeChild], [key]: value },
    }))
  }

  const addStamp = () => {
    const input = prompt(
      '이모지 또는 이미지 경로를 입력하세요\n\n' +
      '이모지 예시: 🤖 🚗 ⭐\n' +
      '로컬 이미지: /stamps/carbot1.png\n' +
      '인터넷 이미지: https://...'
    )
    if (input?.trim()) update('stampImages', [...child.stampImages, input.trim()])
  }

  const removeStamp = (idx: number) => {
    update('stampImages', child.stampImages.filter((_, i) => i !== idx))
  }

  const addGift = () => {
    const name = prompt('선물 이름을 입력하세요:')
    if (!name?.trim()) return
    const emoji = prompt('선물 이모지를 입력하세요 (예: 🍦):') || '🎁'
    const newGift: GiftItem = { id: Date.now().toString(), emoji, name: name.trim() }
    update('gifts', [...child.gifts, newGift])
  }

  const removeGift = (id: string) => {
    update('gifts', child.gifts.filter(g => g.id !== id))
  }

  const toggleSection = (s: string) => {
    setExpandedSection(prev => prev === s ? '' : s)
  }

  return (
    <div className="fixed inset-0 z-40 bg-white flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 pt-6 pb-4 border-b border-gray-100">
        <h1 className="text-xl font-extrabold text-gray-800">⚙️ 부모 설정</h1>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* 아이 탭 */}
      <div className="flex p-3 gap-2 border-b border-gray-100">
        {(['son1', 'son2'] as ChildKey[]).map(key => (
          <button
            key={key}
            onClick={() => setActiveChild(key)}
            className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeChild === key
                ? 'bg-indigo-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {draft[key].emoji} {draft[key].name}
          </button>
        ))}
      </div>

      {/* 설정 내용 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {/* 도장 잠금 — 항상 맨 위 노출 */}
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="font-bold text-gray-800 flex items-center gap-1.5">
              🔒 도장 찍기 잠금
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {child.stampLock
                ? '오늘 날짜만 찍을 수 있어요'
                : '모든 날짜를 자유롭게 수정할 수 있어요'}
            </p>
          </div>
          <button
            onClick={() => update('stampLock', !child.stampLock)}
            className={`relative w-14 h-8 rounded-full transition-colors duration-200 flex-shrink-0 ${
              child.stampLock ? 'bg-orange-400' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200 ${
                child.stampLock ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* 기본 정보 */}
        <SectionCard
          title="기본 정보"
          icon="👤"
          expanded={expandedSection === 'basic'}
          onToggle={() => toggleSection('basic')}
        >
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">아이 이름</label>
              <input
                type="text"
                value={child.name}
                onChange={e => update('name', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-base font-bold focus:outline-none focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 mb-2 block">성별</label>
              <div className="flex gap-3">
                {(['male', 'female'] as const).map(g => (
                  <button
                    key={g}
                    onClick={() => update('gender', g)}
                    className={`flex-1 py-3 rounded-2xl border-2 font-bold text-base transition-all flex items-center justify-center gap-2 ${
                      child.gender === g
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 bg-white text-gray-600'
                    }`}
                  >
                    <span className="text-2xl">{GENDER_EMOJI[g]}</span>
                    {g === 'male' ? '남자' : '여자'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* 목표 설정 */}
        <SectionCard
          title="이달 목표 도장 수"
          icon="🎯"
          expanded={expandedSection === 'goal'}
          onToggle={() => toggleSection('goal')}
        >
          <div>
            <label className="text-xs font-bold text-gray-500 mb-2 block">
              현재: <span className="text-indigo-600 text-base">{child.goal}개</span>
            </label>
            <div className="flex gap-2 flex-wrap">
              {[5, 10, 15, 20, 25, 30].map(n => (
                <button
                  key={n}
                  onClick={() => update('goal', n)}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                    child.goal === n
                      ? 'bg-indigo-500 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {n}개
                </button>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={31}
                value={child.goal}
                onChange={e => update('goal', Math.max(1, Math.min(31, parseInt(e.target.value) || 1)))}
                className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-center font-bold focus:outline-none focus:border-indigo-400"
              />
              <span className="text-gray-500 text-sm">개 (직접 입력)</span>
            </div>
          </div>
        </SectionCard>

        {/* 도장 이미지 */}
        <SectionCard
          title="도장 이미지 관리"
          icon="🎨"
          expanded={expandedSection === 'stamps'}
          onToggle={() => toggleSection('stamps')}
        >
          <div>
            <div className="bg-indigo-50 rounded-2xl p-3 mb-3 text-xs text-indigo-700 leading-relaxed">
              <p className="font-bold mb-1">💡 캐릭터 이미지 사용법</p>
              <p>1. 이미지 파일을 <span className="font-bold">public/stamps/</span> 폴더에 넣기</p>
              <p>2. + 버튼 → <span className="font-mono font-bold">/stamps/파일명.png</span> 입력</p>
              <p className="mt-1 text-indigo-500">이모지(🤖)도 그냥 입력하면 됩니다</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {child.stampImages.map((stamp, idx) => (
                <div key={idx} className="relative">
                  <div className="w-14 h-14 rounded-2xl border-2 border-gray-100 bg-white flex items-center justify-center overflow-hidden">
                    {isImageSrc(stamp) ? (
                      <img src={stamp} alt="" className="w-[80%] h-[80%] object-contain" />
                    ) : (
                      <span className="text-2xl">{stamp}</span>
                    )}
                  </div>
                  <button
                    onClick={() => removeStamp(idx)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-sm"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
              <button
                onClick={addStamp}
                className="w-14 h-14 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-indigo-400 hover:bg-indigo-50 transition-all"
              >
                <Plus className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>
        </SectionCard>

        {/* 선물 목록 */}
        <SectionCard
          title="선물 뽑기 목록"
          icon="🎁"
          expanded={expandedSection === 'gifts'}
          onToggle={() => toggleSection('gifts')}
        >
          <div className="space-y-2">
            {child.gifts.map(gift => (
              <div key={gift.id} className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3">
                <span className="text-2xl">{gift.emoji}</span>
                <span className="flex-1 font-bold text-gray-700">{gift.name}</span>
                <button onClick={() => removeGift(gift.id)}>
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))}
            {child.gifts.length < 6 && (
              <button
                onClick={addGift}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 font-bold hover:border-indigo-400 hover:text-indigo-500 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> 선물 추가
              </button>
            )}
          </div>
        </SectionCard>

        {/* 데이터 초기화 */}
        <SectionCard
          title="데이터 관리"
          icon="🗑️"
          expanded={expandedSection === 'data'}
          onToggle={() => toggleSection('data')}
        >
          <div className="space-y-2">
            <button
              onClick={() => {
                if (confirm(`${child.name}의 이번 달 도장을 모두 지울까요?`)) {
                  const now = new Date()
                  const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
                  const newStamps = Object.fromEntries(
                    Object.entries(child.stamps).filter(([k]) => !k.startsWith(prefix))
                  )
                  update('stamps', newStamps)
                }
              }}
              className="w-full py-3 bg-orange-50 text-orange-600 rounded-2xl font-bold hover:bg-orange-100 transition-all"
            >
              이번 달 도장 초기화
            </button>
            <button
              onClick={() => {
                if (confirm(`${child.name}의 모든 도장 데이터를 지울까요? 복구할 수 없어요!`)) {
                  update('stamps', {})
                }
              }}
              className="w-full py-3 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all"
            >
              전체 도장 초기화
            </button>
          </div>
        </SectionCard>
      </div>

      {/* 저장 버튼 */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => { onSave(draft); onClose() }}
          className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-lg font-bold rounded-2xl shadow-lg active:scale-95 transition-all"
        >
          저장하기 ✓
        </button>
      </div>
    </div>
  )
}

interface SectionCardProps {
  title: string
  icon: string
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

function SectionCard({ title, icon, expanded, onToggle, children }: SectionCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-4"
      >
        <span className="font-bold text-gray-800 flex items-center gap-2">
          <span>{icon}</span> {title}
        </span>
        {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50">
          <div className="pt-3">{children}</div>
        </div>
      )}
    </div>
  )
}
