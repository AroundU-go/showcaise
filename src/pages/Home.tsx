import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { AppCard } from "@/components/AppCard";
import { useToast } from "@/hooks/use-toast";
import { Footer } from "@/components/Footer";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AuthModal } from "@/components/AuthModal";

interface App {
  id: string;
  name: string;
  tagline: string;
  description: string;
  website_url: string;
  logo_url?: string;
  category: string;
  vote_count: number;
  created_at: string;
  pinned: boolean;
}

interface VoteResponse {
  success: boolean;
  message: string;
}

export default function Home() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [category, setCategory] = useState("All Categories");
  const [votingApps, setVotingApps] = useState<Set<string>>(new Set());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingVoteAppId, setPendingVoteAppId] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch apps
  useEffect(() => {
    fetchApps();
  }, []);

  const fetchApps = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("apps")
        .select("*")
        .eq("status", "approved");

      // Apply category filter
      if (category !== "All Categories") {
        query = query.eq("category", category);
      }

      // Apply search filter
      if (searchQuery.trim()) {
        query = query.or(`name.ilike.%${searchQuery}%,tagline.ilike.%${searchQuery}%`);
      }

      // Apply sorting - pinned apps always come first
      if (sortBy === "newest") {
        query = query.order("pinned", { ascending: false }).order("created_at", { ascending: false });
      } else if (sortBy === "most-voted") {
        query = query.order("pinned", { ascending: false }).order("vote_count", { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Reorder apps: bring second row (index 3-5) to top
      const reorderedApps = data || [];
      if (reorderedApps.length > 6) {
        const secondRow = reorderedApps.slice(3, 6);
        const firstRow = reorderedApps.slice(0, 3);
        const rest = reorderedApps.slice(6);
        setApps([...secondRow, ...firstRow, ...rest]);
      } else {
        setApps(reorderedApps);
      }
    } catch (error) {
      console.error("Error fetching apps:", error);
      toast({
        title: "Error",
        description: "Failed to load apps. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Refetch when filters change
  useEffect(() => {
    fetchApps();
  }, [searchQuery, sortBy, category]);

  const handleVote = async (appId: string) => {
    // Check if user is signed in
    if (!user) {
      setPendingVoteAppId(appId);
      setShowAuthModal(true);
      return;
    }

    if (votingApps.has(appId)) return;

    setVotingApps(prev => new Set(prev).add(appId));

    try {
      // Get user's IP address
      const ipResponse = await fetch("https://api.ipify.org?format=json");
      const { ip } = await ipResponse.json();

      // Use secure function to add vote
      const { data, error } = await supabase
        .rpc('add_vote_if_new', {
          app_uuid: appId,
          user_ip: ip
        });

      if (error) throw error;

      const voteResult = data as unknown as VoteResponse;

      if (voteResult.success) {
        // Update local state
        setApps(prev => 
          prev.map(app => 
            app.id === appId 
              ? { ...app, vote_count: app.vote_count + 1 }
              : app
          )
        );

        toast({
          title: "Vote added!",
          description: "Thanks for voting!",
        });
      } else {
        // Already voted
        toast({
          title: "Already voted",
          description: voteResult.message,
        });
      }
    } catch (error) {
      console.error("Error voting:", error);
      toast({
        title: "Error",
        description: "Failed to vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setVotingApps(prev => {
        const next = new Set(prev);
        next.delete(appId);
        return next;
      });
    }
  };

  const handleAuthSuccess = () => {
    if (pendingVoteAppId) {
      // Retry vote after successful auth
      handleVote(pendingVoteAppId);
      setPendingVoteAppId(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Showcaise - AI Apps Directory | Discover Best AI Tools & Latest AI Applications</title>
        <meta name="description" content="Discover the best AI tools and latest AI applications in Showcaise, the leading AI apps directory and marketplace. Find top AI tools, compare AI apps, and explore the latest innovations in artificial intelligence." />
        <meta name="keywords" content="ai apps directory, ai tools directory, latest ai tools, best ai tools, ai apps marketplace, showcaise, find ai apps, ai applications, artificial intelligence tools, top ai tools, ai app store, discover ai tools" />
        <meta property="og:title" content="Showcaise - AI Apps Directory | Discover Best AI Tools" />
        <meta property="og:description" content="Find and discover the best AI tools and latest AI applications. Showcaise is your go-to AI apps directory and marketplace." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://showcaise.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Showcaise - AI Apps Directory | Discover Best AI Tools" />
        <meta name="twitter:description" content="Find and discover the best AI tools and latest AI applications in one place." />
        <link rel="canonical" href="https://www.showcaise.online/" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative text-center mb-16 py-24 rounded-3xl overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-background">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10" />
          <div className="relative z-10 max-w-4xl mx-auto px-4">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Ai Apps Directory
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              🔍 Find and ⚡ Discover amazing apps in your niche
              <br />
              — get 100's of new discoveries while you sleep
            </p>
            {/* Sign in and Submit buttons for small devices only when not logged in */}
            {!user && (
              <div className="md:hidden flex flex-col sm:flex-row gap-3 justify-center items-center mt-8">
                <Link to="/auth">
                  <Button variant="outline" className="px-6 py-2 w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
                <Link to="/submit">
                  <Button className="bg-gradient-primary hover:shadow-glow transition-all px-6 py-2 w-full sm:w-auto">
                    Submit App
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            category={category}
            onCategoryChange={setCategory}
          />
        </div>

        {/* Apps Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : apps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No apps found. {searchQuery ? "Try a different search." : "Be the first to submit an app!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {apps.map((app, index) => (
              <AppCard
                key={app.id}
                app={app}
                onVote={handleVote}
                isVoting={votingApps.has(app.id)}
                isFeatured={false}
              />
            ))}
          </div>
        )}
      </main>
      
        <Footer />
      </div>

      <AuthModal 
        open={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}
