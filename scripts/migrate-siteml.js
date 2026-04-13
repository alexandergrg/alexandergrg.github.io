#!/usr/bin/env node
/**
 * migrate-siteml.js
 * Migra contenido ML del site-ml de Quarto a /content/research/*.mdx
 *
 * Uso:
 *   node scripts/migrate-siteml.js --input ../alexandergrg.github.io/site-ml
 *
 * Detecta automáticamente la categoría según el nombre del archivo.
 */

const fs   = require('fs')
const path = require('path')

const args  = process.argv.slice(2)
const input = args[args.indexOf('--input') + 1]

if (!input) {
  console.error('Error: proporciona --input <ruta_site-ml>')
  process.exit(1)
}

const inputDir  = path.resolve(input)
const outputDir = path.resolve('content/research')

if (!fs.existsSync(inputDir)) {
  console.error(`Error: el directorio ${inputDir} no existe.`)
  process.exit(1)
}

fs.mkdirSync(outputDir, { recursive: true })

// ── Slug mapping (Quarto → new slugs) ───────────────────
const slugMap = {
  'eda':                    'eda',
  'cnj':                    'cnj',
  'classification':         'classification',
  'categorical_encoding':   'categorical-encoding',
  'categorical_pipeline':   'categorical-pipeline',
  'midterm_regression':     'midterm-regression',
  'midterm_classification': 'midterm-classification',
  'nltk':                   'nltk',
  'bagofwords':             'bag-of-words',
  'tfidf':                  'tfidf',
  'text_classificaction':   'text-classification',
  'lab2':                   'lab2-twitter',
  'knn':                    'knn',
  'kmeans':                 'kmeans',
  'hac':                    'hac',
  'altair':                 'altair',
}

// ── Category detection ───────────────────────────────────
function detectCategory(slug) {
  if (['eda', 'cnj'].includes(slug))                return 'eda'
  if (['knn', 'kmeans', 'hac'].includes(slug))      return 'clustering'
  if (['nltk', 'bag-of-words', 'tfidf', 'text-classification', 'lab2-twitter'].includes(slug)) return 'nlp'
  if (['midterm-regression'].includes(slug))        return 'regression'
  if (['altair'].includes(slug))                    return 'viz'
  if (['lab2-twitter'].includes(slug))              return 'lab'
  return 'classification'
}

// ── Tool detection ───────────────────────────────────────
function detectTools(text) {
  const tools = [
    'Python', 'scikit-learn', 'NLTK', 'pandas', 'NumPy', 'Plotly',
    'Altair', 'Vega', 'Matplotlib', 'seaborn', 'Jupyter',
    'TF-IDF', 'Naive Bayes', 'KNN', 'K-Means', 'HAC',
    'RandomForest', 'SVM', 'LogisticRegression',
  ]
  return tools.filter((t) => text.includes(t))
}

function hasCharts(text) {
  return text.includes('plotly') || text.includes('altair') ||
         text.includes('matplotlib') || text.includes('seaborn') ||
         text.includes('fig.show') || text.includes('plt.show')
}

function hasNotebook(text) {
  return text.includes('.ipynb') || text.includes('jupyter') ||
         text.includes('```python') || text.includes('```{python}')
}

function stripQuarto(content) {
  return content
    .replace(/^:::\{[^}]*\}[\s\S]*?^:::/gm, '')
    .replace(/```\{python[^`]*\}/g, '```python')
    .replace(/```\{r[^`]*\}/g,      '```r')
    .trim()
}

// ── Main ─────────────────────────────────────────────────

const exts  = ['.qmd', '.md', '.markdown']
const files = fs.readdirSync(inputDir).filter((f) => exts.includes(path.extname(f)))

let migrated = 0
let errors   = 0

for (const file of files) {
  try {
    const originalSlug = path.basename(file, path.extname(file))
    const newSlug      = slugMap[originalSlug] ?? originalSlug.replace(/_/g, '-')
    const category     = detectCategory(newSlug)

    const raw = fs.readFileSync(path.join(inputDir, file), 'utf-8')

    const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
    const fmRaw   = fmMatch?.[1] ?? ''
    const body    = fmMatch?.[2] ?? raw

    const jfm = {}
    for (const line of fmRaw.split('\n')) {
      const m = line.match(/^(\w+):\s*(.+)$/)
      if (m) jfm[m[1]] = m[2].replace(/^["']|["']$/g, '').trim()
    }

    const cleanBody = stripQuarto(body)
    const title     = (jfm.title || newSlug.replace(/-/g, ' ')).replace(/"/g, "'")
    const date      = jfm.date ? String(jfm.date).substring(0, 10) : new Date().toISOString().substring(0, 10)
    const tools     = detectTools(raw)
    const excerpt   = cleanBody.split('\n').find((l) => l.trim().length > 30)?.substring(0, 160) ?? ''

    const fm = `---
title: "${title}"
date: "${date}"
tags: [${tools.slice(0, 5).map((t) => `"${t}"`).join(', ')}]
category: "${category}"
area: "ml"
tools: [${tools.map((t) => `"${t}"`).join(', ')}]
excerpt: "${excerpt.replace(/"/g, "'")}"
hasNotebook: ${hasNotebook(raw)}
hasCharts: ${hasCharts(raw)}
---`

    fs.writeFileSync(path.join(outputDir, `${newSlug}.mdx`), `${fm}\n\n${cleanBody}`, 'utf-8')
    console.log(`✓  ${file} → ${newSlug}.mdx  [${category}]`)
    migrated++
  } catch (err) {
    console.error(`✗  Error procesando ${file}:`, err.message)
    errors++
  }
}

console.log(`\nResumen: ${migrated} migrados, ${errors} errores.`)
