#!/usr/bin/env node
/**
 * migrate-jekyll.js
 * Migra posts de Jekyll (_posts/*.md) a /content/posts/*.mdx
 *
 * Uso:
 *   node scripts/migrate-jekyll.js --input ../alexandergrg.github.io/_posts
 */

const fs   = require('fs')
const path = require('path')

// ── CLI args ─────────────────────────────────────────────
const args  = process.argv.slice(2)
const input = args[args.indexOf('--input') + 1]

if (!input) {
  console.error('Error: proporciona --input <ruta_de_posts_jekyll>')
  process.exit(1)
}

const inputDir  = path.resolve(input)
const outputDir = path.resolve('content/posts')

if (!fs.existsSync(inputDir)) {
  console.error(`Error: el directorio ${inputDir} no existe.`)
  process.exit(1)
}

fs.mkdirSync(outputDir, { recursive: true })

// ── Helpers ──────────────────────────────────────────────

function stripLiquid(content) {
  return content
    .replace(/{%[^%]*%}/g,    '')  // Liquid tags {% %}
    .replace(/{{[^}]*}}/g,    '')  // Liquid vars {{ }}
    .trim()
}

function detectArea(tags = [], categories = []) {
  const mlKeywords    = ['ml', 'machine learning', 'python', 'nlp', 'sklearn', 'notebook']
  const cyberKeywords = ['htb', 'hackthebox', 'thm', 'tryhackme', 'ctf', 'pentesting', 'metasploit', 'smb', 'linux', 'windows']

  const all = [...tags, ...categories].map((t) => t.toLowerCase())
  if (all.some((t) => mlKeywords.some((k) => t.includes(k))))    return 'ml'
  if (all.some((t) => cyberKeywords.some((k) => t.includes(k)))) return 'cyber'
  return 'cyber' // default
}

function buildFrontmatter(jfm, excerpt) {
  const tags  = jfm.tags       ? (Array.isArray(jfm.tags)       ? jfm.tags       : jfm.tags.split(/[\s,]+/))       : []
  const cats  = jfm.categories ? (Array.isArray(jfm.categories) ? jfm.categories : jfm.categories.split(/[\s,]+/)) : []
  const area  = detectArea(tags, cats)

  return `---
title: "${(jfm.title || 'Sin título').replace(/"/g, "'")}"
date: "${jfm.date ? String(jfm.date).substring(0, 10) : new Date().toISOString().substring(0, 10)}"
tags: [${tags.map((t) => `"${t}"`).join(', ')}]
category: "technique"
area: "${area}"
excerpt: "${(excerpt || jfm.description || jfm.excerpt || '').replace(/"/g, "'").substring(0, 160)}"
---`
}

// ── Main ─────────────────────────────────────────────────

const files = fs.readdirSync(inputDir).filter((f) => f.endsWith('.md') || f.endsWith('.markdown'))
let migrated = 0
let errors   = 0

for (const file of files) {
  try {
    const raw = fs.readFileSync(path.join(inputDir, file), 'utf-8')

    // Parse Jekyll frontmatter
    const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
    if (!fmMatch) {
      console.warn(`⚠  Saltando ${file} — sin frontmatter`)
      continue
    }

    const fmRaw  = fmMatch[1]
    const body   = fmMatch[2]

    // Simple YAML key:value parser (covers Jekyll's simple frontmatter)
    const jfm = {}
    for (const line of fmRaw.split('\n')) {
      const m = line.match(/^(\w+):\s*(.+)$/)
      if (m) jfm[m[1]] = m[2].replace(/^["']|["']$/g, '').trim()
    }

    const cleanBody = stripLiquid(body)
    const excerpt   = cleanBody.split('\n').find((l) => l.trim().length > 30) ?? ''

    // Derive slug from filename (YYYY-MM-DD-slug.md → slug)
    const slug = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.(md|markdown)$/, '')
    const fm   = buildFrontmatter(jfm, excerpt.substring(0, 160))

    const output = `${fm}\n\n${cleanBody}`
    fs.writeFileSync(path.join(outputDir, `${slug}.mdx`), output, 'utf-8')
    console.log(`✓  ${file} → ${slug}.mdx`)
    migrated++
  } catch (err) {
    console.error(`✗  Error procesando ${file}:`, err.message)
    errors++
  }
}

console.log(`\nResumen: ${migrated} migrados, ${errors} errores.`)
