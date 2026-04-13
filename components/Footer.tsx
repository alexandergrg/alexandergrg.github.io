'use client'

const links = [
  { label: 'GitHub',   href: 'https://github.com/alexandergrg' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/alexandergrg' },
  { label: 'GitLab',   href: 'https://gitlab.com/alexandergrg' },
  { label: 'contact@sec593.com', href: 'mailto:contact@sec593.com' },
]

export function Footer() {
  return (
    <footer
      style={{ borderTop: '1px solid #27272a', backgroundColor: '#111113' }}
      className="mt-auto"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Brand + copyright en una línea */}
          <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
            <span className="font-mono text-xs" style={{ color: '#22d3ee' }}>
              Alexander González
            </span>
            <span style={{ color: '#3f3f46' }}>·</span>
            <span className="font-mono text-xs" style={{ color: '#52525b' }}>
              Master Ciberseguridad · AZ-900 · Quito, EC
            </span>
            <span style={{ color: '#3f3f46' }}>·</span>
            <span className="font-mono text-xs" style={{ color: '#52525b' }}>
              © {new Date().getFullYear()} sec593.com
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs transition-colors duration-150"
                style={{ color: '#52525b' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#818cf8')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#52525b')}
              >
                {l.label}
              </a>
            ))}
          </div>

        </div>
      </div>
    </footer>
  )
}
