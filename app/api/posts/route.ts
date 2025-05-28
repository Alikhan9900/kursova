import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createPostSchema } from "@/lib/validations/post"
import { generateSlug, ensureUniqueSlug } from "@/lib/utils/slug"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search")
    const tag = searchParams.get("tag")
    const published = searchParams.get("published")

    const skip = (page - 1) * limit

    const where = {
      ...(published !== null && { published: published === "true" }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { content: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      ...(tag && {
        tags: {
          some: {
            tag: {
              slug: tag,
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

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Posts fetch error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, excerpt, published, featured, tags } = createPostSchema.parse(body)

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
        excerpt,
        published: published || false,
        featured: featured || false,
        authorId: session.user.id,
        ...(tags &&
          tags.length > 0 && {
            tags: {
              create: tags.map((tagName) => ({
                tag: {
                  connectOrCreate: {
                    where: { name: tagName },
                    create: {
                      name: tagName,
                      slug: generateSlug(tagName),
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
