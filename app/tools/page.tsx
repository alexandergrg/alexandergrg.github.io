import type { Metadata } from 'next'

export const metadata: Metadata = {
  title:       'Tools',
  description: 'Herramientas de ciberseguridad y Machine Learning — referencia rápida.',
}

const cyberTools = [
  { name: 'Nmap',          desc: 'Port scanning y detección de servicios con scripts NSE',     tags: ['recon', 'enum']        },
  { name: 'Burp Suite',    desc: 'Proxy web para análisis y explotación de aplicaciones web',  tags: ['web', 'proxy']         },
  { name: 'Metasploit',    desc: 'Framework de explotación modular',                           tags: ['exploit', 'post']      },
  { name: 'CrackMapExec',  desc: 'Swiss army knife para redes Windows / Active Directory',     tags: ['AD', 'SMB', 'spray']   },
  { name: 'BloodHound',    desc: 'Análisis de rutas de ataque en Active Directory',            tags: ['AD', 'graph']          },
  { name: 'Impacket',      desc: 'Colección de scripts Python para protocolos de red Windows', tags: ['AD', 'SMB', 'Kerberos']},
  { name: 'Hashcat',       desc: 'Cracking de hashes GPU-accelerated',                        tags: ['crack', 'password']    },
  { name: 'ffuf',          desc: 'Fuzzing web rápido con soporte de wordlists',               tags: ['web', 'fuzz']          },
  { name: 'chisel',        desc: 'Tunneling TCP/UDP sobre HTTP',                              tags: ['pivot', 'tunnel']      },
  { name: 'linpeas/winpeas','desc': 'Scripts de enumeración para privesc en Linux/Windows',   tags: ['privesc', 'enum']      },
]

const mlTools = [
  { name: 'scikit-learn',  desc: 'Biblioteca ML de Python — clasificación, clustering, pipelines', tags: ['ML', 'Python']   },
  { name: 'NLTK',          desc: 'Natural Language Toolkit — tokenización, stemming, POS',         tags: ['NLP', 'Python']  },
  { name: 'Plotly',        desc: 'Visualizaciones interactivas para datos y modelos ML',            tags: ['viz', 'Python']  },
  { name: 'Altair / Vega', desc: 'Gramática de gráficas declarativa basada en Vega-Lite',          tags: ['viz', 'Python']  },
  { name: 'pandas',        desc: 'Manipulación y análisis de datos tabulares',                     tags: ['EDA', 'Python']  },
  { name: 'NumPy',         desc: 'Computación numérica vectorizada',                               tags: ['Math', 'Python'] },
  { name: 'Jupyter',       desc: 'Notebooks interactivos para exploración y documentación',        tags: ['EDA', 'notebook']},
]

export default function ToolsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-xs mb-1" style={{ color: '#f4f4f5' }}>~/tools</p>
        <h1 className="font-mono text-2xl font-bold mb-3" style={{ color: '#f4f4f5' }}>
          Tools
        </h1>
        <p className="text-sm max-w-2xl" style={{ color: '#a1a1aa' }}>
          Referencia rápida de herramientas de ciberseguridad y machine learning que uso frecuentemente.
        </p>
      </div>

      {/* Cyber tools */}
      <div className="mb-12">
        <h2 className="font-mono text-sm font-semibold mb-5" style={{ color: '#22d3ee' }}>
          {'// ciberseguridad & pentesting'}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {cyberTools.map((t) => (
            <ToolCard key={t.name} tool={t} accent="#22d3ee" />
          ))}
        </div>
      </div>

      {/* ML tools */}
      <div>
        <h2 className="font-mono text-sm font-semibold mb-5" style={{ color: '#818cf8' }}>
          {'// machine learning & data science'}
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {mlTools.map((t) => (
            <ToolCard key={t.name} tool={t} accent="#818cf8" />
          ))}
        </div>
      </div>
    </div>
  )
}

function ToolCard({
  tool,
  accent,
}: {
  tool:   { name: string; desc: string; tags: string[] }
  accent: string
}) {
  return (
    <div
      className="p-5 rounded-lg border"
      style={{ backgroundColor: '#18181b', borderColor: '#27272a' }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="font-mono text-sm font-semibold" style={{ color: accent }}>
          {tool.name}
        </span>
        <div className="flex gap-1 flex-wrap justify-end">
          {tool.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] px-1.5 py-0.5 rounded"
              style={{ color: accent, backgroundColor: `${accent}10`, border: `1px solid ${accent}20` }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <p className="font-mono text-xs leading-relaxed" style={{ color: '#a1a1aa' }}>
        {tool.desc}
      </p>
    </div>
  )
}
