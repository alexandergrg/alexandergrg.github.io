import type { WriteupDifficulty } from '@/lib/types'

const colors: Record<WriteupDifficulty, string> = {
  easy:   '#22d3ee',
  medium: '#fb923c',
  hard:   '#f87171',
}

export function DifficultyBadge({ difficulty }: { difficulty: WriteupDifficulty }) {
  const color = colors[difficulty]
  return (
    <span
      className="font-mono text-xs px-2 py-0.5 rounded uppercase tracking-wider"
      style={{
        color,
        backgroundColor: `${color}15`,
        border:          `1px solid ${color}40`,
      }}
    >
      {difficulty}
    </span>
  )
}
