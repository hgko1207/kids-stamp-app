import { useEffect, useState } from 'react'

interface Props {
  message: string | null
  onDone: () => void
}

export function PraiseToast({ message, onDone }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!message) return
    setVisible(true)
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(onDone, 300)
    }, 1200)
    return () => clearTimeout(t)
  }, [message])

  if (!message) return null

  return (
    <div
      className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 pointer-events-none ${
        visible ? 'opacity-100 -translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-90'
      }`}
    >
      <div className="bg-white border-2 border-indigo-200 shadow-xl rounded-2xl px-6 py-3 text-lg font-extrabold text-indigo-600 whitespace-nowrap">
        {message}
      </div>
    </div>
  )
}
