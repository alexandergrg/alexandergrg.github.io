import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllWriteups } from '@/lib/mdx'
import { getAllResearch } from '@/lib/mdx'
import { getAllPosts }    from '@/lib/mdx'
import { WriteupCard }   from '@/components/WriteupCard'
import { ResearchCard }  from '@/components/ResearchCard'

export const metadata: Metadata = {
  title: 'SEC-593 — Alexander González',
}

export default function HomePage() {
  const writeups    = getAllWriteups()
  const research    = getAllResearch()
  const posts       = getAllPosts()

  const latestWriteups = writeups.slice(0, 3)
  const latestResearch = research.slice(0, 3)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-20">
      {/* ── Hero ── */}
      <section className="grid md:grid-cols-2 gap-10 items-center">
        {/* Identity */}
        <div>
          <p className="font-mono text-xs tracking-widest uppercase mb-4" style={{ color: '#818cf8' }}>
            Cybersecurity · Artificial Intelligence
          </p>
          <h1 className="text-4xl font-bold mb-3 leading-tight" style={{ color: '#f4f4f5', fontFamily: 'Inter, sans-serif' }}>
            Alexander González
          </h1>
          <p className="text-base leading-relaxed mb-6" style={{ color: '#a1a1aa', fontFamily: 'Inter, sans-serif' }}>
            Ingeniero de Sistemas y Magíster en Ciberseguridad especializado en
            pentesting ofensivo e investigación en Machine Learning aplicado a la seguridad.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/writeups"
              className="font-mono text-xs px-4 py-2 rounded border transition-colors duration-150"
              style={{ color: '#22d3ee', borderColor: '#22d3ee30', backgroundColor: '#22d3ee08' }}
            >
              write-ups →
            </Link>
            <Link
              href="/research"
              className="font-mono text-xs px-4 py-2 rounded border transition-colors duration-150"
              style={{ color: '#818cf8', borderColor: '#818cf830', backgroundColor: '#818cf808' }}
            >
              research →
            </Link>
          </div>
        </div>

        {/* Terminal */}
        <div
          className="rounded-xl p-6 font-mono text-sm leading-loose"
          style={{ backgroundColor: '#18181b', border: '1px solid #27272a' }}
        >
          <div className="flex items-center gap-1.5 mb-4">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#3f3f46' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#3f3f46' }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#3f3f46' }} />
          </div>
          <TerminalHero />
        </div>
      </section>

      {/* ── Stats ── */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'write-ups', count: writeups.length, href: '/writeups', accent: '#22d3ee' },
            { label: 'notebooks', count: research.length, href: '/research', accent: '#818cf8' },
            { label: 'posts',     count: posts.length,    href: '/blog',     accent: '#f4f4f5' },
            { label: 'tools',     count: '—',             href: '/tools',    accent: '#c084fc' },
          ].map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="flex flex-col items-center justify-center p-6 rounded-lg border transition-colors duration-200"
              style={{ backgroundColor: '#18181b', borderColor: '#27272a' }}
            >
              <span className="font-mono text-2xl font-bold" style={{ color: s.accent }}>
                {s.count || '—'}
              </span>
              <span className="font-mono text-xs mt-1" style={{ color: '#a1a1aa' }}>
                {s.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Latest content — two columns ── */}
      <section>
        <div className="grid md:grid-cols-2 gap-10">
          {/* Write-ups */}
          <div>
            <SectionHeader title="últimos write-ups" accent="#22d3ee" href="/writeups" />
            {latestWriteups.length > 0 ? (
              <div className="space-y-4">
                {latestWriteups.map((w) => (
                  <WriteupCard key={w.slug} writeup={w} />
                ))}
              </div>
            ) : (
              <EmptyState accent="#22d3ee" message="Ejecuta: node scripts/migrate-s3c593.js" />
            )}
          </div>

          {/* Research */}
          <div>
            <SectionHeader title="últimos research" accent="#818cf8" href="/research" />
            {latestResearch.length > 0 ? (
              <div className="space-y-4">
                {latestResearch.map((r) => (
                  <ResearchCard key={r.slug} item={r} />
                ))}
              </div>
            ) : (
              <EmptyState accent="#818cf8" message="Ejecuta: node scripts/migrate-siteml.js" />
            )}
          </div>
        </div>
      </section>

      {/* ── Area cards ── */}
      <section>
        <div className="grid md:grid-cols-2 gap-6">
          <AreaCard
            title="Ciberseguridad & Pentesting"
            description="Write-ups de HackTheBox y TryHackMe, metodologías de pentesting, técnicas ofensivas, Active Directory y OSINT."
            accent="#22d3ee"
            href="/writeups"
            tags={['HTB', 'THM', 'Red Team', 'AD', 'OSINT']}
          />
          <AreaCard
            title="Machine Learning & Research"
            description="Investigación ML/IA: clasificación, NLP, clustering, análisis exploratorio de datos y visualizaciones interactivas con Plotly."
            accent="#818cf8"
            href="/research"
            tags={['Python', 'scikit-learn', 'NLP', 'EDA', 'Plotly']}
          />
        </div>
      </section>
    </div>
  )
}

