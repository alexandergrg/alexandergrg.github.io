import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import type {
  PostItem,
  WriteupItem,
  ResearchItem,
  PostFrontmatter,
  WriteupFrontmatter,
  ResearchFrontmatter,
} from './types'

const contentDir = path.join(process.cwd(), 'content')

function getSlugs(section: 'posts' | 'writeups' | 'research'): string[] {
  const dir = path.join(contentDir, section)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .map((f) => f.replace(/\.mdx?$/, ''))
}

function readFile(section: 'posts' | 'writeups' | 'research', slug: string) {
  const mdxPath = path.join(contentDir, section, `${slug}.mdx`)
  const mdPath  = path.join(contentDir, section, `${slug}.md`)
  const filePath = fs.existsSync(mdxPath) ? mdxPath : mdPath
  return fs.readFileSync(filePath, 'utf-8')
}

// ──────────────────────────────────────────────────────────
// Posts
// ──────────────────────────────────────────────────────────

export function getAllPosts(): PostItem[] {
  return getSlugs('posts')
    .map((slug) => {
      const raw = readFile('posts', slug)
      const { data, content } = matter(raw)
      return {
        slug,
        readingTime: readingTime(content).text,
        frontmatter: data as PostFrontmatter,
      }
    })
    .sort((a, b) =>
      new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    )
}

export function getPostBySlug(slug: string) {
  const raw = readFile('posts', slug)
  const { data, content } = matter(raw)
  return {
    slug,
    readingTime: readingTime(content).text,
    frontmatter: data as PostFrontmatter,
    content,
  }
}

// ──────────────────────────────────────────────────────────
// Write-ups
// ──────────────────────────────────────────────────────────

export function getAllWriteups(): WriteupItem[] {
  return getSlugs('writeups')
    .map((slug) => {
      const raw = readFile('writeups', slug)
      const { data, content } = matter(raw)
      return {
        slug,
        readingTime: readingTime(content).text,
        frontmatter: data as WriteupFrontmatter,
      }
    })
    .sort((a, b) =>
      new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    )
}

export function getWriteupBySlug(slug: string) {
  const raw = readFile('writeups', slug)
  const { data, content } = matter(raw)
  return {
    slug,
    readingTime: readingTime(content).text,
    frontmatter: data as WriteupFrontmatter,
    content,
  }
}

// ──────────────────────────────────────────────────────────
// Research
// ──────────────────────────────────────────────────────────

export function getAllResearch(): ResearchItem[] {
  return getSlugs('research')
    .map((slug) => {
      const raw = readFile('research', slug)
      const { data, content } = matter(raw)
      return {
        slug,
        readingTime: readingTime(content).text,
        frontmatter: data as ResearchFrontmatter,
      }
    })
    .sort((a, b) =>
      new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
    )
}

export function getResearchBySlug(slug: string) {
  const raw = readFile('research', slug)
  const { data, content } = matter(raw)
  return {
    slug,
    readingTime: readingTime(content).text,
    frontmatter: data as ResearchFrontmatter,
    content,
  }
}
