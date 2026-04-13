import { notFound }     from 'next/navigation'
import Link             from 'next/link'
import type { Metadata } from 'next'
import { MDXRemote }     from 'next-mdx-remote/rsc'
import { getAllPosts, getPostBySlug } from '@/lib/mdx'
import { TagBadge }      from '@/components/TagBadge'
import { AreaLabel }     from '@/components/AreaLabel'
import { CodeBlock }     from '@/components/CodeBlock'
import { formatDate }    from '@/lib/utils'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  return {
    title:       post.frontmatter.title,
    description: post.frontmatter.excerpt,
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

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const { frontmatter, content, readingTime } = post

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <p className="font-mono text-xs mb-6" style={{ color: '#a1a1aa' }}>
        <Link href="/blog" style={{ color: '#f4f4f5' }}>blog</Link>
        {' / '}
        {slug}
      </p>

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <AreaLabel area={frontmatter.area} />
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
        </div>

        <div className="flex flex-wrap gap-2">
          {frontmatter.tags.map((t) => (
            <TagBadge key={t} tag={t} area={frontmatter.area} />
          ))}
        </div>
      </header>

      <div className="mb-8" style={{ borderTop: '1px solid #27272a' }} />

      <div className="prose prose-invert max-w-none">
        <MDXRemote source={content} components={components} />
      </div>
    </article>
  )
}
