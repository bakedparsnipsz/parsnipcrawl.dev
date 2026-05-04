/**
 * dungeon.dev — Audio Engine
 * Fully procedural Web Audio API synthesis — zero copyright risk, no asset files.
 *
 * Usage:
 *   import { audioEngine } from '@/lib/audioEngine'
 *
 *   audioEngine.init()                    // call once on first user interaction
 *   audioEngine.playTrack('dungeon')      // start a music track
 *   audioEngine.stopTrack('dungeon')      // stop a music track
 *   audioEngine.stopAllTracks()           // stop everything
 *   audioEngine.playSfx('xp_small')      // one-shot sound effect
 *   audioEngine.setMasterVolume(0.7)      // 0–1
 *   audioEngine.setTrackVolume('dungeon', 0.6)
 *   audioEngine.isInitialized()           // boolean
 *   audioEngine.getAnalyser()             // AnalyserNode for visualisations
 */

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type TrackName = 'dungeon' | 'combat' | 'boss'

export type SfxName =
  | 'xp_small'
  | 'xp_big'
  | 'level_up'
  | 'room_enter'
  | 'room_clear'
  | 'loot'
  | 'combat_hit'
  | 'combat_miss'
  | 'encounter'
  | 'footstep'
  | 'menu_click'
  | 'death'

interface TrackState {
  nodes: AudioNode[]
  intervalId: ReturnType<typeof setInterval> | null
  gainNode: GainNode | null
}

// ─────────────────────────────────────────────────────────────────────────────
// NOTE FREQUENCIES (Hz)
// ─────────────────────────────────────────────────────────────────────────────

const N = {
  D2:  73.42,  A2:  110.0,  Bb2: 116.54, C3:  130.81,
  D3:  146.83, Eb3: 155.56, F3:  174.61, G3:  196.0,
  Gb3: 185.0,  A3:  220.0,  Bb3: 233.08, B3:  246.94,
  C4:  261.63, D4:  293.66, Eb4: 311.13, E4:  329.63,
  F4:  349.23, Gb4: 369.99, G4:  392.0,  Ab4: 415.3,
  A4:  440.0,  Bb4: 466.16, B4:  493.88, C5:  523.25,
  D5:  587.33, E5:  659.25, F5:  698.46, G5:  784.0,
  A5:  880.0,  D6:  1174.66,
} as const

// ─────────────────────────────────────────────────────────────────────────────
// ENGINE STATE
// ─────────────────────────────────────────────────────────────────────────────

let ctx: AudioContext | null = null
let masterGain: GainNode | null = null
let analyser: AnalyserNode | null = null
let initialized = false

const trackStates: Record<TrackName, TrackState> = {
  dungeon: { nodes: [], intervalId: null, gainNode: null },
  combat:  { nodes: [], intervalId: null, gainNode: null },
  boss:    { nodes: [], intervalId: null, gainNode: null },
}

const trackVolumes: Record<TrackName, number> = {
  dungeon: 0.6,
  combat:  0.65,
  boss:    0.65,
}

let masterVolume = 0.7

// ─────────────────────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Must be called from a user gesture (click/keydown).
 * Safe to call multiple times — only initialises once.
 */
function init(): void {
  if (initialized) return

  ctx = new (window.AudioContext || (window as any).webkitAudioContext)()

  masterGain = ctx.createGain()
  masterGain.gain.value = masterVolume

  analyser = ctx.createAnalyser()
  analyser.fftSize = 512

  masterGain.connect(analyser)
  analyser.connect(ctx.destination)

  // Per-track gain nodes
  const tracks: TrackName[] = ['dungeon', 'combat', 'boss']
  tracks.forEach((name) => {
    const g = ctx!.createGain()
    g.gain.value = trackVolumes[name]
    g.connect(masterGain!)
    trackStates[name].gainNode = g
  })

  initialized = true
}

// ─────────────────────────────────────────────────────────────────────────────
// VOLUME CONTROLS
// ─────────────────────────────────────────────────────────────────────────────

function setMasterVolume(vol: number): void {
  masterVolume = Math.max(0, Math.min(1, vol))
  if (masterGain) masterGain.gain.value = masterVolume
}

