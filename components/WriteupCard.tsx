'use client'

import Link from 'next/link'
import type { WriteupItem } from '@/lib/types'
import { TagBadge } from './TagBadge'
import { DifficultyBadge } from './DifficultyBadge'

const platformColor: Record<string, string> = {
  HackTheBox: '#22d3ee',
  TryHackMe:  '#f87171',
}

const osIcon: Record<string, string> = {
  Windows: '⊞',
  Linux:   '🐧',
}

export function WriteupCard({ writeup }: { writeup: WriteupItem }) {
  const { frontmatter, slug, readingTime } = writeup
  const pColor = platformColor[frontmatter.platform] ?? '#a1a1aa'

  return (
    <Link href={`/writeups/${slug}`} className="block group">
      <article
        className="p-5 rounded-lg border transition-all duration-200 h-full"
        style={{ backgroundColor: '#18181b', borderColor: '#27272a' }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = '#22d3ee40')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = '#27272a')}
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
          <span
            className="font-mono text-xs font-semibold"
            style={{ color: pColor }}
          >
            {frontmatter.platform}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs" title={frontmatter.os}>
              {osIcon[frontmatter.os] ?? frontmatter.os}
            </span>
            <DifficultyBadge difficulty={frontmatter.difficulty} />
          </div>
        </div>

        <h3
          className="font-mono font-semibold text-sm mb-2 leading-snug transition-colors"
          style={{ color: '#f4f4f5' }}
        >
          {frontmatter.title}
        </h3>

        <p className="text-xs leading-relaxed mb-4" style={{ color: '#a1a1aa' }}>
          {frontmatter.excerpt}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-wrap gap-1">
            {frontmatter.tags.slice(0, 3).map((t) => (
              <TagBadge key={t} tag={t} area="cyber" small />
            ))}
          </div>
          <span className="font-mono text-[10px]" style={{ color: '#a1a1aa' }}>
            {readingTime}
          </span>
        </div>
      </article>
    </Link>
  )
}
