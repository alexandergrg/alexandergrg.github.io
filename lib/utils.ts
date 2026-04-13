export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-EC', {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  })
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export const difficultyColor: Record<string, string> = {
  easy:   '#22d3ee',
  medium: '#fb923c',
  hard:   '#f87171',
}

export const platformColor: Record<string, string> = {
  HackTheBox: '#22d3ee',
  TryHackMe:  '#f87171',
}

export const categoryLabel: Record<string, string> = {
  eda:            'EDA',
  classification: 'Clasificación',
  nlp:            'NLP',
  clustering:     'Clustering',
  regression:     'Regresión',
  lab:            'Lab',
  viz:            'Visualización',
  technique:      'Técnica',
  tool:           'Herramienta',
  osint:          'OSINT',
  defense:        'Defensa',
  writeup:        'Write-up',
}
