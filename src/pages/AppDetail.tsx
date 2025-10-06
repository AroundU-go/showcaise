import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { VoteButton } from "@/components/VoteButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ExternalLink, Globe, Loader2, Share2 } from "lucide-react";

interface App {
  id: string;
  name: string;
  tagline: string;
  description: string;
  website_url: string;
  logo_url?: string;
  screenshot_urls?: string[];
  category: string;
  vote_count: number;
  created_at: string;
}

export default function AppDetail() {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<App | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchApp();
    }
  }, [id]);

  const fetchApp = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("apps")
        .select("*")
        .eq("id", id)
        .eq("status", "approved")
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No rows returned
          setApp(null);
        } else {
          throw error;
        }
      } else {
        setApp(data);
      }
    } catch (error) {
      console.error("Error fetching app:", error);
      toast({
        title: "Error",
        description: "Failed to load app details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!app || voting) return;

    setVoting(true);

    try {
      // Get user's IP address
      const ipResponse = await fetch("https://api.ipify.org?format=json");
      const { ip } = await ipResponse.json();

      // Check if user already voted
      const { data: existingVote } = await supabase
        .from("votes")
        .select("id")
        .eq("app_id", app.id)
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
        .insert({ app_id: app.id, ip_address: ip });

      if (error) throw error;

      // Update local state
      setApp(prev => prev ? { ...prev, vote_count: prev.vote_count + 1 } : null);

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
      setVoting(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Share this app with others",
      });
    } catch (error) {
      console.error("Error copying link:", error);
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">App Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The app you're looking for doesn't exist or hasn't been approved yet.
            </p>
            <Link to="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Apps
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    {app.logo_url ? (
                      <img
                        src={app.logo_url}
                        alt={`${app.name} logo`}
                        className="w-20 h-20 rounded-xl object-cover border border-border"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-2xl">
                        {app.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{app.name}</h1>
                    <p className="text-xl text-muted-foreground mb-4">{app.tagline}</p>
                    
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">{app.category}</Badge>
                      <a
                        href={app.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary-hover transition-colors"
                      >
                        <Globe className="w-4 h-4" />
                        Visit Website
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* Vote Button */}
                  <VoteButton
                    voteCount={app.vote_count}
                    onVote={handleVote}
                    isVoting={voting}
                    className="h-20"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <div className="prose max-w-none">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {app.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Screenshots */}
            {app.screenshot_urls && app.screenshot_urls.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Screenshots</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {app.screenshot_urls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Screenshot ${index + 1}`}
                        className="w-full rounded-lg border border-border object-cover aspect-video"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <a
                    href={app.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button className="w-full bg-gradient-primary hover:shadow-glow transition-all">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Try It Now
                    </Button>
                  </a>
                  
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="w-full"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  
                  <VoteButton
                    voteCount={app.vote_count}
                    onVote={handleVote}
                    isVoting={voting}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* App Details */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Details</h3>
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="font-medium text-muted-foreground">Category</dt>
                    <dd>{app.category}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-muted-foreground">Submitted</dt>
                    <dd>{new Date(app.created_at).toLocaleDateString()}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-muted-foreground">Votes</dt>
                    <dd>{app.vote_count} upvotes</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}