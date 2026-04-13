import type { Metadata } from 'next'
import { getAllContent }  from '@/lib/getAllContent'
import { PostCard }       from '@/components/PostCard'
import { WriteupCard }    from '@/components/WriteupCard'
import { ResearchCard }   from '@/components/ResearchCard'

export const metadata: Metadata = {
  title:       'Blog',
  description: 'Feed unificado de posts, write-ups y artículos de investigación ML/IA.',
}

export default function BlogPage() {
  const all = getAllContent()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-xs mb-1" style={{ color: '#f4f4f5' }}>~/blog</p>
        <h1 className="font-mono text-2xl font-bold mb-3" style={{ color: '#f4f4f5' }}>
          Blog
        </h1>
        <p className="text-sm max-w-2xl" style={{ color: '#a1a1aa' }}>
          Feed unificado — ciberseguridad, machine learning y posts generales, ordenados por fecha.
        </p>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mb-8">
        <span className="font-mono text-xs flex items-center gap-1.5" style={{ color: '#a1a1aa' }}>
          <span style={{ color: '#22d3ee' }}>●</span> ciberseguridad
        </span>
        <span className="font-mono text-xs flex items-center gap-1.5" style={{ color: '#a1a1aa' }}>
          <span style={{ color: '#818cf8' }}>●</span> ML / IA
        </span>
      </div>

      {/* Feed */}
      {all.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {all.map((item) => {
            if (item.type === 'writeup')  return <WriteupCard  key={`w-${item.slug}`} writeup={item} />
            if (item.type === 'research') return <ResearchCard key={`r-${item.slug}`} item={item} />
            return <PostCard key={`p-${item.slug}`} post={item} />
          })}
        </div>
      ) : (
        <div
          className="p-12 rounded-lg border text-center"
          style={{ backgroundColor: '#18181b', borderColor: '#27272a', borderStyle: 'dashed' }}
        >
          <p className="font-mono text-sm mb-2" style={{ color: '#a1a1aa' }}>
            El feed aparecerá una vez que haya contenido migrado.
          </p>
          <p className="font-mono text-xs" style={{ color: '#a1a1aa' }}>
            Ejecuta los scripts de migración para poblar el blog.
          </p>
        </div>
      )}
    </div>
  )
}
