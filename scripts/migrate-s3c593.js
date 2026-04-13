#!/usr/bin/env node
/**
 * migrate-s3c593.js
 * Migra write-ups del sitio Quarto s3c-593 a /content/writeups/*.mdx
 *
 * Uso:
 *   node scripts/migrate-s3c593.js --input ../alexandergrg.github.io/s3c-593
 *
 * Acepta archivos .qmd, .md y .html (extrae <main> de los HTML de Quarto).
 */

const fs   = require('fs')
const path = require('path')

const args  = process.argv.slice(2)
const input = args[args.indexOf('--input') + 1]

if (!input) {
  console.error('Error: proporciona --input <ruta_s3c-593>')
  process.exit(1)
}

const inputDir  = path.resolve(input)
const outputDir = path.resolve('content/writeups')

if (!fs.existsSync(inputDir)) {
  console.error(`Error: el directorio ${inputDir} no existe.`)
  process.exit(1)
}

fs.mkdirSync(outputDir, { recursive: true })

// ── Helpers ──────────────────────────────────────────────

function detectDifficulty(text) {
  const t = text.toLowerCase()
  if (t.includes('hard'))   return 'hard'
  if (t.includes('medium')) return 'medium'
  return 'easy'
}

function detectPlatform(text, filename) {
  const t = (text + filename).toLowerCase()
  if (t.includes('tryhackme') || t.includes('thm')) return 'TryHackMe'
  return 'HackTheBox'
}

function detectOS(text) {
  const t = text.toLowerCase()
  if (t.includes('windows')) return 'Windows'
  return 'Linux'
}

function extractTags(text) {
  const keywords = [
    'SMB', 'RDP', 'FTP', 'SSH', 'HTTP', 'HTTPS', 'SQL', 'SQLi',
    'XSS', 'LFI', 'RFI', 'SSRF', 'RCE', 'Buffer', 'Overflow',
    'Metasploit', 'nmap', 'CVE', 'Active Directory', 'Kerberos',
    'EternalBlue', 'MS17', 'CrackMapExec', 'BloodHound',
  ]
  return keywords.filter((k) => text.includes(k))
}

function stripQuartoArtefacts(content) {
  return content
    .replace(/^:::\{[^}]*\}[\s\S]*?^:::/gm, '')   // Quarto divs
    .replace(/\|>$/gm,                        '')   // R pipe
    .replace(/```\{[a-z]+[^`]*\}/g,      '```')    // ```{python} → ```
    .replace(/<[^>]+>/g,                      '')   // HTML tags en .qmd
    .trim()
}

// ── Main ─────────────────────────────────────────────────

const exts  = ['.qmd', '.md', '.markdown']
const files = fs.readdirSync(inputDir).filter((f) => exts.includes(path.extname(f)))

let migrated = 0
let errors   = 0

for (const file of files) {
  try {
    const raw  = fs.readFileSync(path.join(inputDir, file), 'utf-8')
    const slug = path.basename(file, path.extname(file))

    // Parse frontmatter
    const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
    const fmRaw   = fmMatch?.[1] ?? ''
    const body    = fmMatch?.[2] ?? raw

    const jfm = {}
    for (const line of fmRaw.split('\n')) {
      const m = line.match(/^(\w+):\s*(.+)$/)
      if (m) jfm[m[1]] = m[2].replace(/^["']|["']$/g, '').trim()
    }

    const cleanBody  = stripQuartoArtefacts(body)
    const title      = (jfm.title || slug).replace(/"/g, "'")
    const date       = jfm.date ? String(jfm.date).substring(0, 10) : new Date().toISOString().substring(0, 10)
    const platform   = detectPlatform(raw, file)
    const difficulty = detectDifficulty(raw)
    const os         = detectOS(raw)
    const tags       = extractTags(raw)
    const excerpt    = cleanBody.split('\n').find((l) => l.trim().length > 30)?.substring(0, 160) ?? ''

    const fm = `---
title: "${title}"
date: "${date}"
tags: [${[platform, ...tags].map((t) => `"${t}"`).join(', ')}]
category: "writeup"
area: "cyber"
platform: "${platform}"
difficulty: "${difficulty}"
os: "${os}"
excerpt: "${excerpt.replace(/"/g, "'")}"
---`

    fs.writeFileSync(path.join(outputDir, `${slug}.mdx`), `${fm}\n\n${cleanBody}`, 'utf-8')
    console.log(`✓  ${file} → ${slug}.mdx  [${platform} · ${difficulty} · ${os}]`)
    migrated++
  } catch (err) {
    console.error(`✗  Error procesando ${file}:`, err.message)
    errors++
  }
}

console.log(`\nResumen: ${migrated} migrados, ${errors} errores.`)
