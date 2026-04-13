# SEC-593 — Instrucciones completas para Claude Code

## Visión del proyecto

Unificar tres sitios actualmente separados en un solo blog Next.js profesional:

| Sitio actual | URL | Contenido |
|---|---|---|
| Blog principal | `alexandergrg.github.io` | Posts de ciberseguridad (Jekyll) |
| S3C-593 | `alexandergrg.github.io/s3c-593` | Write-ups HTB/THM, metodologías (Quarto) |
| ML Portal | `alexandergrg.github.io/site-ml` | Investigación ML/IA, notebooks (Quarto) |

**Resultado:** un solo sitio en `alexandergrg.github.io` con navegación unificada, identidad visual consistente y todo el contenido accesible desde un hub central.

**Autor:** Alexander González — Ing. Sistemas, Master Ciberseguridad, AZ-900, Quito EC.

---

## Stack tecnológico

- **Framework:** Next.js 14 con App Router
- **Estilos:** Tailwind CSS — sin librerías UI externas
- **Contenido:** MDX con `next-mdx-remote`
- **Syntax highlight:** Shiki, tema Dracula
- **Visualizaciones ML:** componentes React que envuelven Plotly.js y Vega/Altair
- **Lenguaje:** TypeScript
- **Deploy:** GitHub Pages via GitHub Actions (static export)

---

## Diseño — dark terminal aesthetic

| Token | Valor |
|---|---|
| Fondo principal | `#0d0f14` |
| Fondo secundario | `#080a0e` |
| Fondo cards/código | `#0a0c10` |
| Texto principal | `#c9d1d9` |
| Texto secundario | `#8b949e` |
| Accent verde — ciberseguridad | `#00ff87` |
| Accent azul — ML / IA | `#58a6ff` |
| Accent púrpura — research / metodología | `#a371f7` |
| Bordes | `#1e2430` |
| Fuente código y headings | JetBrains Mono |
| Fuente prosa | Inter |

**Regla de color por área:**
- Verde `#00ff87` → ciberseguridad, pentesting, write-ups
- Azul `#58a6ff` → ML, IA, research, notebooks
- Púrpura `#a371f7` → metodologías, papers, análisis profundos

El color del underline activo en el nav y de los badges cambia automáticamente según la sección en que esté el usuario.

---

## Arquitectura de rutas

```
/                            → Hub central — home unificado
/blog                        → Feed de todos los posts (cyber + ML, filtrables)
/blog/[slug]                 → Post individual

/writeups                    → Write-ups HTB/TryHackMe
/writeups/[slug]             → Write-up individual

/research                    → Hub de investigación ML/IA
/research/[slug]             → Artículo individual
/research/eda                → Análisis exploratorio de datos
/research/cnj                → Caso CNJ — datos judiciales
/research/classification     → Modelos de clasificación
/research/categorical-encoding
/research/categorical-pipeline
/research/midterm-regression
/research/midterm-classification
/research/nltk
/research/bag-of-words
/research/tfidf
/research/text-classification
/research/lab2-twitter
/research/knn
/research/kmeans
/research/hac
/research/altair              → Quarto + Altair visualizaciones

/methodology                 → Metodologías de pentesting
/tools                       → Herramientas (cyber + ML)
/about                       → CV unificado — ambas áreas
```

---

## Estructura de carpetas

```
sec593-blog/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                          # Home hub unificado
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── writeups/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── research/
│   │   ├── page.tsx                      # Hub ML/IA
│   │   ├── [slug]/page.tsx
│   │   ├── eda/page.tsx
│   │   ├── nlp/page.tsx
│   │   ├── classification/page.tsx
│   │   └── clustering/page.tsx
│   ├── methodology/page.tsx
│   ├── tools/page.tsx
│   ├── about/page.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── Nav.tsx                           # Nav con accent dinámico por sección
│   ├── Footer.tsx
│   ├── PostCard.tsx                      # Card genérica (cyber + ml)
│   ├── WriteupCard.tsx                   # Card con platform / difficulty / OS
│   ├── ResearchCard.tsx                  # Card con tools / dataset / hasCharts
│   ├── CodeBlock.tsx                     # Shiki Dracula + botón copiar
│   ├── TagBadge.tsx
│   ├── DifficultyBadge.tsx
│   ├── AreaLabel.tsx                     # Label "ciberseguridad" o "ML/IA" con su color
│   └── charts/
│       ├── PlotlyChart.tsx               # Wrapper Plotly (lazy, ssr: false)
│       └── VegaChart.tsx                 # Wrapper Vega-Lite / Altair (lazy, ssr: false)
├── content/
│   ├── posts/                            # Posts generales .mdx
│   ├── writeups/                         # Write-ups HTB/THM .mdx
│   └── research/                         # Investigación ML/IA .mdx
├── lib/
│   ├── mdx.ts                            # Leer/parsear MDX por sección
│   ├── getAllContent.ts                   # Agregar todo el contenido para /blog
│   └── utils.ts
├── scripts/
│   ├── migrate-jekyll.js                 # Migrar _posts/ del blog Jekyll
│   ├── migrate-s3c593.js                 # Migrar write-ups del sitio Quarto s3c-593
│   └── migrate-siteml.js                 # Migrar contenido ML del site-ml
├── public/
│   └── .nojekyll
├── .github/
│   └── workflows/
│       └── deploy.yml
├── next.config.js
├── tailwind.config.ts
└── CLAUDE.md
```