function setTrackVolume(name: TrackName, vol: number): void {
  trackVolumes[name] = Math.max(0, Math.min(1, vol))
  const state = trackStates[name]
  if (state.gainNode) state.gainNode.gain.value = trackVolumes[name]
}

// ─────────────────────────────────────────────────────────────────────────────
// LOW-LEVEL SYNTHESIS HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Schedule a single oscillator note.
 * Returns the OscillatorNode so it can be tracked for cleanup.
 */
function scheduleOsc(
  type: OscillatorType,
  freq: number,
  gainVal: number,
  dest: AudioNode,
  startTime: number,
  duration: number,
  pitchSlide?: { targetFreq: number; slideTime: number }
): OscillatorNode {
  const osc = ctx!.createOscillator()
  const g   = ctx!.createGain()

  osc.type = type
  osc.frequency.setValueAtTime(freq, startTime)

  if (pitchSlide) {
    osc.frequency.exponentialRampToValueAtTime(
      pitchSlide.targetFreq,
      startTime + pitchSlide.slideTime
    )
  }

  g.gain.setValueAtTime(gainVal, startTime)
  g.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)

  osc.connect(g)
  g.connect(dest)
  osc.start(startTime)
  osc.stop(startTime + duration + 0.05)

  return osc
}

/**
 * One-shot white noise burst — used for percussion and texture.
 */
function scheduleNoise(
  dest: AudioNode,
  startTime: number,
  duration: number,
  gainVal: number,
  filterFreq: number = 800,
  filterType: BiquadFilterType = 'lowpass'
): AudioBufferSourceNode {
  const bufSize = Math.ceil(ctx!.sampleRate * duration)
  const buf     = ctx!.createBuffer(1, bufSize, ctx!.sampleRate)
  const data    = buf.getChannelData(0)
  for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1

  const src    = ctx!.createBufferSource()
  src.buffer   = buf

  const filter = ctx!.createBiquadFilter()
  filter.type            = filterType
  filter.frequency.value = filterFreq

  const g = ctx!.createGain()
  g.gain.setValueAtTime(gainVal, startTime)
  g.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)

  src.connect(filter)
  filter.connect(g)
  g.connect(dest)
  src.start(startTime)

  return src
}

// ─────────────────────────────────────────────────────────────────────────────
// TRACK CLEANUP
// ─────────────────────────────────────────────────────────────────────────────

function cleanupTrack(name: TrackName): void {
  const state = trackStates[name]

  if (state.intervalId !== null) {
    clearInterval(state.intervalId)
    state.intervalId = null
  }

  state.nodes.forEach((node) => {
    try {
      ;(node as OscillatorNode | AudioBufferSourceNode).stop()
      node.disconnect()
    } catch {
      // already stopped — fine
    }
  })
  state.nodes = []
}

// ─────────────────────────────────────────────────────────────────────────────
// TRACK: DUNGEON AMBIENT
//
// Whimsical but creepy — think a music box playing in a haunted room.
// Key: D minor with occasional major 6th (B natural) for that bittersweet lift.
// Tempo: moderate 80 BPM with a waltz-like triplet feel.
// Layers:
//   1. Plucked music-box melody (triangle wave, short decay) — playful
//   2. Slow chromatic walking bass (sawtooth, heavy filter) — unsettling
//   3. Drone pedal on D (sine) — grounding, eerie
//   4. Occasional celesta-ish high tinkles (sine, very short) — whimsy
//   5. Off-beat noise patter — creepy texture underneath
// ─────────────────────────────────────────────────────────────────────────────

