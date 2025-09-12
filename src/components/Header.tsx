import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import showcaiseLogo from "@/assets/showcaise-logo.png";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={showcaiseLogo} 
              alt="ShowCaise" 
              className="w-8 h-8 object-contain"
            />
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              ShowCaise
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Discover
            </Link>
            <Link
              to="/submit"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Submit App
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link to="/submit">
              <Button className="bg-gradient-primary hover:shadow-glow transition-all">
                <Plus className="w-4 h-4 mr-2" />
                Submit App
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};