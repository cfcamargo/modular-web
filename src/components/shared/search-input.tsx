import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input"; // Ajuste o caminho se necessário
import { cn } from "@/lib/utils"; // Utilitário padrão do shadcn

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch: (term: string) => void;
  debounceTime?: number;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, debounceTime = 500, ...props }, ref) => {
    const [searchTerm, setSearchTerm] = React.useState("");

    React.useEffect(() => {
      const handler = setTimeout(() => {
        onSearch(searchTerm);
      }, debounceTime);

      return () => {
        clearTimeout(handler);
      };
    }, [searchTerm, debounceTime, onSearch]);

    const handleClear = () => {
      setSearchTerm("");
    };

    return (
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

        <Input
          ref={ref}
          type="search"
          placeholder="Buscar..."
          className={cn("pl-9 pr-8", className)}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          {...props}
        />

        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Limpar busca"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";