function startDungeonTrack(): void {
  const dest = trackStates['dungeon'].gainNode!

  // ── Pedal drone ──────────────────────────────────────────────────────────
  const droneOsc    = ctx!.createOscillator()
  const droneGain   = ctx!.createGain()
  const droneFilter = ctx!.createBiquadFilter()
  droneOsc.type              = 'sine'
  droneOsc.frequency.value   = N.D2
  droneFilter.type           = 'lowpass'
  droneFilter.frequency.value = 280
  droneGain.gain.value       = 0.14
  droneOsc.connect(droneFilter)
  droneFilter.connect(droneGain)
  droneGain.connect(dest)
  droneOsc.start()
  trackStates['dungeon'].nodes.push(droneOsc)

  // ── Sequencer ────────────────────────────────────────────────────────────
  // Waltz feel: step fires at 80 BPM quavers = 375ms per step
  // Melody: 16-step pattern — D minor with B natural (major 6th) for lift
  const melody: number[] = [
    N.D4,  N.F4,  N.A4,  N.C5,
    N.D5,  N.A4,  N.B4,  N.G4,   // B natural = the whimsical lift
    N.F4,  N.A4,  N.D4,  N.E4,
    N.F4,  N.C4,  N.D4,  N.A3,
  ]

  // Haunted bass walk — chromatic passing tones for unease
  const bass: number[] = [
    N.D2,  N.D2,  N.A2,  N.C3,
    N.D3,  N.Eb3, N.D3,  N.C3,   // Eb = chromatic creak
    N.Bb2, N.Bb2, N.A2,  N.C3,
    N.D3,  N.C3,  N.Gb3, N.A2,   // Gb = tritone surprise
  ]

  // High tinkle pattern — sparse, celesta-like, off the beat
  const tinkle: (number | null)[] = [
    null, N.D5,  null,  null,
    N.A5, null,  null,  N.D6,
    null, null,  N.G5,  null,
    N.F5, null,  null,  null,
  ]

  const BPM      = 80
  const stepMs   = (60 / BPM) * 500   // quaver at 80bpm ≈ 375ms
  let step       = 0
  let isRunning  = true

  function tick(): void {
    if (!isRunning || !ctx) return
    const now = ctx.currentTime

    // Melody — triangle wave, music-box pluck feel
    const melNote = melody[step % melody.length]
    scheduleOsc('triangle', melNote, 0.18, dest, now, 0.22)
    // Octave ghost — very quiet, same pitch, fades faster
    scheduleOsc('sine', melNote * 2, 0.05, dest, now, 0.12)

    // Bass — sawtooth through heavy lowpass = muffled, ominous
    const bassNote = bass[step % bass.length]
    const bassOsc  = ctx.createOscillator()
    const bassGain = ctx.createGain()
    const bassF    = ctx.createBiquadFilter()
    bassOsc.type               = 'sawtooth'
    bassOsc.frequency.value    = bassNote
    bassF.type                 = 'lowpass'
    bassF.frequency.value      = 320
    bassGain.gain.setValueAtTime(0.2, now)
    bassGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35)
    bassOsc.connect(bassF)
    bassF.connect(bassGain)
    bassGain.connect(dest)
    bassOsc.start(now)
    bassOsc.stop(now + 0.4)

    // Tinkle — triangle, very short, high register
    const tink = tinkle[step % tinkle.length]
    if (tink !== null) {
      scheduleOsc('sine', tink, 0.09, dest, now + stepMs * 0.0005, 0.15)
    }

    // Creepy noise texture — low-level, random, off-beat
    if (step % 6 === 3) {
      scheduleNoise(dest, now, 0.18, 0.04, 600, 'bandpass')
    }

    // Occasional deep thud — like something heavy shifting in the dark
    if (step % 16 === 0) {
      scheduleNoise(dest, now, 0.4,  0.12, 80,  'lowpass')
      scheduleOsc('sine', N.D2 * 0.5, 0.1, dest, now, 0.35)
    }

    // Tritone sting every 32 steps — unsettling interval poke
    if (step % 32 === 16) {
      scheduleOsc('triangle', N.Ab4, 0.07, dest, now, 0.4)
    }

    step++
  }

  tick()
  const id = setInterval(tick, stepMs)
  trackStates['dungeon'].intervalId = id

  // Cleanup reference so stop() can kill the drone too
  ;(droneOsc as any).__isRunningRef = () => isRunning
  ;(droneOsc as any).__setRunning   = (v: boolean) => { isRunning = v }
}

// ─────────────────────────────────────────────────────────────────────────────
// TRACK: COMBAT MUSIC
//
// Aggressive driving 8-bit pulse. 140 BPM, D minor, square wave rhythm.
// ─────────────────────────────────────────────────────────────────────────────

