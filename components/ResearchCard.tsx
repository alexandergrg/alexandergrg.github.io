'use client'

import Link from 'next/link'
import type { ResearchItem } from '@/lib/types'
import { TagBadge } from './TagBadge'
import { formatDate } from '@/lib/utils'
import { categoryLabel } from '@/lib/utils'

export function ResearchCard({ item }: { item: ResearchItem }) {
  const { frontmatter, slug } = item

  return (
    <Link href={`/research/${slug}`} className="block group">
      <article
        className="p-5 rounded-lg border transition-all duration-200 h-full"
        style={{ backgroundColor: '#18181b', borderColor: '#27272a' }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = '#818cf840')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = '#27272a')}
      >
        {/* Category + indicators */}
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <span
            className="font-mono text-xs px-2 py-0.5 rounded"
            style={{ color: '#818cf8', backgroundColor: '#818cf815', border: '1px solid #818cf830' }}
          >
            {categoryLabel[frontmatter.category] ?? frontmatter.category}
          </span>
          <div className="flex items-center gap-2">
            {frontmatter.hasCharts && (
              <span className="font-mono text-[10px]" style={{ color: '#c084fc' }} title="Incluye gráficas">
                ◈ charts
              </span>
            )}
            {frontmatter.hasNotebook && (
              <span className="font-mono text-[10px]" style={{ color: '#818cf8' }} title="Incluye notebook">
                ⊞ notebook
              </span>
            )}
          </div>
        </div>

        <h3
          className="font-mono font-semibold text-sm mb-2 leading-snug"
          style={{ color: '#f4f4f5' }}
        >
          {frontmatter.title}
        </h3>

        <p className="text-xs leading-relaxed mb-3" style={{ color: '#a1a1aa' }}>
          {frontmatter.excerpt}
        </p>

        {frontmatter.dataset && (
          <p className="font-mono text-[10px] mb-3" style={{ color: '#a1a1aa' }}>
            dataset: <span style={{ color: '#818cf8' }}>{frontmatter.dataset}</span>
          </p>
        )}

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-wrap gap-1">
            {frontmatter.tools.slice(0, 3).map((t) => (
              <TagBadge key={t} tag={t} area="ml" small />
            ))}
          </div>
          <span className="font-mono text-[10px]" style={{ color: '#a1a1aa' }}>
            {formatDate(frontmatter.date)}
          </span>
        </div>
      </article>
    </Link>
  )
}
