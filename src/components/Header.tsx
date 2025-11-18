import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Plus, User, LogOut, BarChart3, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import newLogo from "@/assets/logo-updated.png";
import { useState } from "react";
import { NewsletterModal } from "@/components/NewsletterModal";

export const Header = () => {
  const { user, signOut, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={newLogo} 
              alt="Showcaise" 
              className="h-10 w-auto"
            />
            <span className="text-lg sm:text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              ShowCaise
            </span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 transform -translate-x-1/2">
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Discover
            </Link>
            <Link
              to="/blog"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Blog
            </Link>
            <button
              onClick={() => setNewsletterOpen(true)}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Newsletter
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="w-10 h-10" /> 
            ) : user ? (
              <>
                <Link to="/submit" className="hidden md:block">
                  <Button className="bg-gradient-primary hover:shadow-glow transition-all">
                    <Plus className="w-4 h-4 mr-2" />
                    Submit App
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="md:size-default">
                    Sign In
                  </Button>
                </Link>
                <Link to="/submit">
                  <Button size="sm" className="bg-gradient-primary hover:shadow-glow transition-all md:size-default">
                    <Plus className="w-4 h-4 mr-2 hidden sm:inline" />
                    <span className="hidden sm:inline">Submit App</span>
                    <span className="sm:hidden">Submit</span>
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  to="/"
                  className="text-foreground hover:text-primary transition-colors font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Discover
                </Link>
                <Link
                  to="/blog"
                  className="text-foreground hover:text-primary transition-colors font-medium py-2"
                  onClick={() => setIsOpen(false)}
                >
                  Blog
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setNewsletterOpen(true);
                  }}
                  className="text-foreground hover:text-primary transition-colors font-medium py-2 text-left"
                >
                  Newsletter
                </button>
                {!loading && !user && (
                  <Link
                    to="/auth"
                    className="text-foreground hover:text-primary transition-colors font-medium py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <NewsletterModal open={newsletterOpen} onOpenChange={setNewsletterOpen} />
    </header>
  );
};
