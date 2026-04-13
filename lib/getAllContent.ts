import { getAllPosts }    from './mdx'
import { getAllWriteups } from './mdx'
import { getAllResearch } from './mdx'
import type { ContentItem } from './types'

export function getAllContent(): ContentItem[] {
  const posts    = getAllPosts().map((p)    => ({ ...p, type: 'post'     as const }))
  const writeups = getAllWriteups().map((w) => ({ ...w, type: 'writeup'  as const }))
  const research = getAllResearch().map((r) => ({ ...r, type: 'research' as const }))

  return [...posts, ...writeups, ...research].sort(
    (a, b) =>
      new Date(b.frontmatter.date).getTime() -
      new Date(a.frontmatter.date).getTime()
  )
}
