import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"
import { formatDistanceToNow } from "date-fns"
import { ArrowRight, Calendar, User } from "lucide-react"

// Force dynamic rendering
export const dynamic = "force-dynamic"

async function getFeaturedPosts() {
  try {
    return await prisma.post.findMany({
      where: {
        published: true,
        featured: true,
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
    })
  } catch (error) {
    console.error("Error fetching featured posts:", error)
    return []
  }
}

async function getRecentPosts() {
  try {
    return await prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    })
  } catch (error) {
    console.error("Error fetching recent posts:", error)
    return []
  }
}

export default async function HomePage() {
  const [featuredPosts, recentPosts] = await Promise.all([getFeaturedPosts(), getRecentPosts()])

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">Welcome to Auto-blog</h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            A modern, full-featured blog platform built with Next.js, Prisma, and PostgreSQL. Share your thoughts,
            connect with readers, and build your audience.
          </p>
          <div className="space-x-4">
            <Button size="lg" asChild>
              <Link href="/blog">
                Explore Posts
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="container space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">Featured Posts</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Discover our most popular and trending articles
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            {featuredPosts.map((post) => (
              <Card key={post.id} className="flex flex-col">
                <CardHeader>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 2).map(({ tag }) => (
                        <Badge
                          key={tag.id}
                          variant="secondary"
                          style={{ backgroundColor: tag.color + "20", color: tag.color }}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.excerpt || post.content.substring(0, 150) + "..."}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{post.author.name}</span>
                    <Calendar className="h-4 w-4" />
                    <span>{formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
                  </div>
                  <Button variant="ghost" className="mt-4 w-full" asChild>
                    <Link href={`/blog/${post.slug}`}>
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Recent Posts */}
      <section className="container space-y-6 py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">Latest Posts</h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Stay up to date with our newest articles and insights
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          {recentPosts.map((post) => (
            <Card key={post.id} className="flex flex-col">
              <CardHeader>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 2).map(({ tag }) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        style={{ backgroundColor: tag.color + "20", color: tag.color }}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.excerpt || post.content.substring(0, 150) + "..."}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-between">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{post.author.name}</span>
                  <Calendar className="h-4 w-4" />
                  <span>{formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
                </div>
                <Button variant="ghost" className="mt-4 w-full" asChild>
                  <Link href={`/blog/${post.slug}`}>
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-center">
          <Button variant="outline" asChild>
            <Link href="/blog">View All Posts</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