function startCombatTrack(): void {
  const dest = trackStates['combat'].gainNode!

  const bassLine: number[] = [
    N.D2, N.D2, N.A2,  N.C3,
    N.D2, N.D2, N.Bb2, N.A2,
  ]
  const melody: number[] = [
    N.D4, N.F4, N.A4, N.F4,
    N.D4, N.C4, N.Bb3, N.A3,
  ]
  const counter: number[] = [
    N.A4, N.A4, N.Bb4, N.A4,
    N.F4, N.A4, N.G4,  N.F4,
  ]

  const BPM    = 140
  const stepMs = (60 / BPM) * 500
  let step     = 0

  function tick(): void {
    if (!ctx) return
    const now = ctx.currentTime
    const s   = step % bassLine.length

    // Punchy bass
    scheduleOsc('square', bassLine[s], 0.22, dest, now, 0.16)
    // Lead melody
    scheduleOsc('square', melody[s],   0.12, dest, now, 0.20)
    // Counter melody on even steps
    if (step % 2 === 0) {
      scheduleOsc('square', counter[s], 0.08, dest, now, 0.28)
    }
    // Kick — filtered low noise
    if (step % 4 === 0) {
      scheduleNoise(dest, now, 0.07, 0.32, 180, 'lowpass')
      scheduleOsc('sine', N.D2, 0.22, dest, now, 0.07,
        { targetFreq: N.D2 * 0.4, slideTime: 0.06 }
      )
    }
    // Snare — high noise burst
    if (step % 4 === 2) {
      scheduleNoise(dest, now, 0.055, 0.22, 2200, 'highpass')
    }
    // High hat — very short noise every step
    scheduleNoise(dest, now, 0.025, 0.06, 8000, 'highpass')

    step++
  }

  tick()
  trackStates['combat'].intervalId = setInterval(tick, stepMs)
}

// ─────────────────────────────────────────────────────────────────────────────
// TRACK: BOSS MUSIC
//
// Intense, layered. 160 BPM. Diablo-inspired chromatic descent.
// Three arpeggio voices + heavy sub bass + driving percussion.
// ─────────────────────────────────────────────────────────────────────────────

function startBossTrack(): void {
  const dest = trackStates['boss'].gainNode!

  const subBass: number[] = [
    N.D2,  N.D2,  N.C3,  N.D2,
    N.Bb2, N.D2,  N.A2,  N.D2,
  ]
  const arp1: number[] = [
    N.D4, N.F4, N.A4,  N.D5,
    N.A4, N.F4, N.Eb4, N.F4,
  ]
  const arp2: number[] = [
    N.D3, N.F3, N.A3,  N.C4,
    N.Bb3, N.A3, N.Gb3, N.A3,
  ]
  const lead: number[] = [
    N.A4,  N.A4,  N.Bb4, N.A4,
    N.Gb4, N.A4,  N.E4,  N.A4,
  ]

  const BPM    = 160
  const stepMs = (60 / BPM) * 375
  let step     = 0

  function tick(): void {
    if (!ctx) return
    const now = ctx.currentTime
    const s   = step % subBass.length

    // Sub bass — sawtooth + sine layered for fatness
    scheduleOsc('sawtooth', subBass[s], 0.22, dest, now, 0.18)
    scheduleOsc('sine',     subBass[s], 0.18, dest, now, 0.20)
    // Arp voices
    scheduleOsc('square', arp1[s], 0.10, dest, now, 0.16)
    scheduleOsc('square', arp2[s], 0.09, dest, now, 0.20)
    // Lead — every other step
    if (step % 2 === 0) {
      scheduleOsc('triangle', lead[s], 0.09, dest, now, 0.28)
    }
    // Kick with pitch drop
    if (step % 4 === 0) {
      scheduleNoise(dest, now, 0.065, 0.38, 160, 'lowpass')
      scheduleOsc('sine', N.D2, 0.28, dest, now, 0.08,
        { targetFreq: N.D2 * 0.35, slideTime: 0.07 }
      )
    }
    // Snare
    if (step % 4 === 2) {
      scheduleNoise(dest, now, 0.05, 0.28, 2400, 'highpass')
    }
    // Open hi-hat every 2 steps
    if (step % 2 === 0) {
      scheduleNoise(dest, now, 0.03, 0.07, 9000, 'highpass')
    }
    // Sub boom on phrase start
    if (step % 8 === 0) {
      scheduleOsc('sine', N.D2 * 0.5, 0.28, dest, now, 0.3)
    }
    // Chromatic tension note every 16 steps
    if (step % 16 === 12) {
      scheduleOsc('sawtooth', N.Eb3, 0.12, dest, now, 0.45)
    }

    step++
  }

  tick()
  trackStates['boss'].intervalId = setInterval(tick, stepMs)
}

