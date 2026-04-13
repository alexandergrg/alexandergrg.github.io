import type { Metadata } from 'next'
import { getAllResearch } from '@/lib/mdx'
import { ResearchCard }  from '@/components/ResearchCard'

export const metadata: Metadata = {
  title:       'Clasificación — Research ML/IA',
  description: 'Modelos de clasificación supervisada: KNN, Naive Bayes, pipelines, codificación categórica y evaluación.',
}

export default function ClassificationPage() {
  const items = getAllResearch().filter((i) => i.frontmatter.category === 'classification')

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <p className="font-mono text-xs mb-1" style={{ color: '#818cf8' }}>~/research/classification</p>
        <h1 className="font-mono text-2xl font-bold mb-3" style={{ color: '#f4f4f5' }}>
          Modelos de Clasificación
        </h1>
        <p className="text-sm max-w-2xl" style={{ color: '#a1a1aa' }}>
          Clasificación supervisada con scikit-learn: KNN, Naive Bayes, pipelines, codificación categórica, métricas y validación cruzada.
        </p>
      </div>

      {items.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((r) => (
            <ResearchCard key={r.slug} item={r} />
          ))}
        </div>
      ) : (
        <EmptyState category="classification" />
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