// ──────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────

function TerminalHero() {
  return (
    <div className="space-y-0.5">
      <Line prompt="alexander@sec593:~$" cmd="whoami" promptColor="#22d3ee" cmdColor="#818cf8" />
      <Line prompt=">" cmd="pentester · ML researcher · security engineer" promptColor="#a1a1aa" cmdColor="#f4f4f5" />
      <div className="py-1" />
      <Line prompt="alexander@sec593:~$" cmd="ls ./expertise/" promptColor="#22d3ee" cmdColor="#818cf8" />
      <Line prompt=">" cmd="ciberseguridad/    machine-learning/    investigacion/" promptColor="#a1a1aa" cmdColor="#f4f4f5" />
      <div className="py-1" />
      <div className="flex gap-2">
        <span style={{ color: '#22d3ee' }}>alexander@sec593:~$</span>
        <span className="cursor-blink" style={{ color: '#22d3ee' }}>█</span>
      </div>
    </div>
  )
}

function Line({
  prompt,
  cmd,
  promptColor,
  cmdColor,
}: {
  prompt:       string
  cmd:          string
  promptColor:  string
  cmdColor:     string
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      <span style={{ color: promptColor }}>{prompt}</span>
      <span style={{ color: cmdColor }}>{cmd}</span>
    </div>
  )
}

function SectionHeader({
  title,
  accent,
  href,
}: {
  title:  string
  accent: string
  href:   string
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-mono text-sm font-semibold" style={{ color: accent }}>
        {`// ${title}`}
      </h2>
      <Link href={href} className="font-mono text-xs" style={{ color: '#a1a1aa' }}>
        ver todos →
      </Link>
    </div>
  )
}

function EmptyState({ accent, message }: { accent: string; message: string }) {
  return (
    <div
      className="p-6 rounded-lg border text-center"
      style={{ backgroundColor: '#18181b', borderColor: '#27272a', borderStyle: 'dashed' }}
    >
      <p className="font-mono text-xs" style={{ color: accent }}>
        {message}
      </p>
    </div>
  )
}

function AreaCard({
  title,
  description,
  accent,
  href,
  tags,
}: {
  title:       string
  description: string
  accent:      string
  href:        string
  tags:        string[]
}) {
  return (
    <Link href={href} className="block group">
      <div
        className="p-8 rounded-lg border transition-colors duration-200 h-full"
        style={{ backgroundColor: '#18181b', borderColor: '#27272a' }}
      >
        <h3 className="font-mono font-semibold text-base mb-3" style={{ color: accent }}>
          {title}
        </h3>
        <p className="text-sm leading-relaxed mb-5" style={{ color: '#a1a1aa' }}>
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="font-mono text-[11px] px-2 py-0.5 rounded"
              style={{ color: accent, backgroundColor: `${accent}10`, border: `1px solid ${accent}25` }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
