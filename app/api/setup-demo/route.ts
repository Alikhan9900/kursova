import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST() {
  try {
    console.log("Starting demo setup...")

    // Спочатку перевіримо підключення до бази даних
    await prisma.$connect()
    console.log("Database connected successfully")

    // Спробуємо створити таблиці якщо їх немає
    try {
      await prisma.$executeRaw`SELECT 1 FROM "User" LIMIT 1`
    } catch (error) {
      console.log("Tables don't exist, they should be created by Prisma migrations")
      return NextResponse.json(
        {
          error: "Database tables not found",
          message: "Please run database migrations first",
          solution: "The database schema needs to be applied. This should happen automatically on Vercel.",
        },
        { status: 500 },
      )
    }

    // Перевіряємо чи вже існують демо користувачі
    const existingAdmin = await prisma.user.findFirst({
      where: {
        OR: [{ email: "admin@demo.com" }, { email: "admin@autoblog.com" }],
      },
    })

    if (existingAdmin) {
      console.log("Demo users already exist")
      return NextResponse.json({
        message: "Demo users already exist",
        users: [
          { email: "admin@demo.com", password: "demo123", role: "ADMIN" },
          { email: "user@demo.com", password: "demo123", role: "USER" },
        ],
      })
    }

    // Створюємо демо користувачів
    console.log("Creating demo users...")
    const adminPassword = await bcrypt.hash("demo123", 12)
    const userPassword = await bcrypt.hash("demo123", 12)

    const admin = await prisma.user.create({
      data: {
        email: "admin@demo.com",
        name: "Demo Admin",
        password: adminPassword,
        role: "ADMIN",
      },
    })

    const user = await prisma.user.create({
      data: {
        email: "user@demo.com",
        name: "Demo User",
        password: userPassword,
        role: "USER",
      },
    })

    console.log("Demo users created:", { admin: admin.email, user: user.email })

    // Створюємо теги
    console.log("Creating tags...")
    const techTag = await prisma.tag.create({
      data: {
        name: "Technology",
        slug: "technology",
        color: "#3B82F6",
      },
    })

    const webDevTag = await prisma.tag.create({
      data: {
        name: "Web Development",
        slug: "web-development",
        color: "#10B981",
      },
    })

    const nextjsTag = await prisma.tag.create({
      data: {
        name: "Next.js",
        slug: "nextjs",
        color: "#000000",
      },
    })

    console.log("Tags created")

    // Створюємо демо пост
    console.log("Creating demo post...")
    const post = await prisma.post.create({
      data: {
        title: "Welcome to Auto-blog Demo",
        slug: "welcome-to-auto-blog-demo",
        content: `# Welcome to Auto-blog!

This is a demo post to showcase the Auto-blog platform features.

## Features

- ✅ User authentication with NextAuth.js
- ✅ Admin panel for content management
- ✅ Blog posts with tags and comments
- ✅ Responsive design with Tailwind CSS
- ✅ PostgreSQL database with Prisma ORM

## Demo Accounts

**Admin Account:**
- Email: admin@demo.com
- Password: demo123

**User Account:**
- Email: user@demo.com  
- Password: demo123

## Getting Started

1. Sign in with one of the demo accounts
2. Explore the blog posts
3. Try the admin panel (admin account only)
4. Leave comments on posts

Enjoy exploring Auto-blog!`,
        excerpt:
          "Welcome to the Auto-blog demo! This post showcases the platform features and provides demo account information.",
        published: true,
        featured: true,
        authorId: admin.id,
      },
    })

    // Додаємо теги до поста
    await prisma.postTag.createMany({
      data: [
        { postId: post.id, tagId: techTag.id },
        { postId: post.id, tagId: webDevTag.id },
        { postId: post.id, tagId: nextjsTag.id },
      ],
    })

    // Створюємо демо коментар
    await prisma.comment.create({
      data: {
        content: "Great demo! The platform looks amazing and works perfectly.",
        postId: post.id,
        userId: user.id,
      },
    })

    console.log("Demo post and comment created")
    console.log("Demo setup completed successfully")

    return NextResponse.json({
      message: "Demo setup completed successfully",
      users: [
        { email: "admin@demo.com", password: "demo123", role: "ADMIN" },
        { email: "user@demo.com", password: "demo123", role: "USER" },
      ],
    })
  } catch (error) {
    console.error("Demo setup error:", error)

    return NextResponse.json(
      {
        error: "Failed to setup demo",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function GET() {
  try {
    await prisma.$connect()

    // Перевіряємо чи існують таблиці
    try {
      await prisma.$executeRaw`SELECT 1 FROM "User" LIMIT 1`
    } catch (error) {
      return NextResponse.json({
        databaseConnected: true,
        tablesExist: false,
        demoExists: false,
        error: "Database tables not found. Please run migrations.",
      })
    }

    const adminExists = await prisma.user.findFirst({
      where: {
        OR: [{ email: "admin@demo.com" }, { email: "admin@autoblog.com" }],
      },
    })

    return NextResponse.json({
      databaseConnected: true,
      tablesExist: true,
      demoExists: !!adminExists,
      credentials: adminExists
        ? [
            { email: "admin@demo.com", password: "demo123", role: "ADMIN" },
            { email: "user@demo.com", password: "demo123", role: "USER" },
          ]
        : null,
    })
  } catch (error) {
    console.error("Database check error:", error)
    return NextResponse.json(
      {
        databaseConnected: false,
        tablesExist: false,
        demoExists: false,
        error: error instanceof Error ? error.message : "Database connection failed",
      },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}
