import { Card, CardContent } from "@/components/ui/card";
import { VoteButton } from "./VoteButton";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

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

interface AppCardProps {
  app: App;
  onVote: (appId: string) => void;
  isVoting: boolean;
  isFeatured?: boolean;
}

export const AppCard = ({ app, onVote, isVoting, isFeatured = false }: AppCardProps) => {
  return (
    <Card className="group hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 relative">
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-green-600 hover:bg-green-700 text-white text-xs">
            Featured
          </Badge>
        </div>
      )}

      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
          {/* Logo */}
          <div className="flex-shrink-0 w-full sm:w-auto flex justify-center sm:block">
            {app.logo_url ? (
              <img
                src={app.logo_url}
                alt={`${app.name} logo`}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover border border-border"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-xl sm:text-2xl">
                {app.name.charAt(0)}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
              <div className="flex-1 w-full">
                <Link
                  to={`/app/${app.id}`}
                  className="group-hover:text-primary transition-colors"
                >
                  <h3 className="font-semibold text-base sm:text-lg mb-1 break-words">
                    {app.name}
                  </h3>
                </Link>
                <p className="text-muted-foreground text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 break-words">
                  {app.tagline}
                </p>
                
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {app.category}
                  </Badge>
                  <a
                    href={app.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Vote Button */}
              <div className="w-full sm:w-auto flex justify-center sm:block">
                <VoteButton
                  voteCount={app.vote_count}
                  onVote={() => onVote(app.id)}
                  isVoting={isVoting}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};