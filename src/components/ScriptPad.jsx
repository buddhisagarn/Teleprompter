export default function ScriptPad({ script, setScript }) {
  return (
    <main className="flex h-full flex-1 flex-col px-4 py-4 sm:px-8 sm:py-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-hi">Script</h2>
          <p className="mt-1 font-mono text-[11px] text-dim">
            Nepali (Devanagari) and English both render correctly, mixed or separate.
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-hidden rounded-xl border border-line bg-panel shadow-bezel">
        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder={'नमस्ते! यहाँ आफ्नो स्क्रिप्ट टाइप गर्नुहोस् वा पेस्ट गर्नुहोस्...\n\nOr paste your English script here...\n\nतपाईं नेपाली र अंग्रेजी दुवै मिसाएर लेख्न सक्नुहुन्छ।'}
          spellCheck={false}
          className="script-text h-full w-full resize-none bg-transparent p-6 text-[17px] leading-relaxed text-hi outline-none placeholder:text-dim2"
          style={{ fontFamily: "'Manrope','Noto Sans Devanagari',sans-serif" }}
        />
      </div>
    </main>
  )
}
