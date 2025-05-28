import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Github, Globe, Mail, Heart, Code, Users, Zap } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container py-8">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">About Auto-blog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A modern, full-featured blog platform built with cutting-edge technologies to provide the best writing and
            reading experience.
          </p>
        </div>

        {/* Features */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <Code className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Modern Stack</CardTitle>
              <CardDescription>Built with Next.js 14, TypeScript, and the latest web technologies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Next.js 14</Badge>
                <Badge variant="secondary">TypeScript</Badge>
                <Badge variant="secondary">Tailwind CSS</Badge>
                <Badge variant="secondary">Prisma</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>User-Friendly</CardTitle>
              <CardDescription>Intuitive interface for both readers and content creators</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1">
                <li>• Clean, responsive design</li>
                <li>• Dark mode support</li>
                <li>• Mobile-first approach</li>
                <li>• Accessibility focused</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>High Performance</CardTitle>
              <CardDescription>Optimized for speed and excellent Core Web Vitals</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1">
                <li>• Server-side rendering</li>
                <li>• Image optimization</li>
                <li>• Efficient caching</li>
                <li>• Fast page loads</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Technology Stack */}
        <Card>
          <CardHeader>
            <CardTitle>Technology Stack</CardTitle>
            <CardDescription>The powerful technologies that make Auto-blog possible</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-3">Frontend</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Next.js 14</span>
                    <Badge>React Framework</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>TypeScript</span>
                    <Badge>Type Safety</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tailwind CSS</span>
                    <Badge>Styling</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>shadcn/ui</span>
                    <Badge>Components</Badge>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Backend</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>PostgreSQL</span>
                    <Badge>Database</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Prisma</span>
                    <Badge>ORM</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>NextAuth.js</span>
                    <Badge>Authentication</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Vercel</span>
                    <Badge>Deployment</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mission */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Auto-blog was created to provide a modern, efficient, and enjoyable blogging experience. We believe that
              sharing knowledge and ideas should be simple, beautiful, and accessible to everyone. Our platform combines
              the latest web technologies with thoughtful design to create a space where writers can focus on what they
              do best - creating amazing content.
            </p>
          </CardContent>
        </Card>

        {/* Features List */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Features</CardTitle>
            <CardDescription>Everything you need for a successful blog</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-semibold">For Writers</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Rich text editor</li>
                  <li>• Draft and publish workflow</li>
                  <li>• Tag management</li>
                  <li>• Comment moderation</li>
                  <li>• Analytics dashboard</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">For Readers</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Fast, responsive reading</li>
                  <li>• Search and filtering</li>
                  <li>• Comment system</li>
                  <li>• Dark mode support</li>
                  <li>• Mobile optimization</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">Ready to Start Blogging?</h3>
              <p className="text-muted-foreground">
                Join our community of writers and readers. Create your account and start sharing your ideas today.
              </p>
              <div className="flex justify-center space-x-4">
                <Button asChild>
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/blog">Explore Posts</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
            <CardDescription>Have questions or feedback? We'd love to hear from you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" size="sm" disabled>
                <Mail className="mr-2 h-4 w-4" />
                Contact Us
              </Button>
              <Button variant="outline" size="sm" disabled>
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
              <Button variant="outline" size="sm" disabled>
                <Globe className="mr-2 h-4 w-4" />
                Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
