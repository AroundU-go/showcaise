import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import newLogo from "@/assets/new-logo.png";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (showForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });
        if (error) throw error;
        
        toast({
          title: "Password reset email sent!",
          description: "Check your email for a password reset link.",
        });
        setShowForgotPassword(false);
      } else if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Login Failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in.",
          });
          navigate("/dashboard");
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          toast({
            title: "Signup Failed",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Account Created!",
            description: "Please check your email for verification.",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <div className="flex items-center justify-center gap-3 mb-2">
            <img 
              src={newLogo} 
              alt="Showcaise Logo" 
              className="h-12 object-contain"
            />
            <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              ShowCaise
            </span>
          </div>
          <p className="text-muted-foreground">
            {showForgotPassword 
              ? "Enter your email to reset your password" 
              : (isLogin ? "Welcome back! Sign in to your account." : "Create your account to submit and manage apps.")
            }
          </p>
        </div>

        {/* Auth Card */}
        <Card className="shadow-card-hover">
          <CardHeader className="text-center">
            <CardTitle>
              {showForgotPassword ? "Reset Password" : (isLogin ? "Sign In" : "Create Account")}
            </CardTitle>
            <CardDescription>
              {showForgotPassword 
                ? "We'll send you a password reset link"
                : (isLogin 
                  ? "Enter your credentials to access your dashboard" 
                  : "Join ShowCaise to showcase your apps"
                )
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {!showForgotPassword && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:shadow-glow transition-all" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {showForgotPassword ? "Sending..." : (isLogin ? "Signing in..." : "Creating account...")}
                  </>
                ) : (
                  showForgotPassword ? "Send Reset Email" : (isLogin ? "Sign In" : "Create Account")
                )}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              {isLogin && !showForgotPassword && (
                <Button
                  variant="link"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Forgot your password?
                </Button>
              )}
              
              {showForgotPassword ? (
                <Button
                  variant="link"
                  onClick={() => setShowForgotPassword(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Back to sign in
                </Button>
              ) : (
                <Button
                  variant="link"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {isLogin 
                    ? "Don't have an account? Sign up" 
                    : "Already have an account? Sign in"
                  }
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}