import { Button } from "@/components/ui/button";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoteButtonProps {
  voteCount: number;
  onVote: () => void;
  isVoting: boolean;
  className?: string;
}

export const VoteButton = ({ voteCount, onVote, isVoting, className }: VoteButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onVote}
      disabled={isVoting}
      className={cn(
        "flex flex-col items-center justify-center min-w-[60px] h-16 px-2 py-1",
        "border-vote-border bg-white hover:bg-vote hover:text-vote-text hover:border-vote",
        "transition-all duration-200 hover:shadow-primary hover:scale-105",
        "group active:scale-95",
        isVoting && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <ChevronUp 
        className={cn(
          "w-4 h-4 mb-1 transition-transform duration-200", 
          "group-hover:scale-110"
        )} 
      />
      <span className="text-xs font-medium">{voteCount}</span>
    </Button>
  );
};