// ─────────────────────────────────────────────────────────────────────────────
// TRACK CONTROLS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Play a music track. Stops any currently playing track of the same name first.
 * Does NOT stop other tracks — you can layer if needed, but typical usage is one at a time.
 */
function playTrack(name: TrackName): void {
  if (!initialized) {
    console.warn('[audioEngine] Call init() before playTrack()')
    return
  }
  stopTrack(name)

  switch (name) {
    case 'dungeon': startDungeonTrack(); break
    case 'combat':  startCombatTrack();  break
    case 'boss':    startBossTrack();    break
  }
}

/**
 * Stop a specific music track.
 */
function stopTrack(name: TrackName): void {
  cleanupTrack(name)
}

/**
 * Stop all music tracks.
 */
function stopAllTracks(): void {
  const names: TrackName[] = ['dungeon', 'combat', 'boss']
  names.forEach(stopTrack)
}

/**
 * Crossfade between two tracks over the given duration (seconds).
 * Stops the old track after the fade completes.
 */
function crossfade(from: TrackName, to: TrackName, durationSec: number = 2): void {
  if (!initialized || !ctx) return
  const fromGain = trackStates[from].gainNode
  const toGain   = trackStates[to].gainNode
  const now      = ctx.currentTime

  if (fromGain) {
    fromGain.gain.setValueAtTime(trackVolumes[from], now)
    fromGain.gain.linearRampToValueAtTime(0, now + durationSec)
  }

  playTrack(to)
  if (toGain) {
    toGain.gain.setValueAtTime(0, now)
    toGain.gain.linearRampToValueAtTime(trackVolumes[to], now + durationSec)
  }

  setTimeout(() => stopTrack(from), durationSec * 1000 + 100)
}

// ─────────────────────────────────────────────────────────────────────────────
// SOUND EFFECTS
// ─────────────────────────────────────────────────────────────────────────────

