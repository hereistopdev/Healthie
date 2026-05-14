import confetti from 'canvas-confetti'

/** Small burst when something lands in Done — reads better than a full-screen party */
export function burstDone(originX: number) {
  const x = Math.min(0.92, Math.max(0.08, originX / window.innerWidth))

  void confetti({
    particleCount: 86,
    spread: 62,
    startVelocity: 32,
    ticks: 220,
    gravity: 1.05,
    scalar: 0.95,
    origin: { x, y: 0.72 },
    colors: ['#6b5a8c', '#c45c3a', '#2f6f5e', '#f4d06f', '#fffdf8'],
  })
}
