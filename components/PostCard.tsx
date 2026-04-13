'use client'

import Link from 'next/link'
import type { PostItem } from '@/lib/types'
import { TagBadge } from './TagBadge'
import { AreaLabel } from './AreaLabel'
import { formatDate } from '@/lib/utils'

export function PostCard({ post }: { post: PostItem }) {
  const { frontmatter, slug, readingTime } = post
  return (
    <Link href={`/blog/${slug}`} className="block group">
      <article
        className="p-5 rounded-lg border transition-all duration-200 h-full"
        style={{
          backgroundColor: '#18181b',
          borderColor:     '#27272a',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = '#3f3f46')}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = '#27272a')}
      >
        <div className="flex items-center justify-between mb-3">
          <AreaLabel area={frontmatter.area} />
          <span className="font-mono text-xs" style={{ color: '#a1a1aa' }}>
            {readingTime}
          </span>
        </div>

        <h3
          className="font-mono font-semibold text-sm mb-2 transition-colors duration-150 leading-snug"
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
              <TagBadge key={t} tag={t} area={frontmatter.area} small />
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
