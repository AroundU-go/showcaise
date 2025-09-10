import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  category: string;
  onCategoryChange: (category: string) => void;
}

const CATEGORIES = [
  "All Categories",
  "Productivity",
  "Engineering & Development",
  "Design & Creative", 
  "Finance",
  "Social & Community",
  "Marketing & Sales",
  "Health & Fitness",
  "Travel",
  "Platforms",
  "Product add-ons",
  "Web3",
  "AI Agents",
  "LLMs"
];

export const SearchBar = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  category,
  onCategoryChange,
}: SearchBarProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search AI apps..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Filter */}
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sort Select */}
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-full sm:w-[150px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="most-voted">Most Voted</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};