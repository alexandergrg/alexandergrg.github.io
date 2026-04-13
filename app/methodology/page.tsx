import type { Metadata } from 'next'

export const metadata: Metadata = {
  title:       'Metodología',
  description: 'Metodologías de pentesting: reconocimiento, enumeración, explotación y post-explotación.',
}

const sections = [
  {
    title: 'Reconocimiento',
    accent: '#c084fc',
    items: [
      'OSINT pasivo — búsquedas avanzadas, Shodan, WHOIS',
      'Enumeración de subdominios — amass, subfinder, dnsx',
      'Fingerprinting de tecnologías — whatweb, wappalyzer',
      'Recolección de emails y metadatos — theHarvester',
    ],
  },
  {
    title: 'Enumeración',
    accent: '#c084fc',
    items: [
      'Port scanning — nmap con scripts NSE',
      'Enumeración SMB — crackmapexec, smbclient, enum4linux',
      'Enumeración web — gobuster, feroxbuster, ffuf',
      'Enumeración LDAP / Active Directory — bloodhound, ldapdomaindump',
    ],
  },
  {
    title: 'Explotación',
    accent: '#c084fc',
    items: [
      'Exploitation manual vs. automatizado (Metasploit)',
      'Web: SQLi, XSS, SSRF, SSTI, Path Traversal, IDOR',
      'Buffer Overflow — x86/x64 con pwntools',
      'Credenciales por defecto y spray de contraseñas',
    ],
  },
  {
    title: 'Post-Explotación',
    accent: '#c084fc',
    items: [
      'Escalada de privilegios Linux — linpeas, sudo misconfigs, SUID',
      'Escalada de privilegios Windows — winpeas, tokens, UAC bypass',
      'Lateral movement — pass-the-hash, pass-the-ticket, DCOM',
      'Active Directory — Kerberoasting, AS-REP Roasting, DCSync',
      'Persistence — cron jobs, registry, scheduled tasks',
    ],
  },
  {
    title: 'Herramientas de referencia',
    accent: '#c084fc',
    items: [
      'Nmap · Burp Suite · Metasploit · CrackMapExec',
      'Impacket · BloodHound · Mimikatz · Rubeus',
      'Gobuster · ffuf · Hashcat · John the Ripper',
      'Wireshark · tcpdump · proxychains · chisel',
    ],
  },
]

export default function MethodologyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-xs mb-1" style={{ color: '#c084fc' }}>~/methodology</p>
        <h1 className="font-mono text-2xl font-bold mb-3" style={{ color: '#f4f4f5' }}>
          Metodología de Pentesting
        </h1>
        <p className="text-sm max-w-2xl" style={{ color: '#a1a1aa' }}>
          Framework personal de pruebas de penetración basado en PTES, OWASP y metodologías HTB/THM.
          Proceso repetible de reconocimiento → enumeración → explotación → post-explotación.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {sections.map((section) => (
          <div
            key={section.title}
            className="p-6 rounded-lg border"
            style={{ backgroundColor: '#18181b', borderColor: '#27272a' }}
          >
            <h2
              className="font-mono text-sm font-semibold mb-4"
              style={{ color: section.accent }}
            >
              {`// ${section.title}`}
            </h2>
            <ul className="space-y-2">
              {section.items.map((item) => (
                <li key={item} className="flex items-start gap-2 font-mono text-xs" style={{ color: '#a1a1aa' }}>
                  <span style={{ color: '#c084fc', marginTop: '1px' }}>›</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
