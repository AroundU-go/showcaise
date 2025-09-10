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
}

export const AppCard = ({ app, onVote, isVoting }: AppCardProps) => {
  return (
    <Card className="group hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
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
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <Link
                  to={`/app/${app.id}`}
                  className="group-hover:text-primary transition-colors"
                >
                  <h3 className="font-semibold text-lg mb-1 truncate">
                    {app.name}
                  </h3>
                </Link>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                  {app.tagline}
                </p>
                
                <div className="flex items-center gap-2 mb-2">
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
              <VoteButton
                voteCount={app.vote_count}
                onVote={() => onVote(app.id)}
                isVoting={isVoting}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};