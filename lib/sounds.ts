let audioCtx: AudioContext | null = null
let muted = false

const getCtx = (): AudioContext | null => {
  if (typeof window === "undefined") return null
  if (!audioCtx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    audioCtx = new Ctor()
  }
  if (audioCtx.state === "suspended") audioCtx.resume()
  return audioCtx
}

const makeNoise = (ctx: AudioContext, seconds: number): AudioBufferSourceNode => {
  const len = Math.floor(ctx.sampleRate * seconds)
  const buf = ctx.createBuffer(1, len, ctx.sampleRate)
  const ch = buf.getChannelData(0)
  for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource()
  src.buffer = buf
  return src
}

export const isMuted = () => muted
export const toggleMuted = () => {
  muted = !muted
  return muted
}

export const playWhoosh = () => {
  if (muted) return
  const ctx = getCtx()
  if (!ctx) return
  try {
    const t = ctx.currentTime
    const src = makeNoise(ctx, 0.6)
    const bp = ctx.createBiquadFilter()
    bp.type = "bandpass"
    bp.Q.value = 2
    bp.frequency.setValueAtTime(2200, t)
    bp.frequency.exponentialRampToValueAtTime(80, t + 0.5)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.1, t + 0.04)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.5)
    src.connect(bp).connect(g).connect(ctx.destination)
    src.start(t)
    src.stop(t + 0.6)
  } catch { /* audio not supported */ }
}

export const playFlip = () => {
  if (muted) return
  const ctx = getCtx()
  if (!ctx) return
  try {
    const t = ctx.currentTime

    const osc = ctx.createOscillator()
    osc.type = "sine"
    osc.frequency.setValueAtTime(900, t)
    osc.frequency.exponentialRampToValueAtTime(250, t + 0.1)
    const og = ctx.createGain()
    og.gain.setValueAtTime(0.12, t)
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.12)
    osc.connect(og).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.15)

    const n = makeNoise(ctx, 0.05)
    const hp = ctx.createBiquadFilter()
    hp.type = "highpass"
    hp.frequency.value = 4000
    const ng = ctx.createGain()
    ng.gain.setValueAtTime(0.04, t)
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.04)
    n.connect(hp).connect(ng).connect(ctx.destination)
    n.start(t)
    n.stop(t + 0.06)
  } catch { /* audio not supported */ }
}

export const playChime = () => {
  if (muted) return
  const ctx = getCtx()
  if (!ctx) return
  try {
    const t = ctx.currentTime
    const notes = [523.25, 659.25, 783.99]
    notes.forEach((freq, i) => {
      const onset = t + i * 0.12
      const osc = ctx.createOscillator()
      osc.type = "sine"
      osc.frequency.value = freq
      const g = ctx.createGain()
      g.gain.setValueAtTime(0, onset)
      g.gain.linearRampToValueAtTime(0.06, onset + 0.02)
      g.gain.exponentialRampToValueAtTime(0.001, onset + 1.2)
      osc.connect(g).connect(ctx.destination)
      osc.start(onset)
      osc.stop(onset + 1.3)

      const h = ctx.createOscillator()
      h.type = "sine"
      h.frequency.value = freq * 2
      const hg = ctx.createGain()
      hg.gain.setValueAtTime(0, onset)
      hg.gain.linearRampToValueAtTime(0.02, onset + 0.02)
      hg.gain.exponentialRampToValueAtTime(0.001, onset + 0.6)
      h.connect(hg).connect(ctx.destination)
      h.start(onset)
      h.stop(onset + 0.7)
    })
  } catch { /* audio not supported */ }
}

export const playShuffle = () => {
  if (muted) return
  const ctx = getCtx()
  if (!ctx) return
  try {
    const t = ctx.currentTime
    for (let i = 0; i < 12; i++) {
      const onset = t + i * 0.1 + Math.random() * 0.04
      const n = makeNoise(ctx, 0.04)
      const bp = ctx.createBiquadFilter()
      bp.type = "bandpass"
      bp.frequency.value = 2500 + Math.random() * 2000
      bp.Q.value = 4
      const g = ctx.createGain()
      const vol = 0.03 + Math.random() * 0.025
      g.gain.setValueAtTime(vol, onset)
      g.gain.exponentialRampToValueAtTime(0.001, onset + 0.035)
      n.connect(bp).connect(g).connect(ctx.destination)
      n.start(onset)
      n.stop(onset + 0.04)
    }
  } catch { /* audio not supported */ }
}
