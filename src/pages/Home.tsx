import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { AppCard } from "@/components/AppCard";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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
}

export default function Home() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [category, setCategory] = useState("All Categories");
  const [votingApps, setVotingApps] = useState<Set<string>>(new Set());
  const { toast } = useToast();

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

      // Apply sorting
      if (sortBy === "newest") {
        query = query.order("created_at", { ascending: false });
      } else if (sortBy === "most-voted") {
        query = query.order("vote_count", { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      setApps(data || []);
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
    if (votingApps.has(appId)) return;

    setVotingApps(prev => new Set(prev).add(appId));

    try {
      // Get user's IP address (simplified - in production you'd want a more robust solution)
      const ipResponse = await fetch("https://api.ipify.org?format=json");
      const { ip } = await ipResponse.json();

      // Check if user already voted
      const { data: existingVote } = await supabase
        .from("votes")
        .select("id")
        .eq("app_id", appId)
        .eq("ip_address", ip)
        .single();

      if (existingVote) {
        toast({
          title: "Already voted",
          description: "You've already voted for this app!",
        });
        return;
      }

      // Add vote
      const { error } = await supabase
        .from("votes")
        .insert({ app_id: appId, ip_address: ip });

      if (error) throw error;

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

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative text-center mb-12 py-20 rounded-2xl overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{ backgroundImage: "url('/src/assets/hero-bg.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-hero opacity-10" />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Discover Amazing{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                AI Apps
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The best place to discover and share AI-powered applications.
              Vote for your favorites and help others find great tools.
            </p>
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
            {apps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                onVote={handleVote}
                isVoting={votingApps.has(app.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}