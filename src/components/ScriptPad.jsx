import { useRef, useState } from 'react'
import { transliterateToNepali, transliterateWord } from '../lib/transliterate.js'

const BOUNDARY_RE = /[a-zA-Z]+[ ,.!?;:\n)"']$/

export default function ScriptPad({ script, setScript }) {
  const [phoneticMode, setPhoneticMode] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const taRef = useRef(null)

  const handleChange = (e) => {
    const val = e.target.value
    const cursor = e.target.selectionStart

    if (phoneticMode) {
      const before = val.slice(0, cursor)
      const after = val.slice(cursor)
      const match = before.match(BOUNDARY_RE)
      if (match) {
        const trigger = match[0].slice(-1)
        const word = match[0].slice(0, -1)
        const converted = transliterateWord(word)
        const newBefore = before.slice(0, before.length - match[0].length) + converted + trigger
        const newVal = newBefore + after
        setScript(newVal)
        requestAnimationFrame(() => {
          if (taRef.current) taRef.current.setSelectionRange(newBefore.length, newBefore.length)
        })
        return
      }
    }
    setScript(val)
  }

  const convertAllToNepali = () => {
    setScript((prev) => transliterateToNepali(prev))
  }

  const downloadTxt = () => {
    const blob = new Blob([script], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'script.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setMenuOpen(false)
  }

  const printScript = () => {
    setMenuOpen(false)
    window.print()
  }

  return (
    <main className="flex h-full flex-1 flex-col px-4 py-4 sm:px-8 sm:py-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold text-hi">Script</h2>
          <p className="mt-1 font-mono text-[11px] text-dim">
            Nepali (Devanagari) and English both render correctly, mixed or separate.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPhoneticMode((v) => !v)}
            className={`rounded-lg border px-3 py-2 font-display text-[11px] uppercase tracking-wide transition ${
              phoneticMode
                ? 'border-tally/60 bg-tally/10 text-tally'
                : 'border-line text-dim hover:text-hi hover:border-dim2'
            }`}
            title="When on, each word converts to Nepali automatically as you finish typing it"
          >
            {phoneticMode ? 'Typing: Nepali ●' : 'Typing: Nepali ○'}
          </button>

          <button
            onClick={convertAllToNepali}
            className="rounded-lg border border-line px-3 py-2 font-display text-[11px] uppercase tracking-wide text-dim hover:text-hi hover:border-dim2 transition"
            title="Convert all Romanized (English-letter) Nepali in the script to Devanagari"
          >
            Convert to Nepali
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-lg bg-panel2 border border-line px-3 py-2 font-display text-[11px] uppercase tracking-wide text-hi hover:border-dim2 transition"
            >
              Download ▾
            </button>
            {menuOpen && (
              <div className="absolute right-0 z-10 mt-1 w-44 overflow-hidden rounded-lg border border-line bg-panel shadow-bezel">
                <button
                  onClick={downloadTxt}
                  className="block w-full px-3 py-2.5 text-left font-display text-[11px] uppercase tracking-wide text-dim hover:bg-panel2 hover:text-hi transition"
                >
                  Download .txt
                </button>
                <button
                  onClick={printScript}
                  className="block w-full px-3 py-2.5 text-left font-display text-[11px] uppercase tracking-wide text-dim hover:bg-panel2 hover:text-hi transition border-t border-line"
                >
                  Print / Save as PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden rounded-xl border border-line bg-panel shadow-bezel">
        <textarea
          ref={taRef}
          value={script}
          onChange={handleChange}
          placeholder={'नमस्ते! यहाँ आफ्नो स्क्रिप्ट टाइप गर्नुहोस् वा पेस्ट गर्नुहोस्...\n\nOr paste your English script here...\n\nRomanized Nepali? Turn on "Typing: Nepali" above, or paste it and hit "Convert to Nepali".'}
          spellCheck={false}
          className="script-text h-full w-full resize-none bg-transparent p-6 text-[17px] leading-relaxed text-hi outline-none placeholder:text-dim2"
          style={{ fontFamily: "'Manrope','Noto Sans Devanagari',sans-serif" }}
        />
      </div>

      {/* Print-only view: hidden normally, shown by @media print in index.css */}
      <div id="print-script">
        <div className="print-body">{script}</div>
      </div>
    </main>
  )
}
