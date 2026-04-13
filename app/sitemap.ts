import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

import { getAllPosts }    from '@/lib/mdx'
import { getAllWriteups } from '@/lib/mdx'
import { getAllResearch } from '@/lib/mdx'

const BASE_URL = 'https://alexandergrg.github.io'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts    = getAllPosts()
  const writeups = getAllWriteups()
  const research = getAllResearch()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,               lastModified: new Date(), priority: 1.0    },
    { url: `${BASE_URL}/blog`,     lastModified: new Date(), priority: 0.8    },
    { url: `${BASE_URL}/writeups`, lastModified: new Date(), priority: 0.9    },
    { url: `${BASE_URL}/research`, lastModified: new Date(), priority: 0.9    },
    { url: `${BASE_URL}/methodology`, lastModified: new Date(), priority: 0.7 },
    { url: `${BASE_URL}/tools`,    lastModified: new Date(), priority: 0.6    },
    { url: `${BASE_URL}/about`,    lastModified: new Date(), priority: 0.5    },
  ]

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url:          `${BASE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.frontmatter.date),
    priority:     0.7,
  }))

  const writeupRoutes: MetadataRoute.Sitemap = writeups.map((w) => ({
    url:          `${BASE_URL}/writeups/${w.slug}`,
    lastModified: new Date(w.frontmatter.date),
    priority:     0.8,
  }))

  const researchRoutes: MetadataRoute.Sitemap = research.map((r) => ({
    url:          `${BASE_URL}/research/${r.slug}`,
    lastModified: new Date(r.frontmatter.date),
    priority:     0.8,
  }))

  return [...staticRoutes, ...postRoutes, ...writeupRoutes, ...researchRoutes]
}
