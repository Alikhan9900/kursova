import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seed...")

  // Clear existing data
  await prisma.comment.deleteMany()
  await prisma.postTag.deleteMany()
  await prisma.post.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()

  console.log("🗑️ Cleared existing data")

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12)
  const admin = await prisma.user.create({
    data: {
      email: "admin@autoblog.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  })
  console.log("👑 Created admin user:", admin.email)

  // Create regular user
  const userPassword = await bcrypt.hash("user123", 12)
  const user = await prisma.user.create({
    data: {
      email: "user@autoblog.com",
      name: "Regular User",
      password: userPassword,
      role: "USER",
    },
  })
  console.log("👤 Created regular user:", user.email)

  // Create tags
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

  const reactTag = await prisma.tag.create({
    data: {
      name: "React",
      slug: "react",
      color: "#61DAFB",
    },
  })

  const jsTag = await prisma.tag.create({
    data: {
      name: "JavaScript",
      slug: "javascript",
      color: "#F7DF1E",
    },
  })

  console.log("🏷️ Created tags")

  // Create sample posts
  const post1 = await prisma.post.create({
    data: {
      title: "Getting Started with Next.js 14",
      slug: "getting-started-with-nextjs-14",
      content: `Next.js 14 brings exciting new features and improvements that make building React applications even better. In this comprehensive guide, we'll explore the key features and how to get started.

## What's New in Next.js 14

Next.js 14 introduces several groundbreaking features:

### App Router Stability
The App Router is now stable and ready for production use. It provides a more intuitive way to structure your application with improved performance and developer experience.

### Server Actions
Server Actions allow you to run server-side code directly from your components, making it easier to handle form submissions and data mutations.

### Turbopack (Beta)
Turbopack, the Rust-based bundler, is now available in beta for local development, providing significantly faster build times.

## Getting Started

To create a new Next.js 14 project, run:

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

This will set up a new Next.js project with all the latest features enabled by default.

## Key Features to Explore

1. **File-based Routing**: Organize your pages using the file system
2. **API Routes**: Build your backend API alongside your frontend
3. **Static Site Generation**: Pre-render pages at build time for better performance
4. **Server-Side Rendering**: Render pages on the server for dynamic content

Next.js 14 continues to be the best framework for building production-ready React applications.`,
      excerpt:
        "Discover the exciting new features in Next.js 14 and learn how to get started with the latest version of this powerful React framework.",
      published: true,
      featured: true,
      authorId: admin.id,
    },
  })

  const post2 = await prisma.post.create({
    data: {
      title: "Building Modern UIs with React and Tailwind CSS",
      slug: "building-modern-uis-with-react-and-tailwind",
      content: `Creating beautiful, responsive user interfaces has never been easier with the combination of React and Tailwind CSS. This guide will show you how to build modern UIs efficiently.

## Why React + Tailwind CSS?

The combination of React and Tailwind CSS provides several advantages:

### Component-Based Architecture
React's component-based approach pairs perfectly with Tailwind's utility-first methodology, allowing you to build reusable UI components quickly.

### Rapid Prototyping
Tailwind's utility classes enable rapid prototyping and iteration, letting you style components directly in your JSX.

### Consistent Design System
Tailwind provides a consistent design system out of the box, ensuring your UI looks cohesive across your entire application.

## Best Practices

### 1. Create Reusable Components
Instead of repeating utility classes, create reusable components:

\`\`\`jsx
const Button = ({ children, variant = 'primary' }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors'
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300'
  }
  
  return (
    <button className={\`\${baseClasses} \${variants[variant]}\`}>
      {children}
    </button>
  )
}
\`\`\`

### 2. Use Responsive Design
Tailwind makes responsive design simple with its mobile-first approach:

\`\`\`jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Your content */}
</div>
\`\`\`

### 3. Leverage Dark Mode
Implement dark mode easily with Tailwind's dark mode utilities:

\`\`\`jsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  {/* Your content */}
</div>
\`\`\`

## Conclusion

React and Tailwind CSS together provide a powerful toolkit for building modern, responsive web applications. Start experimenting with this combination today!`,
      excerpt:
        "Learn how to create beautiful, responsive user interfaces using React and Tailwind CSS with practical examples and best practices.",
      published: true,
      featured: true,
      authorId: user.id,
    },
  })

  const post3 = await prisma.post.create({
    data: {
      title: "JavaScript ES2024: New Features You Should Know",
      slug: "javascript-es2024-new-features",
      content: `JavaScript continues to evolve with ES2024 bringing several exciting new features that will improve your development experience. Let's explore the most important additions.

## Array Grouping

One of the most anticipated features is the ability to group array elements:

\`\`\`javascript
const products = [
  { name: 'Laptop', category: 'Electronics' },
  { name: 'Shirt', category: 'Clothing' },
  { name: 'Phone', category: 'Electronics' },
  { name: 'Jeans', category: 'Clothing' }
]

const grouped = Object.groupBy(products, item => item.category)
// Result: { Electronics: [...], Clothing: [...] }
\`\`\`

## Promise.withResolvers()

A new static method that provides a more convenient way to create promises:

\`\`\`javascript
const { promise, resolve, reject } = Promise.withResolvers()

// Use resolve/reject from outside the promise
setTimeout(() => resolve('Done!'), 1000)
\`\`\`

## Temporal API (Stage 3)

The new Temporal API provides better date and time handling:

\`\`\`javascript
const now = Temporal.Now.plainDateTimeISO()
const birthday = Temporal.PlainDate.from('1990-05-15')
const age = now.toPlainDate().since(birthday).years
\`\`\`

## Regular Expression v Flag

Enhanced Unicode support in regular expressions:

\`\`\`javascript
const regex = /\\p{Script=Latin}/v
console.log(regex.test('Hello')) // true
\`\`\`

## Conclusion

These new features make JavaScript more powerful and developer-friendly. Start experimenting with them in your projects today!`,
      excerpt:
        "Explore the latest JavaScript ES2024 features including array grouping, Promise.withResolvers(), and the new Temporal API.",
      published: true,
      featured: false,
      authorId: admin.id,
    },
  })

  console.log("📝 Created sample posts")

  // Add tags to posts
  await prisma.postTag.createMany({
    data: [
      { postId: post1.id, tagId: nextjsTag.id },
      { postId: post1.id, tagId: webDevTag.id },
      { postId: post1.id, tagId: techTag.id },
      { postId: post2.id, tagId: reactTag.id },
      { postId: post2.id, tagId: webDevTag.id },
      { postId: post2.id, tagId: techTag.id },
      { postId: post3.id, tagId: jsTag.id },
      { postId: post3.id, tagId: techTag.id },
    ],
  })

  // Create sample comments
  await prisma.comment.create({
    data: {
      content:
        "Great article! Very helpful for getting started with Next.js 14. The examples are clear and easy to follow.",
      postId: post1.id,
      userId: user.id,
    },
  })

  await prisma.comment.create({
    data: {
      content:
        "Thanks for sharing this. The Tailwind CSS tips are really useful! I'll definitely try the component approach.",
      postId: post2.id,
      userId: admin.id,
    },
  })

  await prisma.comment.create({
    data: {
      content: "Excited about the new JavaScript features! The array grouping method will save so much time.",
      postId: post3.id,
      userId: user.id,
    },
  })

  await prisma.comment.create({
    data: {
      content: "The Temporal API looks amazing. Finally, proper date handling in JavaScript!",
      postId: post3.id,
      userId: admin.id,
    },
  })

  console.log("💬 Created sample comments")
  console.log("✅ Database seeded successfully!")

  console.log("\n🔑 Test accounts created:")
  console.log("Admin: admin@autoblog.com / admin123")
  console.log("User: user@autoblog.com / user123")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
