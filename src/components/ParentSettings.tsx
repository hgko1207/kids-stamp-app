import { useState } from 'react'
import { X, Plus, Trash2, ChevronDown, ChevronUp, Lock, Unlock } from 'lucide-react'
import { AppData, GiftItem, GENDER_EMOJI } from '../types'
import { isImageSrc } from '../utils/stamp'

interface Props {
  appData: AppData
  initialChild?: 'son1' | 'son2'
  onSave: (data: AppData) => void
  onClose: () => void
}

type ChildKey = 'son1' | 'son2'

export function ParentSettings({ appData, initialChild = 'son1', onSave, onClose }: Props) {
  const [draft, setDraft] = useState<AppData>(JSON.parse(JSON.stringify(appData)))
  const [activeChild, setActiveChild] = useState<ChildKey>(initialChild)
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
    <div className="fixed inset-0 z-40 bg-slate-50 flex flex-col">

      {/* 헤더 */}
      <div className="bg-white border-b border-gray-100 px-5 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-100 rounded-2xl flex items-center justify-center">
            <span className="text-lg">⚙️</span>
          </div>
          <h1 className="text-xl font-extrabold text-gray-800">부모 설정</h1>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors active:scale-90"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* 아이 탭 */}
      <div className="bg-white px-4 pb-4 border-b border-gray-100">
        <div className="flex gap-2 p-1.5 bg-gray-100 rounded-2xl">
          {(['son1', 'son2'] as ChildKey[]).map(key => (
            <button
              key={key}
              onClick={() => setActiveChild(key)}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
                activeChild === key
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              {GENDER_EMOJI[draft[key].gender]} {draft[key].name}
            </button>
          ))}
        </div>
      </div>

      {/* 설정 내용 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {/* 도장 찍기 잠금 */}
        <div className={`rounded-2xl p-4 flex items-center justify-between gap-4 transition-colors ${
          child.stampLock ? 'bg-orange-50 border border-orange-200' : 'bg-white border border-gray-100'
        }`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              child.stampLock ? 'bg-orange-100' : 'bg-gray-100'
            }`}>
              {child.stampLock
                ? <Lock className="w-5 h-5 text-orange-500" />
                : <Unlock className="w-5 h-5 text-gray-400" />
              }
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-800 text-sm">도장 찍기 잠금</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-tight">
                {child.stampLock ? '오늘 날짜만 찍을 수 있어요' : '모든 날짜 자유롭게 수정 가능'}
              </p>
            </div>
          </div>
          {/* 토글 스위치 — overflow:hidden 으로 원 이탈 방지 */}
          <button
            onClick={() => update('stampLock', !child.stampLock)}
            className={`relative w-12 h-7 rounded-full transition-colors duration-200 flex-shrink-0 overflow-hidden ${
              child.stampLock ? 'bg-orange-400' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
                child.stampLock ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* 기본 정보 */}
        <Section
          title="기본 정보"
          icon="👤"
          color="bg-blue-50"
          expanded={expandedSection === 'basic'}
          onToggle={() => toggleSection('basic')}
        >
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">아이 이름</label>
              <input
                type="text"
                value={child.name}
                onChange={e => update('name', e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 text-base font-bold text-gray-800 focus:outline-none focus:border-indigo-400 focus:bg-white transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1.5 block">성별</label>
              <div className="flex gap-3">
                {(['male', 'female'] as const).map(g => (
                  <button
                    key={g}
                    onClick={() => update('gender', g)}
                    className={`flex-1 py-3.5 rounded-2xl border-2 font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                      child.gender === g
                        ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                        : 'border-gray-100 bg-white text-gray-500'
                    }`}
                  >
                    <span className="text-2xl">{GENDER_EMOJI[g]}</span>
                    {g === 'male' ? '남자아이' : '여자아이'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* 목표 도장 수 */}
        <Section
          title="이달 목표 도장 수"
          icon="🎯"
          color="bg-green-50"
          expanded={expandedSection === 'goal'}
          onToggle={() => toggleSection('goal')}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">목표</span>
              <span className="text-lg font-extrabold text-indigo-600">{child.goal}개</span>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {[5, 10, 15, 20, 25, 30].map(n => (
                <button
                  key={n}
                  onClick={() => update('goal', n)}
                  className={`py-2.5 rounded-xl font-bold text-sm transition-all ${
                    child.goal === n
                      ? 'bg-indigo-500 text-white shadow-sm'
                      : 'bg-slate-100 text-gray-600'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs text-gray-400 font-bold">직접 입력</span>
              <input
                type="number"
                min={1}
                max={31}
                value={child.goal}
                onChange={e => update('goal', Math.max(1, Math.min(31, parseInt(e.target.value) || 1)))}
                className="w-20 bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-center font-bold text-gray-800 focus:outline-none focus:border-indigo-400 focus:bg-white"
              />
              <span className="text-sm text-gray-400">개</span>
            </div>
          </div>
        </Section>

        {/* 도장 이미지 */}
        <Section
          title="도장 이미지 관리"
          icon="🎨"
          color="bg-purple-50"
          expanded={expandedSection === 'stamps'}
          onToggle={() => toggleSection('stamps')}
        >
          <div className="space-y-3">
            <div className="bg-indigo-50 rounded-xl p-3 text-xs text-indigo-600 leading-relaxed">
              <p className="font-bold mb-1">💡 이미지 추가 방법</p>
              <p>• 이미지 → <span className="font-mono font-bold">public/stamps/</span> 폴더에 넣기</p>
              <p>• + 버튼 → <span className="font-mono font-bold">/stamps/파일명.png</span> 입력</p>
              <p>• 이모지(🤖)는 바로 입력 가능</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {child.stampImages.map((stamp, idx) => (
                <div key={idx} className="relative">
                  <div className="w-16 h-16 rounded-2xl border-2 border-gray-100 bg-white shadow-sm flex items-center justify-center overflow-hidden">
                    {isImageSrc(stamp) ? (
                      <img src={stamp} alt="" className="w-[82%] h-[82%] object-contain" />
                    ) : (
                      <span className="text-2xl">{stamp}</span>
                    )}
                  </div>
                  <button
                    onClick={() => removeStamp(idx)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-sm active:scale-90"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ))}
              <button
                onClick={addStamp}
                className="w-16 h-16 rounded-2xl border-2 border-dashed border-gray-300 bg-white flex items-center justify-center hover:border-indigo-400 hover:bg-indigo-50 transition-all active:scale-90"
              >
                <Plus className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>
        </Section>

        {/* 선물 목록 */}
        <Section
          title="선물 뽑기 목록"
          icon="🎁"
          color="bg-yellow-50"
          expanded={expandedSection === 'gifts'}
          onToggle={() => toggleSection('gifts')}
        >
          <div className="space-y-2">
            {child.gifts.map(gift => (
              <div key={gift.id} className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-3.5">
                <span className="text-2xl">{gift.emoji}</span>
                <span className="flex-1 font-bold text-gray-700 text-sm">{gift.name}</span>
                <button
                  onClick={() => removeGift(gift.id)}
                  className="w-8 h-8 bg-red-50 rounded-xl flex items-center justify-center active:scale-90"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))}
            {child.gifts.length < 6 && (
              <button
                onClick={addGift}
                className="w-full py-3.5 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold text-sm hover:border-indigo-300 hover:text-indigo-400 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Plus className="w-4 h-4" /> 선물 추가 ({child.gifts.length}/6)
              </button>
            )}
          </div>
        </Section>

        {/* 데이터 관리 */}
        <Section
          title="데이터 관리"
          icon="🗑️"
          color="bg-red-50"
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
              className="w-full py-3.5 bg-orange-50 border border-orange-100 text-orange-600 rounded-2xl font-bold text-sm hover:bg-orange-100 transition-all active:scale-95"
            >
              이번 달 도장 초기화
            </button>
            <button
              onClick={() => {
                if (confirm(`${child.name}의 모든 도장 데이터를 지울까요? 복구할 수 없어요!`)) {
                  update('stamps', {})
                }
              }}
              className="w-full py-3.5 bg-red-50 border border-red-100 text-red-600 rounded-2xl font-bold text-sm hover:bg-red-100 transition-all active:scale-95"
            >
              전체 도장 초기화
            </button>
          </div>
        </Section>

        <div className="h-2" />
      </div>

      {/* 저장 버튼 */}
      <div className="bg-white border-t border-gray-100 p-4">
        <button
          onClick={() => { onSave(draft); onClose() }}
          className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-base font-extrabold rounded-2xl shadow-lg active:scale-95 transition-all tracking-wide"
        >
          저장하기 ✓
        </button>
      </div>
    </div>
  )
}

interface SectionProps {
  title: string
  icon: string
  color: string
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
}

function Section({ title, icon, color, expanded, onToggle, children }: SectionProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-4 active:bg-gray-50 transition-colors"
      >
        <span className="font-bold text-gray-800 flex items-center gap-3">
          <span className={`w-8 h-8 ${color} rounded-xl flex items-center justify-center text-base`}>
            {icon}
          </span>
          {title}
        </span>
        {expanded
          ? <ChevronUp className="w-5 h-5 text-gray-300" />
          : <ChevronDown className="w-5 h-5 text-gray-300" />
        }
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-3">
          {children}
        </div>
      )}
    </div>
  )
}
