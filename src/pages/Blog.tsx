import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  published_at: string;
  slug: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Blog - AI Apps Directory | Showcaise - Find Best AI Tools</title>
        <meta name="description" content="Discover the latest insights about AI apps directory, AI tools directory, and find the best AI apps on Showcaise. Stay updated with AI technology trends." />
        <meta name="keywords" content="ai apps directory, ai tools directory, showcaise, find ai apps, ai applications, artificial intelligence tools, ai marketplace, best ai apps" />
        <meta property="og:title" content="Blog - AI Apps Directory | Showcaise" />
        <meta property="og:description" content="Discover the latest insights about AI apps directory and find the best AI tools on Showcaise." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://showcaise.com/blog" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow">
          <div className="container mx-auto px-4 py-12">
            <header className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
                AI Apps Directory Blog
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover the latest insights, trends, and updates from the world of AI applications and tools
              </p>
            </header>

            <section className="max-w-4xl mx-auto">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
              ) : posts.length === 0 ? (
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-4">Welcome to Showcaise Blog</h2>
                    <p className="text-muted-foreground mb-4">
                      Welcome to the Showcaise AI Apps Directory blog. Here you'll find articles about the latest AI tools, 
                      application trends, and insights into the rapidly evolving world of artificial intelligence.
                    </p>
                    <p className="text-muted-foreground">
                      Stay tuned for regular updates as we explore the best AI apps and tools available in our directory.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-8">
                  {posts.map((post) => (
                    <Card key={post.id}>
                      <CardContent className="p-8">
                        {post.image_url && (
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-64 object-cover rounded-lg mb-6"
                          />
                        )}
                        <h2 className="text-3xl font-bold mb-4">{post.title}</h2>
                        <p className="text-sm text-muted-foreground mb-4">
                          Published on {new Date(post.published_at).toLocaleDateString()}
                        </p>
                        <div className="prose prose-lg max-w-none">
                          <p className="text-muted-foreground whitespace-pre-wrap">{post.content}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Blog;
