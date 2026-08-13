import { useEffect, useRef, useState, useCallback } from 'react'
import TallyLight from './TallyLight.jsx'

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0')
  const s = Math.floor(sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function Prompter({ settings, setSettings, onExit }) {
  const {
    script,
    fontSize,
    speed,
    lineHeight,
    textWidth,
    mirrorX,
    mirrorY,
    invert,
    align,
    countdown,
  } = settings

  const scrollRef = useRef(null)
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [counting, setCounting] = useState(0)
  const [chromeVisible, setChromeVisible] = useState(true)
  const rafRef = useRef(null)
  const lastTsRef = useRef(null)
  const hideTimerRef = useRef(null)

  const stop = useCallback(() => {
    setRunning(false)
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
  }, [])

  const tick = useCallback(
    (ts) => {
      const el = scrollRef.current
      if (!el) return
      if (lastTsRef.current == null) lastTsRef.current = ts
      const dt = (ts - lastTsRef.current) / 1000
      lastTsRef.current = ts
      el.scrollTop += speed * dt
      setElapsed((e) => e + dt)
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 2) {
        stop()
        return
      }
      rafRef.current = requestAnimationFrame(tick)
    },
    [speed, stop]
  )

  const play = useCallback(() => {
    if (counting > 0) return
    lastTsRef.current = null
    setRunning(true)
  }, [counting])

  useEffect(() => {
    if (running) {
      rafRef.current = requestAnimationFrame(tick)
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, speed])

  const beginCountdown = useCallback(() => {
    if (countdown === 0) {
      play()
      return
    }
    setCounting(countdown)
  }, [countdown, play])

  useEffect(() => {
    if (counting === 0) return
    const t = setTimeout(() => {
      if (counting === 1) {
        setCounting(0)
        play()
      } else {
        setCounting((c) => c - 1)
      }
    }, 1000)
    return () => clearTimeout(t)
  }, [counting, play])

  const toggleRun = useCallback(() => {
    if (running) stop()
    else beginCountdown()
  }, [running, stop, beginCountdown])

  const reset = useCallback(() => {
    stop()
    setCounting(0)
    setElapsed(0)
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [stop])

  const bumpSpeed = useCallback(
    (delta) => {
      setSettings((s) => ({ ...s, speed: Math.max(5, Math.min(400, s.speed + delta)) }))
    },
    [setSettings]
  )

  const bumpFont = useCallback(
    (delta) => {
      setSettings((s) => ({ ...s, fontSize: Math.max(18, Math.min(160, s.fontSize + delta)) }))
    },
    [setSettings]
  )

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.code === 'Space') {
        e.preventDefault()
        toggleRun()
      } else if (e.code === 'ArrowUp') {
        e.preventDefault()
        bumpSpeed(8)
      } else if (e.code === 'ArrowDown') {
        e.preventDefault()
        bumpSpeed(-8)
      } else if (e.code === 'ArrowRight') {
        e.preventDefault()
        bumpFont(2)
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault()
        bumpFont(-2)
      } else if (e.code === 'KeyR') {
        reset()
      } else if (e.code === 'KeyM') {
        setSettings((s) => ({ ...s, mirrorX: !s.mirrorX }))
      } else if (e.code === 'Escape') {
        onExit()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [toggleRun, bumpSpeed, bumpFont, reset, setSettings, onExit])

  // Auto-hide chrome while running
  useEffect(() => {
    const wake = () => {
      setChromeVisible(true)
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
      if (running) {
        hideTimerRef.current = setTimeout(() => setChromeVisible(false), 2200)
      }
    }
    wake()
    window.addEventListener('mousemove', wake)
    window.addEventListener('touchstart', wake)
    return () => {
      window.removeEventListener('mousemove', wake)
      window.removeEventListener('touchstart', wake)
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
  }, [running])

  const stageBg = invert ? '#F5F4F0' : '#0A0B0D'
  const stageText = invert ? '#0A0B0D' : '#F5F4F0'

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      style={{ background: stageBg }}
    >
      {/* Reading stage */}
      <div
        ref={scrollRef}
        className="h-full w-full overflow-y-scroll"
        style={{
          transform: `scaleX(${mirrorX ? -1 : 1}) scaleY(${mirrorY ? -1 : 1})`,
        }}
      >
        <div style={{ height: '45vh' }} />
        <div
          className="script-text mx-auto whitespace-pre-wrap"
          style={{
            maxWidth: `${textWidth}%`,
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
            textAlign: align,
            color: stageText,
            fontFamily: "'Manrope','Noto Sans Devanagari',sans-serif",
            fontWeight: 600,
            padding: '0 2rem',
          }}
        >
          {script || 'Your script will appear here. Go back and paste your Nepali or English script to begin.'}
        </div>
        <div style={{ height: '70vh' }} />
      </div>

      {/* Vignette fades top/bottom for legibility, like prompter glass */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-24"
        style={{ background: `linear-gradient(${stageBg}, transparent)` }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24"
        style={{ background: `linear-gradient(transparent, ${stageBg})` }}
      />

      {/* Reading line marker */}
      <div className="pointer-events-none absolute left-0 right-0 top-[45vh] flex items-center px-6">
        <div className="h-px w-full" style={{ background: invert ? 'rgba(10,11,13,0.15)' : 'rgba(245,244,240,0.12)' }} />
      </div>

      {/* Countdown overlay */}
      {counting > 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-void/80 backdrop-blur-sm">
          <div className="font-mono text-tally text-[18vw] leading-none font-semibold">{counting}</div>
        </div>
      )}

      {/* Top HUD */}
      <div
        className={`absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-4 transition-opacity duration-300 ${
          chromeVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <TallyLight running={running} size="lg" />
        <div className="font-mono text-xs text-dim tracking-widest">{formatTime(elapsed)}</div>
      </div>

      {/* Bottom control bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 flex flex-col items-center gap-3 px-5 pb-5 transition-opacity duration-300 ${
          chromeVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center gap-2 rounded-xl border border-line bg-panel/90 px-3 py-2 shadow-bezel backdrop-blur">
          <button
            onClick={onExit}
            className="rounded-lg px-3 py-2 font-display text-xs text-dim hover:text-hi hover:bg-panel2 transition"
            title="Exit (Esc)"
          >
            Exit
          </button>
          <div className="h-6 w-px bg-line" />
          <button
            onClick={() => bumpFont(-2)}
            className="rounded-lg px-3 py-2 font-mono text-sm text-hi hover:bg-panel2 transition"
            title="Smaller text (←)"
          >
            A−
          </button>
          <button
            onClick={() => bumpFont(2)}
            className="rounded-lg px-3 py-2 font-mono text-sm text-hi hover:bg-panel2 transition"
            title="Larger text (→)"
          >
            A+
          </button>
          <div className="h-6 w-px bg-line" />
          <button
            onClick={() => bumpSpeed(-8)}
            className="rounded-lg px-3 py-2 font-mono text-sm text-hi hover:bg-panel2 transition"
            title="Slower (↓)"
          >
            −
          </button>
          <div className="w-16 text-center font-mono text-[11px] text-cue">{speed} px/s</div>
          <button
            onClick={() => bumpSpeed(8)}
            className="rounded-lg px-3 py-2 font-mono text-sm text-hi hover:bg-panel2 transition"
            title="Faster (↑)"
          >
            +
          </button>
          <div className="h-6 w-px bg-line" />
          <button
            onClick={reset}
            className="rounded-lg px-3 py-2 font-display text-xs text-dim hover:text-hi hover:bg-panel2 transition"
            title="Reset (R)"
          >
            Reset
          </button>
          <button
            onClick={() => setSettings((s) => ({ ...s, mirrorX: !s.mirrorX }))}
            className={`rounded-lg px-3 py-2 font-display text-xs transition ${
              mirrorX ? 'text-tally' : 'text-dim hover:text-hi hover:bg-panel2'
            }`}
            title="Mirror (M)"
          >
            Mirror
          </button>
          <div className="h-6 w-px bg-line" />
          <button
            onClick={toggleRun}
            className="rounded-lg bg-tally px-5 py-2 font-display text-xs font-semibold text-hi hover:brightness-110 transition"
            title="Play / Pause (Space)"
          >
            {running ? 'Pause' : counting > 0 ? '...' : 'Play'}
          </button>
        </div>
        <div className="font-mono text-[10px] text-dim2 tracking-wide">
          space play/pause · ↑↓ speed · ←→ text size · m mirror · r reset · esc exit
        </div>
      </div>
    </div>
  )
}
