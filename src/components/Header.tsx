import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Plus, User, LogOut, BarChart3, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import newLogo from "@/assets/logo-updated.png";
import { useState } from "react";

export const Header = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

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

          {/* Navigation */}
          <nav className="flex items-center gap-4 sm:gap-6 md:gap-8">
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-colors font-medium text-sm"
            >
              Discover
            </Link>
            <Link
              to="/blog"
              className="text-foreground hover:text-primary transition-colors font-medium text-sm"
            >
              Blog
            </Link>
            <Link
              to="/submit"
              className="text-foreground hover:text-primary transition-colors font-medium text-sm"
            >
              Submit App
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {user ? (
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
                <Link to="/auth" className="hidden md:block">
                  <Button variant="outline">
                    Sign In
                  </Button>
                </Link>
                <Link to="/submit" className="hidden md:block">
                  <Button className="bg-gradient-primary hover:shadow-glow transition-all">
                    <Plus className="w-4 h-4 mr-2" />
                    Submit App
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
