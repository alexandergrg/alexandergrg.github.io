import type { Area } from '@/lib/types'

const config: Record<Area, { label: string; color: string }> = {
  cyber: { label: 'ciberseguridad', color: '#22d3ee' },
  ml:    { label: 'ML / IA',        color: '#818cf8' },
}

export function AreaLabel({ area }: { area: Area }) {
  const { label, color } = config[area]
  return (
    <span
      className="font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded"
      style={{
        color,
        backgroundColor: `${color}10`,
        border:          `1px solid ${color}25`,
      }}
    >
      {label}
    </span>
  )
}