function playSfx(name: SfxName): void {
  if (!initialized || !ctx) {
    console.warn('[audioEngine] Call init() before playSfx()')
    return
  }

  const dest = masterGain!
  const t    = ctx.currentTime

  switch (name) {

    // ── XP small: quick ascending chime ──
    case 'xp_small':
      scheduleOsc('sine', N.G4, 0.22, dest, t,      0.10)
      scheduleOsc('sine', N.A4, 0.22, dest, t+0.08, 0.12)
      scheduleOsc('sine', N.C5, 0.18, dest, t+0.16, 0.18)
      break

    // ── XP big: full ascending sparkle ──
    case 'xp_big':
      ;[N.D4, N.F4, N.A4, N.D5].forEach((n, i) =>
        scheduleOsc('sine', n, 0.22, dest, t + i * 0.08, 0.22))
      scheduleOsc('triangle', N.D5 * 2, 0.14, dest, t + 0.35, 0.5)
      scheduleNoise(dest, t + 0.32, 0.15, 0.08, 5000, 'highpass')
      break

    // ── Level up: triumphant fanfare ──
    case 'level_up': {
      const fanfare = [N.D4, N.F4, N.A4, N.D5, N.F5, N.A4, N.D5, N.F5]
      fanfare.forEach((n, i) => {
        scheduleOsc('square', n, 0.18, dest, t + i * 0.07, 0.18)
        if (i > 3) scheduleOsc('sine', n * 2, 0.07, dest, t + i * 0.07, 0.14)
      })
      scheduleOsc('sine',  N.D5 * 2, 0.18, dest, t + 0.62, 0.7)
      scheduleNoise(dest, t + 0.6, 0.2, 0.06, 4000, 'highpass')
      break
    }

    // ── Room enter: heavy dungeon door ──
    case 'room_enter':
      scheduleOsc('sine', N.D2, 0.38, dest, t,       0.22)
      scheduleOsc('sine', N.A2, 0.18, dest, t + 0.05, 0.18)
      scheduleNoise(dest, t,      0.28, 0.28, 220, 'lowpass')
      scheduleNoise(dest, t+0.1,  0.15, 0.12, 800, 'lowpass')
      break

    // ── Room clear: short triumphant motif ──
    case 'room_clear': {
      const motif = [N.D4, N.A4, N.D5, N.F5, N.A5]
      motif.forEach((n, i) =>
        scheduleOsc('square', n, 0.17, dest, t + i * 0.09,
          i === motif.length - 1 ? 0.55 : 0.10))
      scheduleOsc('triangle', N.D5 * 2, 0.10, dest, t + 0.46, 0.45)
      break
    }

    // ── Loot drop: gold shimmer ──
    case 'loot':
      ;[N.A4, N.C5, N.E4, N.A5].forEach((n, i) =>
        scheduleOsc('sine', n, 0.18, dest, t + i * 0.055, 0.16))
      scheduleNoise(dest, t, 0.10, 0.07, 7000, 'highpass')
      break

    // ── Combat hit (correct answer): sword strike ──
    case 'combat_hit':
      scheduleNoise(dest, t,       0.07,  0.38, 3200, 'highpass')
      scheduleOsc('sawtooth', N.A3, 0.22, dest, t,      0.07)
      scheduleOsc('sine',     N.A4, 0.12, dest, t+0.04, 0.10)
      break

    // ── Combat miss (wrong answer): damage thud ──
    case 'combat_miss':
      scheduleOsc('sine', N.D3, 0.28, dest, t,       0.14)
      scheduleOsc('sine', N.D2, 0.22, dest, t + 0.05, 0.22,
        { targetFreq: N.D2 * 0.6, slideTime: 0.18 })
      scheduleNoise(dest, t, 0.18, 0.18, 280, 'lowpass')
      break

    // ── Encounter spawn: enemy alert sting ──
    case 'encounter':
      scheduleOsc('sawtooth', N.D4, 0.28, dest, t,       0.055)
      scheduleOsc('sawtooth', N.A3, 0.28, dest, t + 0.05, 0.055)
      scheduleOsc('square',   N.D3, 0.28, dest, t + 0.10, 0.08)
      scheduleNoise(dest, t + 0.10, 0.16, 0.22, 900, 'bandpass')
      break

    // ── Footstep: soft dungeon tile ──
    case 'footstep':
      scheduleNoise(dest, t, 0.055, 0.10, 380, 'lowpass')
      scheduleOsc('sine', N.D2, 0.06, dest, t, 0.045)
      break

    // ── Menu click: crisp UI tick ──
    case 'menu_click':
      scheduleOsc('square', N.A4, 0.13, dest, t,       0.038)
      scheduleOsc('square', N.D5, 0.09, dest, t + 0.03, 0.038)
      break

    // ── Death: descending doom ──
    case 'death': {
      const doomed = [N.D4, N.C4, N.A3, N.F3, N.D3, N.A2, N.D2]
      doomed.forEach((n, i) =>
        scheduleOsc('sawtooth', n, 0.18, dest, t + i * 0.13, 0.18))
      scheduleNoise(dest, t + 0.75, 0.5, 0.14, 380, 'lowpass')
      scheduleOsc('sine', N.D2, 0.28, dest, t + 0.85, 1.0,
        { targetFreq: N.D2 * 0.5, slideTime: 0.8 })
      break
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

export const audioEngine = {
  /** Initialise the audio context. Must be called from a user gesture. */
  init,

  /** Start a music track. Safe to call when already playing — restarts it. */
  playTrack,

  /** Stop a specific music track. */
  stopTrack,

  /** Stop all music tracks simultaneously. */
  stopAllTracks,

  /**
   * Crossfade from one track to another.
   * @param from       Track to fade out
   * @param to         Track to fade in
   * @param durationSec Fade duration in seconds (default 2)
   */
  crossfade,

  /** Play a one-shot sound effect. */
  playSfx,

  /** Set master volume. Range: 0–1. */
  setMasterVolume,

  /** Set volume for a specific music track. Range: 0–1. */
  setTrackVolume,

  /** Returns true after init() has been called successfully. */
  isInitialized: (): boolean => initialized,

  /**
   * Returns the AnalyserNode for driving visualisations (oscilloscope, FFT).
   * Returns null if not yet initialised.
   */
  getAnalyser: (): AnalyserNode | null => analyser,

  /** Returns the AudioContext, or null if not initialised. */
  getContext: (): AudioContext | null => ctx,
} as const

export default audioEngine