function Row({ label, value, children }) {
  return (
    <div className="mb-5">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-display text-[11px] uppercase tracking-[0.15em] text-dim">{label}</span>
        <span className="font-mono text-[11px] text-cue">{value}</span>
      </div>
      {children}
    </div>
  )
}

function ToggleButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-md border px-2.5 py-2 font-display text-[11px] uppercase tracking-wide transition ${
        active
          ? 'border-tally/60 bg-tally/10 text-tally'
          : 'border-line text-dim hover:text-hi hover:border-dim2'
      }`}
    >
      {children}
    </button>
  )
}

export default function ControlDeck({ settings, setSettings, onStart, wordCount, estSeconds }) {
  const set = (key) => (e) => setSettings((s) => ({ ...s, [key]: Number(e.target.value) }))

  const estMin = Math.floor(estSeconds / 60)
  const estSec = Math.round(estSeconds % 60).toString().padStart(2, '0')

  return (
    <aside className="grain-panel flex h-full w-full flex-col border-r border-line bg-panel px-5 py-6 lg:w-80 shrink-0 overflow-y-auto">
      <div className="mb-6 flex items-center gap-2">
        <div className="h-2.5 w-2.5 rounded-full bg-tally shadow-[0_0_10px_2px_rgba(232,52,42,0.5)]" />
        <h1 className="font-display text-sm font-semibold tracking-wide text-hi">PROMPT DECK</h1>
      </div>

      <Row label="Font size" value={`${settings.fontSize}px`}>
        <input type="range" min={18} max={160} value={settings.fontSize} onChange={set('fontSize')} />
      </Row>

      <Row label="Scroll speed" value={`${settings.speed} px/s`}>
        <input type="range" min={5} max={400} value={settings.speed} onChange={set('speed')} />
      </Row>

      <Row label="Line height" value={settings.lineHeight.toFixed(2)}>
        <input
          type="range"
          min={1.1}
          max={2.2}
          step={0.05}
          value={settings.lineHeight}
          onChange={(e) => setSettings((s) => ({ ...s, lineHeight: Number(e.target.value) }))}
        />
      </Row>

      <Row label="Reading column" value={`${settings.textWidth}%`}>
        <input type="range" min={40} max={100} value={settings.textWidth} onChange={set('textWidth')} />
      </Row>

      <Row label="Countdown" value={`${settings.countdown}s`}>
        <div className="flex gap-1.5">
          {[0, 3, 5, 10].map((c) => (
            <ToggleButton key={c} active={settings.countdown === c} onClick={() => setSettings((s) => ({ ...s, countdown: c }))}>
              {c === 0 ? 'Off' : `${c}s`}
            </ToggleButton>
          ))}
        </div>
      </Row>

      <Row label="Alignment">
        <div className="flex gap-1.5">
          {['left', 'center'].map((a) => (
            <ToggleButton key={a} active={settings.align === a} onClick={() => setSettings((s) => ({ ...s, align: a }))}>
              {a}
            </ToggleButton>
          ))}
        </div>
      </Row>

      <Row label="Stage">
        <div className="flex gap-1.5">
          <ToggleButton active={!settings.invert} onClick={() => setSettings((s) => ({ ...s, invert: false }))}>
            Dark
          </ToggleButton>
          <ToggleButton active={settings.invert} onClick={() => setSettings((s) => ({ ...s, invert: true }))}>
            Bright
          </ToggleButton>
        </div>
      </Row>

      <Row label="Mirror rig">
        <div className="flex gap-1.5">
          <ToggleButton active={settings.mirrorX} onClick={() => setSettings((s) => ({ ...s, mirrorX: !s.mirrorX }))}>
            Flip H
          </ToggleButton>
          <ToggleButton active={settings.mirrorY} onClick={() => setSettings((s) => ({ ...s, mirrorY: !s.mirrorY }))}>
            Flip V
          </ToggleButton>
        </div>
      </Row>

      <div className="mt-auto pt-5">
        <div className="mb-4 flex items-center justify-between border-t border-line pt-4 font-mono text-[11px] text-dim">
          <span>{wordCount} words</span>
          <span className="text-cue">~{estMin}:{estSec} at this speed</span>
        </div>
        <button
          onClick={onStart}
          className="w-full rounded-lg bg-tally py-3 font-display text-sm font-semibold uppercase tracking-wide text-hi hover:brightness-110 transition"
        >
          Go to Stage
        </button>
      </div>
    </aside>
  )
}
