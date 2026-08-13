import { useEffect, useState } from 'react'
import ControlDeck from './components/ControlDeck.jsx'
import ScriptPad from './components/ScriptPad.jsx'
import Prompter from './components/Prompter.jsx'

const DEFAULT_SETTINGS = {
  fontSize: 48,
  speed: 40,
  lineHeight: 1.5,
  textWidth: 78,
  mirrorX: false,
  mirrorY: false,
  invert: false,
  align: 'center',
  countdown: 3,
}

const STORAGE_KEY = 'prompt-deck:v1'

export default function App() {
  const [script, setScript] = useState('')
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [stage, setStage] = useState(false)

  // Load saved script + settings once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw)
        if (saved.script) setScript(saved.script)
        if (saved.settings) setSettings((s) => ({ ...s, ...saved.settings }))
      }
    } catch (e) {
      // ignore corrupt storage
    }
  }, [])

  // Persist on change (debounced lightly via effect batching)
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ script, settings }))
      } catch (e) {
        // storage full or unavailable — ignore
      }
    }, 300)
    return () => clearTimeout(t)
  }, [script, settings])

  const wordCount = script.trim() ? script.trim().split(/\s+/).length : 0
  // Rough reading estimate: convert scroll speed (px/s) and font size into an
  // approximate seconds-to-finish figure based on total text height guess.
  const approxLines = Math.max(1, Math.ceil(script.length / 42))
  const approxHeight = approxLines * settings.fontSize * settings.lineHeight
  const estSeconds = settings.speed > 0 ? approxHeight / settings.speed : 0

  const mergedSettings = { ...settings, script }

  if (stage) {
    return (
      <Prompter
        settings={mergedSettings}
        setSettings={(updater) =>
          setSettings((prev) => {
            const next = typeof updater === 'function' ? updater({ ...prev, script }) : updater
            const { script: _ignore, ...rest } = next
            return rest
          })
        }
        onExit={() => setStage(false)}
      />
    )
  }

  return (
    <div className="flex h-screen w-screen flex-col bg-void text-hi lg:flex-row">
      <ControlDeck
        settings={settings}
        setSettings={setSettings}
        onStart={() => setStage(true)}
        wordCount={wordCount}
        estSeconds={estSeconds}
      />
      <ScriptPad script={script} setScript={setScript} />
    </div>
  )
}
