import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChange, placeholder = "Cari surah..." }: SearchBarProps) => {
  return (
    <div className="relative max-w-md mx-auto mb-8">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />

      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 bg-card border-border focus:ring-2 focus:ring-primary"
      />
    </div>
  );
};

export default SearchBar;
