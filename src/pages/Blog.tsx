import { Helmet } from "react-helmet";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Blog = () => {
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
              <article className="bg-card rounded-lg p-8 shadow-sm border mb-8">
                <h2 className="text-2xl font-bold mb-4">Welcome to Showcaise Blog</h2>
                <p className="text-muted-foreground mb-4">
                  Welcome to the Showcaise AI Apps Directory blog. Here you'll find articles about the latest AI tools, 
                  application trends, and insights into the rapidly evolving world of artificial intelligence.
                </p>
                <p className="text-muted-foreground">
                  Stay tuned for regular updates as we explore the best AI apps and tools available in our directory.
                </p>
              </article>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Blog;
