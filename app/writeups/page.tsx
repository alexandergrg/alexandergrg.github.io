import type { Metadata } from 'next'
import { getAllWriteups } from '@/lib/mdx'
import { WriteupCard }   from '@/components/WriteupCard'
export const metadata: Metadata = {
  title:       'Write-ups',
  description: 'Write-ups de HackTheBox y TryHackMe — pentesting, explotación y metodologías ofensivas.',
}

export default function WriteupsPage() {
  const writeups = getAllWriteups()

  const byDifficulty = {
    easy:   writeups.filter((w) => w.frontmatter.difficulty === 'easy'),
    medium: writeups.filter((w) => w.frontmatter.difficulty === 'medium'),
    hard:   writeups.filter((w) => w.frontmatter.difficulty === 'hard'),
  }

  const byPlatform = {
    HackTheBox: writeups.filter((w) => w.frontmatter.platform === 'HackTheBox'),
    TryHackMe:  writeups.filter((w) => w.frontmatter.platform === 'TryHackMe'),
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-xs mb-1" style={{ color: '#22d3ee' }}>~/writeups</p>
        <h1 className="font-mono text-2xl font-bold mb-3" style={{ color: '#f4f4f5' }}>
          Write-ups
        </h1>
        <p className="text-sm max-w-2xl" style={{ color: '#a1a1aa' }}>
          Soluciones y metodologías de máquinas de HackTheBox y TryHackMe.
          Cada write-up incluye reconocimiento, explotación y escalada de privilegios.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-12">
        <StatBox label="total" count={writeups.length} accent="#22d3ee" />
        <StatBox label="easy"   count={byDifficulty.easy.length}   accent="#22d3ee" />
        <StatBox label="medium" count={byDifficulty.medium.length} accent="#fb923c" />
        <StatBox label="hard"   count={byDifficulty.hard.length}   accent="#f87171" />
        <StatBox label="HTB"    count={byPlatform.HackTheBox.length} accent="#22d3ee" />
      </div>

      {/* Grid */}
      {writeups.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {writeups.map((w) => (
            <WriteupCard key={w.slug} writeup={w} />
          ))}
        </div>
      ) : (
        <div
          className="p-12 rounded-lg border text-center"
          style={{ backgroundColor: '#18181b', borderColor: '#27272a', borderStyle: 'dashed' }}
        >
          <p className="font-mono text-sm mb-2" style={{ color: '#22d3ee' }}>
            $ node scripts/migrate-s3c593.js
          </p>
          <p className="font-mono text-xs" style={{ color: '#a1a1aa' }}>
            Ejecuta el script para migrar write-ups desde el sitio Quarto.
          </p>
        </div>
      )}
    </div>
  )
}

function StatBox({ label, count, accent }: { label: string; count: number; accent: string }) {
  return (
    <div
      className="flex flex-col items-center p-4 rounded-lg border"
      style={{ backgroundColor: '#18181b', borderColor: '#27272a' }}
    >
      <span className="font-mono text-xl font-bold" style={{ color: accent }}>{count}</span>
      <span className="font-mono text-[10px] mt-1" style={{ color: '#a1a1aa' }}>{label}</span>
    </div>
  )
}
