import { notFound }        from 'next/navigation'
import Link                from 'next/link'
import type { Metadata }   from 'next'
import { MDXRemote }       from 'next-mdx-remote/rsc'
import { getAllWriteups, getWriteupBySlug } from '@/lib/mdx'
import { DifficultyBadge } from '@/components/DifficultyBadge'
import { TagBadge }        from '@/components/TagBadge'
import { CodeBlock }       from '@/components/CodeBlock'
import { formatDate }      from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllWriteups().map((w) => ({ slug: w.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const writeup = getWriteupBySlug(slug)
  if (!writeup) return {}
  return {
    title:       writeup.frontmatter.title,
    description: writeup.frontmatter.excerpt,
  }
}

const components = {
  pre:  ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  code: ({ children, className }: { children?: React.ReactNode; className?: string }) => {
    const lang = className?.replace('language-', '') ?? 'bash'
    if (typeof children === 'string') {
      return <CodeBlock language={lang}>{children}</CodeBlock>
    }
    return <code className={className}>{children}</code>
  },
}

export default async function WriteupPage({ params }: Props) {
  const { slug } = await params
  const writeup = getWriteupBySlug(slug)
  if (!writeup) notFound()

  const { frontmatter, content, readingTime } = writeup

  const platformColor: Record<string, string> = {
    HackTheBox: '#22d3ee',
    TryHackMe:  '#f87171',
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <p className="font-mono text-xs mb-6" style={{ color: '#a1a1aa' }}>
        <Link href="/writeups" style={{ color: '#22d3ee' }}>write-ups</Link>
        {' / '}
        {frontmatter.platform.toLowerCase()}
        {' / '}
        {slug}
      </p>

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span
            className="font-mono text-xs font-bold"
            style={{ color: platformColor[frontmatter.platform] ?? '#a1a1aa' }}
          >
            {frontmatter.platform}
          </span>
          <DifficultyBadge difficulty={frontmatter.difficulty} />
          <span className="font-mono text-xs" style={{ color: '#a1a1aa' }}>
            {frontmatter.os}
          </span>
        </div>

        <h1 className="font-mono text-2xl font-bold mb-4 leading-snug" style={{ color: '#f4f4f5' }}>
          {frontmatter.title}
        </h1>

        <p className="text-sm leading-relaxed mb-5" style={{ color: '#a1a1aa' }}>
          {frontmatter.excerpt}
        </p>

        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-mono text-xs" style={{ color: '#a1a1aa' }}>
            {formatDate(frontmatter.date)}
          </span>
          <span className="font-mono text-xs" style={{ color: '#a1a1aa' }}>
            {readingTime}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {frontmatter.tags.map((t) => (
            <TagBadge key={t} tag={t} area="cyber" />
          ))}
        </div>
      </header>

      {/* Divider */}
      <div className="mb-8" style={{ borderTop: '1px solid #27272a' }} />

      {/* Content */}
      <div className="prose prose-invert max-w-none">
        <MDXRemote source={content} components={components} />
      </div>
    </article>
  )
}
