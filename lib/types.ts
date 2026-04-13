export type Area = 'cyber' | 'ml'

export type PostCategory = 'technique' | 'tool' | 'osint' | 'defense' | 'writeup'
export type WriteupDifficulty = 'easy' | 'medium' | 'hard'
export type WriteupPlatform = 'HackTheBox' | 'TryHackMe'
export type WriteupOS = 'Windows' | 'Linux'
export type ResearchCategory =
  | 'eda'
  | 'classification'
  | 'nlp'
  | 'clustering'
  | 'regression'
  | 'lab'
  | 'viz'

// ──────────────────────────────────────────────────────────
// Frontmatter shapes
// ──────────────────────────────────────────────────────────

export interface PostFrontmatter {
  title:    string
  date:     string
  tags:     string[]
  category: PostCategory
  area:     Area
  excerpt:  string
}

export interface WriteupFrontmatter {
  title:      string
  date:       string
  tags:       string[]
  category:   'writeup'
  area:       'cyber'
  platform:   WriteupPlatform
  difficulty: WriteupDifficulty
  os:         WriteupOS
  excerpt:    string
}

export interface ResearchFrontmatter {
  title:       string
  date:        string
  tags:        string[]
  category:    ResearchCategory
  area:        'ml'
  dataset?:    string
  tools:       string[]
  excerpt:     string
  hasNotebook: boolean
  hasCharts:   boolean
}

// ──────────────────────────────────────────────────────────
// Content item (frontmatter + slug + readingTime)
// ──────────────────────────────────────────────────────────

export interface PostItem {
  slug:        string
  readingTime: string
  frontmatter: PostFrontmatter
}

export interface WriteupItem {
  slug:        string
  readingTime: string
  frontmatter: WriteupFrontmatter
}

export interface ResearchItem {
  slug:        string
  readingTime: string
  frontmatter: ResearchFrontmatter
}

// Union for /blog feed
export type ContentItem =
  | (PostItem    & { type: 'post' })
  | (WriteupItem & { type: 'writeup' })
  | (ResearchItem & { type: 'research' })
