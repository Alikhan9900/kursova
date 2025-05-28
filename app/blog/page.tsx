import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { prisma } from "@/lib/prisma"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { ArrowRight, Calendar, User, Search } from "lucide-react"

// Force dynamic rendering
export const dynamic = "force-dynamic"

interface BlogPageProps {
  searchParams: {
    search?: string
    tag?: string
    page?: string
  }
}

async function getPosts(searchParams: BlogPageProps["searchParams"]) {
  try {
    const page = Number.parseInt(searchParams.page || "1")
    const limit = 12
    const skip = (page - 1) * limit

    const where = {
      published: true,
      ...(searchParams.search && {
        OR: [
          { title: { contains: searchParams.search, mode: "insensitive" as const } },
          { content: { contains: searchParams.search, mode: "insensitive" as const } },
        ],
      }),
      ...(searchParams.tag && {
        tags: {
          some: {
            tag: {
              slug: searchParams.tag,
            },
          },
        },
      }),
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
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
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ])

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  } catch (error) {
    console.error("Error fetching posts:", error)
    return {
      posts: [],
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        pages: 0,
      },
    }
  }
}

async function getTags() {
  try {
    return await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })
  } catch (error) {
    console.error("Error fetching tags:", error)
    return []
  }
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const [{ posts, pagination }, tags] = await Promise.all([getPosts(searchParams), getTags()])

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Blog</h1>
          <p className="text-xl text-muted-foreground">Discover articles, tutorials, and insights from our community</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search posts..." className="pl-10" defaultValue={searchParams.search} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant={!searchParams.tag ? "default" : "outline"} size="sm" asChild>
              <Link href="/blog">All</Link>
            </Button>
            {tags.map((tag) => (
              <Button key={tag.id} variant={searchParams.tag === tag.slug ? "default" : "outline"} size="sm" asChild>
                <Link href={`/blog?tag=${tag.slug}`}>
                  {tag.name} ({tag._count.posts})
                </Link>
              </Button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <Suspense fallback={<div>Loading posts...</div>}>
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold">No posts found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <Card key={post.id} className="flex flex-col">
                  <CardHeader>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {post.tags.slice(0, 2).map(({ tag }) => (
                          <Badge
                            key={tag.id}
                            variant="secondary"
                            style={{
                              backgroundColor: tag.color + "20",
                              color: tag.color,
                            }}
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
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{post.author.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
                      </div>
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
          )}
        </Suspense>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center space-x-2">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <Button key={page} variant={page === pagination.page ? "default" : "outline"} size="sm" asChild>
                <Link
                  href={{
                    pathname: "/blog",
                    query: { ...searchParams, page: page.toString() },
                  }}
                >
                  {page}
                </Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
