import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Plus, ExternalLink, Trash2, Loader2, Clock, CheckCircle, XCircle } from "lucide-react";

interface App {
  id: string;
  name: string;
  tagline: string;
  description: string;
  website_url: string;
  logo_url: string | null;
  category: string;
  vote_count: number;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchUserApps();
    }
  }, [user]);

  const fetchUserApps = async () => {
    if (!user?.email) return;

    try {
      const { data, error } = await supabase
        .from("apps")
        .select("*")
        .eq("maker_email", user.email)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error fetching apps",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setApps(data || []);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch your apps. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApp = async (appId: string) => {
    setDeletingId(appId);
    try {
      const { error } = await supabase
        .from("apps")
        .delete()
        .eq("id", appId);

      if (error) {
        toast({
          title: "Error deleting app",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "App deleted",
          description: "Your app has been successfully deleted.",
        });
        setApps(apps.filter(app => app.id !== appId));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete app. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Apps</h1>
            <p className="text-muted-foreground mt-1">
              Manage your submitted applications
            </p>
          </div>
          <Link to="/submit">
            <Button className="bg-gradient-primary hover:shadow-glow transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Submit New App
            </Button>
          </Link>
        </div>

        {/* Apps Grid */}
        {apps.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="mb-4">
                <Plus className="w-12 h-12 mx-auto text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No apps submitted yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by submitting your first app to ShowCaise
              </p>
              <Link to="/submit">
                <Button className="bg-gradient-primary hover:shadow-glow transition-all">
                  <Plus className="w-4 h-4 mr-2" />
                  Submit Your First App
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {apps.map((app) => (
              <Card key={app.id} className="hover:shadow-card-hover transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {app.logo_url ? (
                        <img
                          src={app.logo_url}
                          alt={`${app.name} logo`}
                          className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-white font-semibold flex-shrink-0">
                          {app.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-lg truncate">{app.name}</CardTitle>
                        <CardDescription className="line-clamp-2">{app.tagline}</CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Category</p>
                      <Badge variant="outline">{app.category}</Badge>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Votes</p>
                      <p className="font-semibold">{app.vote_count}</p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <a
                          href={app.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visit
                        </a>
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={deletingId === app.id}
                          >
                            {deletingId === app.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete App</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{app.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteApp(app.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}