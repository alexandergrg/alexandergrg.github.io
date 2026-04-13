'use client'

import dynamic from 'next/dynamic'
import { Data, Layout } from 'plotly.js'

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

interface PlotlyChartProps {
  data:    Data[]
  layout?: Partial<Layout>
  height?: number
}

const darkDefaults: Partial<Layout> = {
  paper_bgcolor: '#18181b',
  plot_bgcolor:  '#18181b',
  font: {
    color:  '#f4f4f5',
    family: 'JetBrains Mono, monospace',
  },
  xaxis: {
    gridcolor:    '#27272a',
    linecolor:    '#27272a',
    tickcolor:    '#a1a1aa',
    tickfont:     { color: '#a1a1aa' },
  },
  yaxis: {
    gridcolor:    '#27272a',
    linecolor:    '#27272a',
    tickcolor:    '#a1a1aa',
    tickfont:     { color: '#a1a1aa' },
  },
  legend: { font: { color: '#f4f4f5' } },
  margin: { t: 40, r: 20, b: 40, l: 50 },
}

export function PlotlyChart({ data, layout, height = 400 }: PlotlyChartProps) {
  const mergedLayout: Partial<Layout> = {
    ...darkDefaults,
    ...layout,
    paper_bgcolor: '#18181b',
    plot_bgcolor:  '#18181b',
    height,
  }

  return (
    <div className="my-6 rounded-lg overflow-hidden" style={{ border: '1px solid #27272a' }}>
      <Plot
        data={data}
        layout={mergedLayout}
        config={{ displayModeBar: true, displaylogo: false, responsive: true }}
        style={{ width: '100%' }}
      />
    </div>
  )
}
