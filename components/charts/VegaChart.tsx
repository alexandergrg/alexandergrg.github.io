'use client'

import dynamic from 'next/dynamic'

const VegaLite = dynamic<{ spec: Record<string, unknown> }>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  () => import('react-vega').then((m) => (m as any).VegaLite),
  { ssr: false }
)

interface VegaChartProps {
  spec: Record<string, unknown>
}

export function VegaChart({ spec }: VegaChartProps) {
  const darkSpec: Record<string, unknown> = {
    ...spec,
    config: {
      background: '#18181b',
      axis: {
        gridColor:  '#27272a',
        domainColor:'#27272a',
        tickColor:  '#a1a1aa',
        labelColor: '#a1a1aa',
        titleColor: '#f4f4f5',
        labelFont:  'JetBrains Mono',
        titleFont:  'JetBrains Mono',
      },
      legend: {
        labelColor: '#f4f4f5',
        titleColor: '#f4f4f5',
        labelFont:  'JetBrains Mono',
        titleFont:  'JetBrains Mono',
      },
      title: { color: '#f4f4f5', font: 'JetBrains Mono', fontSize: 14 },
      view:  { stroke: '#27272a' },
      ...((spec.config as Record<string, unknown>) ?? {}),
    },
  }

  return (
    <div
      className="my-6 rounded-lg overflow-hidden"
      style={{ border: '1px solid #27272a', backgroundColor: '#18181b', padding: '1rem' }}
    >
      <VegaLite spec={darkSpec} />
    </div>
  )
}
