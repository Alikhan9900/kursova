# Auto-blog - Local Development

A modern, full-featured blog platform built with Next.js, Prisma, SQLite, and NextAuth.js for local development.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and install:**
\`\`\`bash
git clone <your-repo>
cd auto-blog
npm install
\`\`\`

2. **Set up the database:**
\`\`\`bash
# Generate Prisma client
npm run db:generate

# Create and migrate database
npm run db:migrate

# Seed with demo data
npm run db:seed
\`\`\`

3. **Start development server:**
\`\`\`bash
npm run dev
\`\`\`

4. **Open your browser:**
Visit [http://localhost:3000](http://localhost:3000)

## 🔑 Demo Accounts

After seeding, you can use these accounts:

- **Admin**: admin@autoblog.com / admin123
- **User**: user@autoblog.com / user123

## 📁 Project Structure

\`\`\`
auto-blog/
├── app/                    # Next.js App Router pages
├── components/             # Reusable React components
├── lib/                    # Utility functions and configurations
├── prisma/                 # Database schema and SQLite database
│   ├── schema.prisma       # Database schema
│   ├── dev.db             # SQLite database file
│   └── seed.ts            # Database seeding script
├── public/                 # Static assets
└── types/                  # TypeScript type definitions
\`\`\`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with demo data
- `npm run db:reset` - Reset database and reseed

## 🗄️ Database

This project uses SQLite for local development:

- **Database file**: `prisma/dev.db`
- **Schema**: `prisma/schema.prisma`
- **ORM**: Prisma

### Database Management

\`\`\`bash
# View database in Prisma Studio
npm run db:studio

# Reset database (careful - deletes all data!)
npm run db:reset

# Apply schema changes
npm run db:push
\`\`\`

## ✨ Features

### ✅ Working Features
- User authentication (email/password)
- Admin and user roles
- Blog post creation and editing
- Post management (publish/unpublish, featured)
- Tag system for categorization
- Comment system
- Responsive design with dark mode
- Search and filtering
- Admin dashboard
- User dashboard

### 🚧 Coming Soon
- Rich text editor
- Image upload
- Email notifications
- Advanced analytics

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env.local` and update:

\`\`\`env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
\`\`\`

### Google OAuth (Optional)

To enable Google OAuth, add:

\`\`\`env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
\`\`\`

## 🐛 Troubleshooting

### Database Issues

\`\`\`bash
# If database is corrupted or has issues
npm run db:reset

# If Prisma client is out of sync
npm run db:generate
\`\`\`

### Port Issues

If port 3000 is busy:

\`\`\`bash
npm run dev -- -p 3001
\`\`\`

### Clear Next.js Cache

\`\`\`bash
rm -rf .next
npm run dev
\`\`\`

## 📝 Development Notes

- SQLite database is stored in `prisma/dev.db`
- Demo data is automatically created when seeding
- All features work offline
- No external dependencies required for basic functionality

## 🚀 Deployment

For production deployment, consider:

1. **Vercel** (recommended for Next.js)
2. **Railway** (supports SQLite)
3. **Fly.io** (supports SQLite)

Remember to:
- Set production environment variables
- Run database migrations
- Seed production data if needed

## 📄 License

MIT License - see LICENSE file for details.
