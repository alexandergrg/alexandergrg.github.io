import type { Metadata } from 'next'
import { getAllResearch } from '@/lib/mdx'
import { ResearchCard }  from '@/components/ResearchCard'

export const metadata: Metadata = {
  title:       'NLP — Research ML/IA',
  description: 'Procesamiento de lenguaje natural: tokenización, TF-IDF, bag of words, clasificación de texto y más.',
}

export default function NLPPage() {
  const items = getAllResearch().filter((i) => i.frontmatter.category === 'nlp')

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <p className="font-mono text-xs mb-1" style={{ color: '#818cf8' }}>~/research/nlp</p>
        <h1 className="font-mono text-2xl font-bold mb-3" style={{ color: '#f4f4f5' }}>
          Procesamiento de Lenguaje Natural
        </h1>
        <p className="text-sm max-w-2xl" style={{ color: '#a1a1aa' }}>
          Técnicas NLP: bag of words, TF-IDF, NLTK, clasificación de texto y análisis de sentimiento.
        </p>
      </div>

      {items.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((r) => (
            <ResearchCard key={r.slug} item={r} />
          ))}
        </div>
      ) : (
        <EmptyState category="nlp" />
      )}
    </div>
  )
}

function EmptyState({ category }: { category: string }) {
  return (
    <div
      className="p-12 rounded-lg border text-center"
      style={{ backgroundColor: '#18181b', borderColor: '#27272a', borderStyle: 'dashed' }}
    >
      <p className="font-mono text-sm mb-2" style={{ color: '#818cf8' }}>
        $ node scripts/migrate-siteml.js
      </p>
      <p className="font-mono text-xs" style={{ color: '#a1a1aa' }}>
        No hay artículos de categoría &quot;{category}&quot; aún.
      </p>
    </div>
  )
}
