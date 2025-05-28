import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CommentSection } from "@/components/blog/comment-section"
import { prisma } from "@/lib/prisma"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { ArrowLeft, Calendar, MessageCircle } from "lucide-react"

interface PostPageProps {
  params: {
    slug: string
  }
}

async function getPost(slug: string) {
  return await prisma.post.findUnique({
    where: {
      slug,
      published: true,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
  })
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPost(params.slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: post.title,
    description: post.excerpt || post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      authors: [post.author.name || ""],
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="container max-w-4xl py-8">
      <div className="space-y-8">
        {/* Back Button */}
        <Button variant="ghost" asChild>
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>

        {/* Post Header */}
        <header className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {post.tags.map(({ tag }) => (
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
            <h1 className="text-4xl font-bold leading-tight lg:text-5xl">{post.title}</h1>
            {post.excerpt && <p className="text-xl text-muted-foreground">{post.excerpt}</p>}
          </div>

          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={post.author.image || ""} alt={post.author.name || ""} />
              <AvatarFallback>{post.author.name?.charAt(0) || post.author.email?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="font-medium">{post.author.name}</p>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>{post._count.comments} comments</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <Separator />

        {/* Post Content */}
        <div className="prose prose-gray max-w-none dark:prose-invert">
          {post.content.split("\n").map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>

        <Separator />

        {/* Comments Section */}
        <CommentSection postId={post.id} comments={post.comments} />
      </div>
    </article>
  )
}
