import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllWriteups } from '@/lib/mdx'
import { getAllResearch } from '@/lib/mdx'
import { getAllPosts }    from '@/lib/mdx'
import { WriteupCard }   from '@/components/WriteupCard'
import { ResearchCard }  from '@/components/ResearchCard'

export const metadata: Metadata = {
  title: 'Alexander González — Security Researcher & AI Engineer',
}

export default function HomePage() {
  const writeups       = getAllWriteups()
  const research       = getAllResearch()
  const posts          = getAllPosts()
  const latestWriteups = writeups.slice(0, 3)
  const latestResearch = research.slice(0, 3)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">

      {/* ── Hero ── */}
      <section className="py-16 md:py-24 border-b" style={{ borderColor: '#27272a' }}>

        {/* Role label */}
        <div className="flex items-center gap-3 mb-10">
          <span style={{ width: '2rem', height: '1px', backgroundColor: '#818cf8', display: 'inline-block' }} />
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: '#818cf8', fontFamily: 'Inter, sans-serif', letterSpacing: '0.15em' }}
          >
            Security Researcher · AI Engineer
          </span>
        </div>

        <div className="grid md:grid-cols-5 gap-12 items-start">

          {/* Identity — 3 cols */}
          <div className="md:col-span-3">
            <h1
              className="font-bold leading-none tracking-tight mb-6"
              style={{
                fontSize:   'clamp(3rem, 8vw, 5rem)',
                color:      '#f4f4f5',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Alexander<br />González
            </h1>

            {/* Credentials */}
            <div className="flex flex-wrap gap-2 mb-8">
              {['Ing. Sistemas', 'Master Ciberseguridad', 'AZ-900', 'Quito, EC'].map((c) => (
                <span
                  key={c}
                  className="font-mono text-xs px-2.5 py-1 rounded"
                  style={{ color: '#a1a1aa', backgroundColor: '#18181b', border: '1px solid #3f3f46' }}
                >
                  {c}
                </span>
              ))}
            </div>

            <p
              className="text-base leading-relaxed mb-10 max-w-lg"
              style={{ color: '#71717a', fontFamily: 'Inter, sans-serif' }}
            >
              Offensive security and machine learning research.
              Penetration testing, threat analysis, and AI-driven security engineering.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/writeups"
                className="font-mono text-xs px-5 py-2.5 rounded transition-colors duration-150"
                style={{ color: '#09090b', backgroundColor: '#22d3ee', fontWeight: 600 }}
              >
                write-ups
              </Link>
              <Link
                href="/research"
                className="font-mono text-xs px-5 py-2.5 rounded border transition-colors duration-150"
                style={{ color: '#818cf8', borderColor: '#818cf830', backgroundColor: '#818cf808' }}
              >
                research →
              </Link>
              <Link
                href="/about"
                className="font-mono text-xs px-5 py-2.5 rounded border transition-colors duration-150"
                style={{ color: '#71717a', borderColor: '#27272a', backgroundColor: 'transparent' }}
              >
                about →
              </Link>
            </div>
          </div>

          {/* Terminal — 2 cols, secondary */}
          <div className="md:col-span-2">
            <div
              className="rounded-xl overflow-hidden"
              style={{ border: '1px solid #27272a', backgroundColor: '#111113' }}
            >
              {/* Window bar */}
              <div
                className="flex items-center gap-1.5 px-4 py-3 border-b"
                style={{ borderColor: '#27272a', backgroundColor: '#18181b' }}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#3f3f46' }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#3f3f46' }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#3f3f46' }} />
                <span className="font-mono text-xs ml-2" style={{ color: '#52525b' }}>sec593 ~ bash</span>
              </div>
              <div className="p-5 font-mono text-xs leading-relaxed">
                <TerminalHero />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 border-b" style={{ borderColor: '#27272a' }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ backgroundColor: '#27272a' }}>
          {[
            { label: 'Write-ups',  count: writeups.length,  href: '/writeups', accent: '#22d3ee' },
            { label: 'Notebooks',  count: research.length,  href: '/research', accent: '#818cf8' },
            { label: 'Posts',      count: posts.length,     href: '/blog',     accent: '#f4f4f5' },
            { label: 'Tools',      count: '—',              href: '/tools',    accent: '#c084fc' },
          ].map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="flex flex-col items-center justify-center py-8 transition-colors duration-200"
              style={{ backgroundColor: '#09090b' }}
            >
              <span className="text-3xl font-bold mb-1" style={{ color: s.accent, fontFamily: 'Inter, sans-serif' }}>
                {s.count || '—'}
              </span>
              <span className="font-mono text-xs" style={{ color: '#52525b' }}>
                {s.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Latest content ── */}
      <section className="py-16 border-b" style={{ borderColor: '#27272a' }}>
        <div className="grid md:grid-cols-2 gap-16">

          {/* Write-ups */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span style={{ width: '1rem', height: '1px', backgroundColor: '#22d3ee', display: 'inline-block' }} />
                <h2 className="font-mono text-xs tracking-widest uppercase" style={{ color: '#22d3ee' }}>
                  Últimos Write-ups
                </h2>
              </div>
              <Link href="/writeups" className="font-mono text-xs" style={{ color: '#52525b' }}>
                ver todos →
              </Link>
            </div>
            {latestWriteups.length > 0 ? (
              <div className="space-y-4">
                {latestWriteups.map((w) => <WriteupCard key={w.slug} writeup={w} />)}
              </div>
            ) : (
              <EmptyState accent="#22d3ee" message="node scripts/migrate-s3c593.js" />
            )}
          </div>

          {/* Research */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span style={{ width: '1rem', height: '1px', backgroundColor: '#818cf8', display: 'inline-block' }} />
                <h2 className="font-mono text-xs tracking-widest uppercase" style={{ color: '#818cf8' }}>
                  Últimos Research
                </h2>
              </div>
              <Link href="/research" className="font-mono text-xs" style={{ color: '#52525b' }}>
                ver todos →
              </Link>
            </div>
            {latestResearch.length > 0 ? (
              <div className="space-y-4">
                {latestResearch.map((r) => <ResearchCard key={r.slug} item={r} />)}
              </div>
            ) : (
              <EmptyState accent="#818cf8" message="node scripts/migrate-siteml.js" />
            )}
          </div>

        </div>
      </section>

      {/* ── Area cards ── */}
      <section className="py-16">
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
            description="Investigación ML/IA: clasificación, NLP, clustering, análisis exploratorio de datos y visualizaciones interactivas."
            accent="#818cf8"
            href="/research"
            tags={['Python', 'scikit-learn', 'NLP', 'EDA', 'Plotly']}
          />
        </div>
      </section>

    </div>
  )
}

// ──────────────────────────────────────────────────────────────

function TerminalHero() {
  return (
    <div className="space-y-1">
      <Line prompt="~$" cmd="whoami" promptColor="#22d3ee" cmdColor="#818cf8" />
      <Line prompt=" >" cmd="alexander gonzalez" promptColor="#3f3f46" cmdColor="#f4f4f5" />
      <div className="py-1" />
      <Line prompt="~$" cmd="cat roles.txt" promptColor="#22d3ee" cmdColor="#818cf8" />
      <Line prompt=" >" cmd="pentester" promptColor="#3f3f46" cmdColor="#a1a1aa" />
      <Line prompt=" >" cmd="ml researcher" promptColor="#3f3f46" cmdColor="#a1a1aa" />
      <Line prompt=" >" cmd="security engineer" promptColor="#3f3f46" cmdColor="#a1a1aa" />
      <div className="py-1" />
      <div className="flex gap-2">
        <span style={{ color: '#22d3ee' }}>~$</span>
        <span className="cursor-blink" style={{ color: '#22d3ee' }}>█</span>
      </div>
    </div>
  )
}

function Line({ prompt, cmd, promptColor, cmdColor }: {
  prompt: string; cmd: string; promptColor: string; cmdColor: string
}) {
  return (
    <div className="flex gap-2">
      <span style={{ color: promptColor }}>{prompt}</span>
      <span style={{ color: cmdColor }}>{cmd}</span>
    </div>
  )
}

function EmptyState({ accent, message }: { accent: string; message: string }) {
  return (
    <div
      className="p-6 rounded-lg border text-center"
      style={{ backgroundColor: '#18181b', borderColor: '#27272a', borderStyle: 'dashed' }}
    >
      <p className="font-mono text-xs" style={{ color: '#52525b' }}>$ {message}</p>
    </div>
  )
}

function AreaCard({ title, description, accent, href, tags }: {
  title: string; description: string; accent: string; href: string; tags: string[]
}) {
  return (
    <Link href={href} className="block group">
      <div
        className="p-8 rounded-xl border h-full transition-colors duration-200"
        style={{ backgroundColor: '#18181b', borderColor: '#27272a' }}
      >
        <div className="flex items-center gap-3 mb-4">
          <span style={{ width: '1.5rem', height: '2px', backgroundColor: accent, display: 'inline-block', borderRadius: '9999px' }} />
          <h3
            className="font-semibold text-sm tracking-wide"
            style={{ color: accent, fontFamily: 'Inter, sans-serif' }}
          >
            {title}
          </h3>
        </div>
        <p className="text-sm leading-relaxed mb-6" style={{ color: '#71717a', fontFamily: 'Inter, sans-serif' }}>
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span
              key={t}
              className="font-mono text-[11px] px-2 py-0.5 rounded"
              style={{ color: accent, backgroundColor: `${accent}10`, border: `1px solid ${accent}20` }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}
