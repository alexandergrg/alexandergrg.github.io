interface TagBadgeProps {
  tag:    string
  area?:  'cyber' | 'ml'
  small?: boolean
}

const areaColor = {
  cyber: '#22d3ee',
  ml:    '#818cf8',
}

export function TagBadge({ tag, area, small }: TagBadgeProps) {
  const color = area ? areaColor[area] : '#a1a1aa'
  const size  = small ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5'

  return (
    <span
      className={`inline-block font-mono rounded ${size}`}
      style={{
        color,
        backgroundColor: `${color}15`,
        border:          `1px solid ${color}30`,
      }}
    >
      {tag}
    </span>
  )
}
