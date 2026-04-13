'use client'

import Link  from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

type NavLink = {
  href:   string
  label:  string
  accent: 'cyan' | 'indigo' | 'purple' | null
}

const navLinks: NavLink[] = [
  { href: '/',            label: 'home',        accent: null     },
  { href: '/writeups',    label: 'write-ups',   accent: 'cyan'   },
  { href: '/research',    label: 'research',    accent: 'indigo' },
  { href: '/blog',        label: 'blog',        accent: null     },
  { href: '/methodology', label: 'metodología', accent: 'purple' },
  { href: '/tools',       label: 'tools',       accent: null     },
  { href: '/about',       label: 'about',       accent: null     },
]

const accentColors = {
  cyan:   '#22d3ee',
  indigo: '#818cf8',
  purple: '#c084fc',
}

function getActiveAccent(pathname: string): string {
  if (pathname.startsWith('/writeups'))    return accentColors.cyan
  if (pathname.startsWith('/research'))    return accentColors.indigo
  if (pathname.startsWith('/methodology')) return accentColors.purple
  return accentColors.indigo
}

export function Nav() {
  const pathname = usePathname()
  const activeAccent = getActiveAccent(pathname)

  return (
    <header
      style={{ backgroundColor: '#111113', borderBottom: '1px solid #27272a' }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logos/sec593-logo-nav.svg"
              alt="SEC-593"
              width={140}
              height={31}
              priority
            />
          </Link>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href)

              const linkAccent = link.accent ? accentColors[link.accent] : activeAccent

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-3 py-1.5 font-mono text-xs rounded transition-colors duration-150"
                  style={{
                    color:           isActive ? linkAccent : '#71717a',
                    backgroundColor: isActive ? `${linkAccent}08` : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = '#d4d4d8'
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.color = '#71717a'
                  }}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-3 right-3 h-px rounded-full"
                      style={{ backgroundColor: linkAccent }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Mobile menu */}
          <MobileMenu pathname={pathname} activeAccent={activeAccent} />
        </div>
      </div>
    </header>
  )
}

function MobileMenu({
  pathname,
  activeAccent,
}: {
  pathname:     string
  activeAccent: string
}) {
  return (
    <div className="md:hidden">
      <details className="relative">
        <summary
          className="list-none cursor-pointer p-2 font-mono text-xs rounded"
          style={{ color: '#71717a' }}
        >
          menu
        </summary>
        <nav
          className="absolute right-0 top-full mt-2 flex flex-col gap-0.5 p-2 rounded-lg border shadow-xl"
          style={{ backgroundColor: '#18181b', borderColor: '#27272a', minWidth: '160px' }}
        >
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href)
            const linkAccent = link.accent ? accentColors[link.accent] : activeAccent

            return (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 font-mono text-xs rounded transition-colors"
                style={{
                  color:           isActive ? linkAccent : '#71717a',
                  backgroundColor: isActive ? `${linkAccent}10` : 'transparent',
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </details>
    </div>
  )
}