---

## Frontmatter por tipo de contenido

### Posts generales — `/content/posts/*.mdx`
```yaml
---
title: "Título del post"
date: "2024-01-15"
tags: ["SMB", "Windows"]
category: "technique"        # technique | tool | osint | defense | writeup
area: "cyber"                # cyber | ml
excerpt: "Descripción corta"
---
```

### Write-ups — `/content/writeups/*.mdx`
```yaml
---
title: "Blue — EternalBlue MS17-010"
date: "2024-01-15"
tags: ["HTB", "SMB", "CVE-2017-0143"]
category: "writeup"
area: "cyber"
platform: "HackTheBox"       # HackTheBox | TryHackMe
difficulty: "easy"           # easy | medium | hard
os: "Windows"                # Windows | Linux
excerpt: "Explotación de EternalBlue en máquina Blue de HTB"
---
```

### Investigación ML/IA — `/content/research/*.mdx`
```yaml
---
title: "Clasificación de texto con TF-IDF y Naive Bayes"
date: "2025-10-10"
tags: ["NLP", "TF-IDF", "scikit-learn", "Python"]
category: "nlp"              # eda | classification | nlp | clustering | regression | lab | viz
area: "ml"
dataset: "Twitter sentiment"
tools: ["Python", "scikit-learn", "NLTK", "Plotly"]
excerpt: "Vectorización y clasificación supervisada con pipeline de scikit-learn"
hasNotebook: true
hasCharts: true
---
```

---

## Página Home — hub unificado

### Hero terminal animado
```
alexander@sec593:~$ whoami
> pentester · ML researcher · security engineer

alexander@sec593:~$ ls ./expertise/
> ciberseguridad/    machine-learning/    investigacion/

alexander@sec593:~$ █
```

### Layout del home
1. Hero terminal con cursor parpadeante
2. Stats en 4 columnas: write-ups · notebooks · posts · tools
3. Dos columnas paralelas:
   - Columna izquierda (accent verde): últimos 3 write-ups HTB/THM
   - Columna derecha (accent azul): últimos 3 artículos de research ML
4. Dos cards grandes de área con link a sus secciones:
   - "Ciberseguridad & Pentesting" → /writeups
   - "Machine Learning & Research" → /research

---

## Página /research — hub ML/IA

Reemplaza el `site-ml` actual. Migración completa:

| Página Quarto actual | Ruta nueva | Categoría |
|---|---|---|
| `eda.html` | `/research/eda` | EDA |
| `cnj.html` | `/research/cnj` | EDA |
| `classification.html` | `/research/classification` | Clasificación |
| `categorical_encoding.html` | `/research/categorical-encoding` | Clasificación |
| `categorical_pipeline.html` | `/research/categorical-pipeline` | Clasificación |
| `midterm_regression.html` | `/research/midterm-regression` | Regresión |
| `midterm_classification.html` | `/research/midterm-classification` | Clasificación |
| `nltk.html` | `/research/nltk` | NLP |
| `bagofwords.html` | `/research/bag-of-words` | NLP |
| `tfidf.html` | `/research/tfidf` | NLP |
| `text_classificaction.html` | `/research/text-classification` | NLP |
| `lab2.html` | `/research/lab2-twitter` | Lab |
| `knn.html` | `/research/knn` | Clustering |
| `kmeans.html` | `/research/kmeans` | Clustering |
| `hac.html` | `/research/hac` | Clustering |
| `altair.html` | `/research/altair` | Visualización |

---

## Visualizaciones interactivas de ML

Las gráficas de Plotly y Altair/Vega deben seguir funcionando dentro del nuevo tema dark.

### `components/charts/PlotlyChart.tsx`
```tsx
'use client'
import dynamic from 'next/dynamic'
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false })

export function PlotlyChart({ data, layout }: PlotlyChartProps) {
  return (
    <Plot
      data={data}
      layout={{
        paper_bgcolor: '#0a0c10',
        plot_bgcolor: '#0a0c10',
        font: { color: '#c9d1d9', family: 'JetBrains Mono' },
        gridcolor: '#1e2430',
        ...layout
      }}
    />
  )
}
```

