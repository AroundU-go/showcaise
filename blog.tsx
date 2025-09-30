import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight } from "lucide-react";

export default function Blog() {
  // Sample blog posts data - in a real app, this would come from a CMS or API
  const blogPosts = [
    {
      id: 1,
      title: "The Future of AI Applications in 2024",
      excerpt: "Explore the latest trends and innovations shaping the AI application landscape this year.",
      author: "Sarah Chen",
      date: "2024-01-15",
      category: "AI Trends",
      readTime: "5 min read",
      featured: true
    },
    {
      id: 2,
      title: "Building Better User Experiences with AI",
      excerpt: "Learn how AI-powered features can enhance user engagement and satisfaction in your applications.",
      author: "Michael Rodriguez",
      date: "2024-01-10",
      category: "UX Design",
      readTime: "7 min read",
      featured: false
    },
    {
      id: 3,
      title: "Top 10 AI Tools Every Developer Should Know",
      excerpt: "A comprehensive guide to the most useful AI development tools and platforms available today.",
      author: "Emily Watson",
      date: "2024-01-05",
      category: "Development",
      readTime: "10 min read",
      featured: false
    },
    {
      id: 4,
      title: "The Ethics of AI in Modern Applications",
      excerpt: "Discussing the importance of ethical considerations when implementing AI features in products.",
      author: "David Park",
      date: "2024-01-01",
      category: "Ethics",
      readTime: "6 min read",
      featured: false
    }
  ];

  const categories = ["All", "AI Trends", "UX Design", "Development", "Ethics"];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Blog Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest insights, trends, and stories from the AI application world.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <Badge 
              key={category}
              variant={category === "All" ? "default" : "outline"}
              className="px-4 py-2 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Featured Post */}
        {blogPosts.find(post => post.featured) && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Featured Post</h2>
            <Card className="overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="p-0">
                <div className="md:flex">
                  <div className="md:w-1/2 p-8">
                    <Badge className="mb-4 bg-primary">Featured</Badge>
                    <CardTitle className="text-2xl mb-4 line-clamp-2">
                      {blogPosts.find(post => post.featured)?.title}
                    </CardTitle>
                    <CardDescription className="text-lg mb-6">
                      {blogPosts.find(post => post.featured)?.excerpt}
                    </CardDescription>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{blogPosts.find(post => post.featured)?.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{blogPosts.find(post => post.featured)?.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-primary hover:gap-3 transition-all cursor-pointer">
                      <span>Read more</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="md:w-1/2 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">📝</span>
                      </div>
                      <p className="text-muted-foreground">Featured Article</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.filter(post => !post.featured).map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-sm text-muted-foreground">{post.readTime}</span>
                </div>
                <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-primary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-4">Stay Updated</h3>
              <p className="text-muted-foreground mb-6">
                Get the latest blog posts and AI insights delivered to your inbox.
              </p>
              <div className="flex gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                  Subscribe
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
