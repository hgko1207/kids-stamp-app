/**
 * 도장 찍을 때 효과음 + 진동 피드백
 * - Web Audio API로 외부 파일 없이 "뽁!" 소리 생성
 * - iOS navigator.vibrate() 진동 (지원 기기만)
 */
export function useStampFeedback() {
  const playSound = () => {
    try {
      const ctx = new AudioContext()

      // 메인 팝 소리
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(700, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.12)
      gain.gain.setValueAtTime(0.4, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.2)

      // 작은 별 소리 (약간 뒤에)
      const osc2 = ctx.createOscillator()
      const gain2 = ctx.createGain()
      osc2.connect(gain2)
      gain2.connect(ctx.destination)
      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(1200, ctx.currentTime + 0.05)
      osc2.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.2)
      gain2.gain.setValueAtTime(0.15, ctx.currentTime + 0.05)
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
      osc2.start(ctx.currentTime + 0.05)
      osc2.stop(ctx.currentTime + 0.25)
    } catch {
      // AudioContext 미지원 환경 무시
    }
  }

  const vibrate = () => {
    try {
      if ('vibrate' in navigator) navigator.vibrate(40)
    } catch {
      // 미지원 환경 무시
    }
  }

  return () => {
    playSound()
    vibrate()
  }
}
