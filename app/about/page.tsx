import type { Metadata } from 'next'

export const metadata: Metadata = {
  title:       'About',
  description: 'Alexander González — Ing. Sistemas, Master Ciberseguridad, AZ-900, Quito EC.',
}

const social = [
  { label: 'GitHub',   href: 'https://github.com/alexandergrg' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/alexandergrg' },
  { label: 'GitLab',   href: 'https://gitlab.com/alexandergrg' },
]

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-12">
        <p className="font-mono text-xs mb-1" style={{ color: '#a1a1aa' }}>~/about</p>
        <h1 className="font-mono text-3xl font-bold mb-2" style={{ color: '#f4f4f5' }}>
          Alexander González
        </h1>
        <p className="font-mono text-sm" style={{ color: '#a1a1aa' }}>
          Ing. Sistemas · Master Ciberseguridad · AZ-900 · Quito, EC
        </p>
      </div>

      {/* Skills — two columns */}
      <div
        className="p-6 rounded-lg border mb-8"
        style={{ backgroundColor: '#18181b', borderColor: '#27272a' }}
      >
        <div className="grid md:grid-cols-2 gap-8">
          {/* Cyber */}
          <div>
            <h2 className="font-mono text-sm font-semibold mb-4" style={{ color: '#22d3ee' }}>
              CIBERSEGURIDAD
            </h2>
            <div style={{ borderTop: '1px solid #27272a', marginBottom: '1rem' }} />
            <ul className="space-y-2">
              {[
                'Pentesting ofensivo',
                'Active Directory attacks',
                'Metasploit / Burp Suite',
                'OSINT / Reconocimiento',
                'Red Team / Blue Team',
              ].map((s) => (
                <li key={s} className="flex items-center gap-2 font-mono text-xs" style={{ color: '#a1a1aa' }}>
                  <span style={{ color: '#22d3ee' }}>›</span> {s}
                </li>
              ))}
            </ul>
          </div>

          {/* ML */}
          <div>
            <h2 className="font-mono text-sm font-semibold mb-4" style={{ color: '#818cf8' }}>
              MACHINE LEARNING
            </h2>
            <div style={{ borderTop: '1px solid #27272a', marginBottom: '1rem' }} />
            <ul className="space-y-2">
              {[
                'scikit-learn / Python',
                'NLP y clasificación de texto',
                'EDA y visualización',
                'K-Means, HAC, KNN',
                'Pipelines y preprocesamiento',
              ].map((s) => (
                <li key={s} className="flex items-center gap-2 font-mono text-xs" style={{ color: '#a1a1aa' }}>
                  <span style={{ color: '#818cf8' }}>›</span> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Certs */}
      <div
        className="p-6 rounded-lg border mb-8"
        style={{ backgroundColor: '#18181b', borderColor: '#27272a' }}
      >
        <h2 className="font-mono text-sm font-semibold mb-4" style={{ color: '#c084fc' }}>
          CERTIFICACIONES
        </h2>
        <div style={{ borderTop: '1px solid #27272a', marginBottom: '1rem' }} />
        <ul className="space-y-2">
          {[
            'Master en Ciberseguridad',
            'Microsoft AZ-900 Azure Fundamentals',
            'Ingeniería en Sistemas',
          ].map((c) => (
            <li key={c} className="flex items-center gap-2 font-mono text-xs" style={{ color: '#a1a1aa' }}>
              <span style={{ color: '#c084fc' }}>◈</span> {c}
            </li>
          ))}
        </ul>
      </div>

      {/* Social */}
      <div
        className="p-6 rounded-lg border"
        style={{ backgroundColor: '#18181b', borderColor: '#27272a' }}
      >
        <h2 className="font-mono text-sm font-semibold mb-4" style={{ color: '#f4f4f5' }}>
          CONTACTO
        </h2>
        <div style={{ borderTop: '1px solid #27272a', marginBottom: '1rem' }} />
        <div className="flex flex-wrap gap-4">
          {social.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs transition-colors duration-150"
              style={{ color: '#818cf8' }}
            >
              {s.label} →
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