### `components/charts/VegaChart.tsx`
```tsx
'use client'
import dynamic from 'next/dynamic'
const VegaLite = dynamic(() => import('react-vega').then(m => m.VegaLite), { ssr: false })

export function VegaChart({ spec }: { spec: object }) {
  return <VegaLite spec={spec} theme="dark" />
}
```

### Uso en archivos MDX de /research:
```mdx
import { PlotlyChart } from '@/components/charts/PlotlyChart'

<PlotlyChart
  data={[{ x: [1,2,3], y: [10,20,15], type: 'bar', marker: { color: '#58a6ff' } }]}
  layout={{ title: { text: 'Distribución de clases', font: { color: '#c9d1d9' } } }}
/>
```

---

## Navegación unificada

```tsx
const navLinks = [
  { href: '/',            label: 'home',         accent: null },
  { href: '/writeups',    label: 'write-ups',    accent: 'green' },
  { href: '/research',    label: 'research',     accent: 'blue' },
  { href: '/blog',        label: 'blog',         accent: null },
  { href: '/methodology', label: 'metodología',  accent: 'purple' },
  { href: '/tools',       label: 'tools',        accent: null },
  { href: '/about',       label: 'about',        accent: null },
]
```

---

## Página /about — CV unificado

```
Alexander González
Ing. Sistemas · Master Ciberseguridad · AZ-900 · Quito, EC

CIBERSEGURIDAD              MACHINE LEARNING
──────────────              ────────────────
Pentesting ofensivo         scikit-learn / Python
Active Directory attacks    NLP y clasificación de texto
Metasploit / Burpsuite      EDA y visualización
OSINT / Reconocimiento      K-Means, HAC, KNN
Red Team / Blue Team        Pipelines y preprocesamiento

CERTIFICACIONES
────────────────
Master en Ciberseguridad
Microsoft AZ-900 Azure Fundamentals

GitHub · LinkedIn · GitLab · Email
```

---

## Scripts de migración

```bash
# Migrar blog Jekyll → /content/posts/
node scripts/migrate-jekyll.js --input ../alexandergrg.github.io/_posts

# Migrar s3c-593 → /content/writeups/
node scripts/migrate-s3c593.js --input ../alexandergrg.github.io/s3c-593

# Migrar site-ml → /content/research/
node scripts/migrate-siteml.js --input ../alexandergrg.github.io/site-ml
```

Cada script debe:
1. Leer los archivos fuente (Markdown o HTML de Quarto)
2. Convertir al frontmatter del nuevo formato
3. Limpiar liquid tags `{% %}`, `{{ }}` y artefactos de Quarto
4. Mantener bloques de código intactos
5. Detectar gráficas Plotly/Altair y marcar `hasCharts: true`
6. Guardar como `.mdx` en la carpeta correspondiente
7. Imprimir resumen de archivos migrados y errores

---

## Configuración Next.js para GitHub Pages

```js
// next.config.js
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: '',
  assetPrefix: '',
}
module.exports = nextConfig
```

---

## GitHub Actions — deploy automático

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
```

---

## Dependencias a instalar

```bash
npx create-next-app@latest sec593-blog \
  --typescript --tailwind --app --no-src-dir --import-alias "@/*"

cd sec593-blog

npm install @next/mdx @mdx-js/loader @mdx-js/react
npm install next-mdx-remote gray-matter reading-time
npm install shiki @tailwindcss/typography
npm install react-plotly.js plotly.js
npm install react-vega vega vega-lite
```

---

## Orden de construcción

1. `tailwind.config.ts` — tokens de diseño con los tres colores de acento
2. `app/layout.tsx` + `components/Nav.tsx` + `components/Footer.tsx`
3. `lib/mdx.ts` + `lib/getAllContent.ts`
4. Componentes: `PostCard`, `WriteupCard`, `ResearchCard`, `CodeBlock`, `TagBadge`, `DifficultyBadge`, `AreaLabel`
5. `components/charts/PlotlyChart.tsx` + `VegaChart.tsx`
6. `app/page.tsx` — home hub unificado
7. `app/writeups/` — sección ciberseguridad completa
8. `app/research/` — sección ML/IA con todas las subrutas
9. `app/blog/` — feed unificado filtrable por área y categoría
10. `app/methodology/` + `app/tools/` + `app/about/`
11. `app/sitemap.ts` + `app/robots.ts`
12. `next.config.js` + `.github/workflows/deploy.yml`
13. `scripts/migrate-jekyll.js`
14. `scripts/migrate-s3c593.js`
15. `scripts/migrate-siteml.js`

---

## Repositorio de destino

- **GitHub:** `https://github.com/alexandergrg/alexandergrg.github.io`
- **URL pública:** `https://alexandergrg.github.io`
- **Rama de deploy:** `gh-pages`
- **Rama de trabajo:** `main`

---

*Este archivo es la fuente de verdad del proyecto. Léelo completo antes de crear o modificar cualquier archivo.*
