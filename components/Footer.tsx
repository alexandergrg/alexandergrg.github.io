'use client'

const links = [
  { label: 'GitHub',   href: 'https://github.com/alexandergrg' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/alexandergrg' },
  { label: 'GitLab',   href: 'https://gitlab.com/alexandergrg' },
]

export function Footer() {
  return (
    <footer
      style={{ borderTop: '1px solid #27272a', backgroundColor: '#111113' }}
      className="mt-auto"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-mono text-sm" style={{ color: '#22d3ee' }}>
              alexander@sec593
            </span>
            <span className="font-mono text-xs" style={{ color: '#a1a1aa' }}>
              Ing. Sistemas · Master Ciberseguridad · AZ-900 · Quito, EC
            </span>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs transition-colors duration-150"
                style={{ color: '#a1a1aa' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#818cf8')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#a1a1aa')}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4" style={{ borderTop: '1px solid #27272a' }}>
          <p className="font-mono text-xs text-center" style={{ color: '#a1a1aa' }}>
            © {new Date().getFullYear()} Alexander González — construido con Next.js · Tailwind · MDX
          </p>
        </div>
      </div>
    </footer>
  )
}
