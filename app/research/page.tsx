import type { Metadata } from 'next'
import { getAllResearch } from '@/lib/mdx'
import { ResearchCard }  from '@/components/ResearchCard'
import { categoryLabel } from '@/lib/utils'
import type { ResearchCategory } from '@/lib/types'

export const metadata: Metadata = {
  title:       'Research — ML / IA',
  description: 'Investigación en Machine Learning e Inteligencia Artificial: NLP, clustering, clasificación, EDA y visualizaciones.',
}

const categories: ResearchCategory[] = [
  'eda', 'classification', 'nlp', 'clustering', 'regression', 'lab', 'viz',
]

export default function ResearchPage() {
  const items = getAllResearch()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-xs mb-1" style={{ color: '#818cf8' }}>~/research</p>
        <h1 className="font-mono text-2xl font-bold mb-3" style={{ color: '#f4f4f5' }}>
          Machine Learning & Research
        </h1>
        <p className="text-sm max-w-2xl" style={{ color: '#a1a1aa' }}>
          Investigación aplicada en ML/IA: análisis exploratorio de datos, modelos de clasificación y regresión,
          procesamiento de lenguaje natural y visualizaciones interactivas.
        </p>
      </div>

      {/* Category filter — visual only (no JS needed, tags visible in cards) */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => {
          const count = items.filter((i) => i.frontmatter.category === cat).length
          if (count === 0) return null
          return (
            <span
              key={cat}
              className="font-mono text-xs px-3 py-1 rounded"
              style={{ color: '#818cf8', backgroundColor: '#818cf815', border: '1px solid #818cf830' }}
            >
              {categoryLabel[cat]} ({count})
            </span>
          )
        })}
      </div>

      {/* Grid */}
      {items.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((r) => (
            <ResearchCard key={r.slug} item={r} />
          ))}
        </div>
      ) : (
        <div
          className="p-12 rounded-lg border text-center"
          style={{ backgroundColor: '#18181b', borderColor: '#27272a', borderStyle: 'dashed' }}
        >
          <p className="font-mono text-sm mb-2" style={{ color: '#818cf8' }}>
            $ node scripts/migrate-siteml.js
          </p>
          <p className="font-mono text-xs" style={{ color: '#a1a1aa' }}>
            Ejecuta el script para migrar contenido desde el site-ml de Quarto.
          </p>
        </div>
      )}
    </div>
  )
}
