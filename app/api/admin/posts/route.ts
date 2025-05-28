import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateSlug, ensureUniqueSlug } from "@/lib/utils/slug"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const posts = await prisma.post.findMany({
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
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Admin posts fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, excerpt, published, featured, tags } = body

    if (!title || !content) {
      return NextResponse.json({ message: "Title and content are required" }, { status: 400 })
    }

    // Generate unique slug
    const baseSlug = generateSlug(title)
    const existingSlugs = await prisma.post
      .findMany({
        select: { slug: true },
      })
      .then((posts) => posts.map((p) => p.slug))
    const slug = ensureUniqueSlug(baseSlug, existingSlugs)

    // Create post
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        published: published || false,
        featured: featured || false,
        authorId: session.user.id,
        ...(tags &&
          tags.length > 0 && {
            tags: {
              create: tags.map((tagName: string) => ({
                tag: {
                  connectOrCreate: {
                    where: { name: tagName },
                    create: {
                      name: tagName,
                      slug: generateSlug(tagName),
                      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                    },
                  },
                },
              })),
            },
          }),
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
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error("Post creation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
