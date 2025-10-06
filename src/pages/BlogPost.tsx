import { Helmet } from "react-helmet-async";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  published_at: string;
  slug: string;
}

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  const getExcerpt = (content: string) => {
    return content.substring(0, 160);
  };

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Loading... | Showcaise AI Apps Directory Blog</title>
        </Helmet>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin" />
          </main>
          <Footer />
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Helmet>
          <title>Post Not Found | Showcaise AI Apps Directory Blog</title>
        </Helmet>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <div className="container mx-auto px-4 py-12">
              <Card>
                <CardContent className="p-8 text-center">
                  <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
                  <p className="text-muted-foreground mb-6">
                    The blog post you're looking for doesn't exist or has been removed.
                  </p>
                  <Button asChild>
                    <Link to="/blog">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Blog
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | Showcaise AI Apps Directory Blog</title>
        <meta name="description" content={getExcerpt(post.content)} />
        <meta name="keywords" content="ai apps directory, ai tools directory, latest ai tools, best ai tools, ai apps marketplace, showcaise, ai blog, artificial intelligence" />
        <meta property="og:title" content={`${post.title} | Showcaise`} />
        <meta property="og:description" content={getExcerpt(post.content)} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://showcaise.com/blog/${post.slug}`} />
        {post.image_url && <meta property="og:image" content={post.image_url} />}
        <meta property="article:published_time" content={post.published_at} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={getExcerpt(post.content)} />
        {post.image_url && <meta name="twitter:image" content={post.image_url} />}
        <link rel="canonical" href={`https://showcaise.com/blog/${post.slug}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "image": post.image_url || "",
            "datePublished": post.published_at,
            "description": getExcerpt(post.content),
            "author": {
              "@type": "Organization",
              "name": "Showcaise"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Showcaise",
              "logo": {
                "@type": "ImageObject",
                "url": "https://showcaise.com/logo.png"
              }
            }
          })}
        </script>
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow">
          <article className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <Button variant="ghost" asChild className="mb-6">
                <Link to="/blog">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Link>
              </Button>

              <Card>
                <CardContent className="p-8">
                  {post.image_url && (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                  )}
                  <header>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
                    <p className="text-sm text-muted-foreground mb-6">
                      Published on <time dateTime={post.published_at}>{new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                    </p>
                  </header>
                  <div className="prose prose-lg max-w-none">
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed">{post.content}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BlogPost;
