import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Check, X, ExternalLink, Loader2, Eye, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { AdminLogin } from "@/components/AdminLogin";

interface PendingApp {
  id: string;
  name: string;
  tagline: string;
  description: string;
  website_url: string;
  logo_url?: string;
  maker_email: string;
  category: string;
  status: string;
  created_at: string;
}

export default function Admin() {
  const [pendingApps, setPendingApps] = useState<PendingApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingApps, setProcessingApps] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();

  useEffect(() => {
    console.log("Admin component mounted, user:", user, "isAdmin:", isAdmin);
    if (user && isAdmin) {
      fetchPendingApps();
    }
  }, [user, isAdmin]);

  // Show login screen if not authenticated or not admin
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <AdminLogin />;
  }

  const fetchPendingApps = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("apps")
        .select("*")
        .in("status", ["pending", "approved"])
        .order("created_at", { ascending: true });

      if (error) throw error;
      setPendingApps(data || []);
    } catch (error) {
      console.error("Error fetching apps:", error);
      toast({
        title: "Error",
        description: "Failed to load apps.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateAppStatus = async (appId: string, status: "approved" | "rejected") => {
    if (processingApps.has(appId)) return;

    setProcessingApps(prev => new Set(prev).add(appId));

    try {
      const { error } = await supabase
        .from("apps")
        .update({ status })
        .eq("id", appId);

      if (error) throw error;

      setPendingApps(prev => prev.filter(app => app.id !== appId));

      toast({
        title: `App ${status}`,
        description: `The app has been ${status} successfully.`,
      });
    } catch (error) {
      console.error(`Error ${status} app:`, error);
      toast({
        title: "Error",
        description: `Failed to ${status} the app. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setProcessingApps(prev => {
        const next = new Set(prev);
        next.delete(appId);
        return next;
      });
    }
  };

  const deleteApp = async (appId: string) => {
    if (processingApps.has(appId)) return;

    setProcessingApps(prev => new Set(prev).add(appId));

    try {
      const { error } = await supabase
        .from("apps")
        .delete()
        .eq("id", appId);

      if (error) throw error;

      setPendingApps(prev => prev.filter(app => app.id !== appId));

      toast({
        title: "App deleted",
        description: "The app has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting app:", error);
      toast({
        title: "Error",
        description: "Failed to delete the app. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingApps(prev => {
        const next = new Set(prev);
        next.delete(appId);
        return next;
      });
    }
  };

  const AppCard = ({ app }: { app: PendingApp }) => (
    <Card className="hover:shadow-card-hover transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            {app.logo_url ? (
              <img
                src={app.logo_url}
                alt={`${app.name} logo`}
                className="w-16 h-16 rounded-xl object-cover border border-border"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-xl">
                {app.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1 truncate">
                  {app.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-2">
                  {app.tagline}
                </p>
                <Badge variant="secondary" className="text-xs mb-2">
                  {app.category}
                </Badge>
              </div>
              
              <Badge variant="outline" className="text-xs">
                {app.status}
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {app.description}
            </p>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
              <span>Submitted by: {app.maker_email}</span>
              <span>•</span>
              <span>{new Date(app.created_at).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={app.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:text-primary-hover transition-colors text-sm"
              >
                <Eye className="w-3 h-3" />
                Preview
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
          {app.status === "pending" ? (
            <>
              <Button
                size="sm"
                onClick={() => updateAppStatus(app.id, "approved")}
                disabled={processingApps.has(app.id)}
                className="bg-green-600 hover:bg-green-700 text-white flex-1"
              >
                {processingApps.has(app.id) ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Approve
                  </>
                )}
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={() => updateAppStatus(app.id, "rejected")}
                disabled={processingApps.has(app.id)}
                className="flex-1"
              >
                {processingApps.has(app.id) ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <X className="w-4 h-4 mr-1" />
                    Reject
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteApp(app.id)}
              disabled={processingApps.has(app.id)}
              className="w-full"
            >
              {processingApps.has(app.id) ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <X className="w-4 h-4 mr-1" />
                  Delete App
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Admin{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Panel
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Review and manage app submissions
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : pendingApps.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No pending apps</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                All submissions have been reviewed. Check back later for new submissions.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold">
                All Apps ({pendingApps.length})
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pendingApps.map((app) => (
                <AppCard key={app.id} app={app} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}