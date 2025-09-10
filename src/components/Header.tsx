import { Button } from "@/components/ui/button";
import { Plus, Sparkles, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              AI Showcase
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
            <Link to="/admin">
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <Shield className="w-4 h-4 mr-2" />
                Admin
              </Button>
            </Link>
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