export default function TallyLight({ running, size = 'md', label = true }) {
  const dims = size === 'lg' ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5'
  return (
    <div className="flex items-center gap-2 select-none">
      <span
        className={`${dims} rounded-full ${
          running
            ? 'bg-tally shadow-[0_0_10px_2px_rgba(232,52,42,0.7)] animate-pulse-tally'
            : 'bg-tallydim ring-1 ring-inset ring-line'
        }`}
      />
      {label && (
        <span className="font-mono text-[10px] tracking-[0.2em] text-dim uppercase">
          {running ? 'On Air' : 'Standby'}
        </span>
      )}
    </div>
  )
}
