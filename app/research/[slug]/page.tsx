import { notFound }        from 'next/navigation'
import Link                from 'next/link'
import type { Metadata }   from 'next'
import { MDXRemote }       from 'next-mdx-remote/rsc'
import { getAllResearch, getResearchBySlug } from '@/lib/mdx'
import { TagBadge }        from '@/components/TagBadge'
import { CodeBlock }       from '@/components/CodeBlock'
import { PlotlyChart }     from '@/components/charts/PlotlyChart'
import { VegaChart }       from '@/components/charts/VegaChart'
import { formatDate, categoryLabel } from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllResearch().map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = getResearchBySlug(slug)
  if (!item) return {}
  return {
    title:       item.frontmatter.title,
    description: item.frontmatter.excerpt,
  }
}

const components = {
  PlotlyChart,
  VegaChart,
  pre:  ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  code: ({ children, className }: { children?: React.ReactNode; className?: string }) => {
    const lang = className?.replace('language-', '') ?? 'python'
    if (typeof children === 'string') {
      return <CodeBlock language={lang}>{children}</CodeBlock>
    }
    return <code className={className}>{children}</code>
  },
}

export default async function ResearchPage({ params }: Props) {
  const { slug } = await params
  const item = getResearchBySlug(slug)
  if (!item) notFound()

  const { frontmatter, content, readingTime } = item

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <p className="font-mono text-xs mb-6" style={{ color: '#a1a1aa' }}>
        <Link href="/research" style={{ color: '#818cf8' }}>research</Link>
        {' / '}
        {categoryLabel[frontmatter.category] ?? frontmatter.category}
        {' / '}
        {slug}
      </p>

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span
            className="font-mono text-xs px-2 py-0.5 rounded"
            style={{ color: '#818cf8', backgroundColor: '#818cf815', border: '1px solid #818cf830' }}
          >
            {categoryLabel[frontmatter.category] ?? frontmatter.category}
          </span>
          {frontmatter.hasCharts && (
            <span className="font-mono text-xs" style={{ color: '#c084fc' }}>◈ charts</span>
          )}
          {frontmatter.hasNotebook && (
            <span className="font-mono text-xs" style={{ color: '#818cf8' }}>⊞ notebook</span>
          )}
        </div>

        <h1 className="font-mono text-2xl font-bold mb-4 leading-snug" style={{ color: '#f4f4f5' }}>
          {frontmatter.title}
        </h1>

        <p className="text-sm leading-relaxed mb-5" style={{ color: '#a1a1aa' }}>
          {frontmatter.excerpt}
        </p>

        <div className="flex items-center gap-4 flex-wrap mb-4">
          <span className="font-mono text-xs" style={{ color: '#a1a1aa' }}>
            {formatDate(frontmatter.date)}
          </span>
          <span className="font-mono text-xs" style={{ color: '#a1a1aa' }}>
            {readingTime}
          </span>
          {frontmatter.dataset && (
            <span className="font-mono text-xs" style={{ color: '#a1a1aa' }}>
              dataset: <span style={{ color: '#818cf8' }}>{frontmatter.dataset}</span>
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {frontmatter.tags.map((t) => (
            <TagBadge key={t} tag={t} area="ml" />
          ))}
        </div>
      </header>

      <div className="mb-8" style={{ borderTop: '1px solid #27272a' }} />

      {/* Content */}
      <div className="prose prose-invert max-w-none">
        <MDXRemote source={content} components={components} />
      </div>
    </article>
  )
}
