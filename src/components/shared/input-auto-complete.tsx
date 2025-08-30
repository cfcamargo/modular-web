import { useState, useEffect, useMemo, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Hook personalizado para debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface BaseOption {
  id: string | number;
  name: string;
}

interface InputAutoCompleteProps<T extends BaseOption> {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (option: T | null) => void;
  options: T[];
  selectedOption?: T | null;
  loading?: boolean;
  debounceMs?: number;
  maxResults?: number;
  className?: string;
  showIcon?: boolean;
  emptyMessage?: string;
  clearOnSelect?: boolean;
  showAllOption?: boolean;
  allOptionLabel?: string;
}

export function InputAutoComplete<T extends BaseOption>({
  placeholder = "Buscar...",
  value,
  onChange,
  onSelect,
  options,
  selectedOption,
  loading = false,
  debounceMs = 300,
  maxResults = 10,
  className,
  showIcon = true,
  emptyMessage = "Nenhum resultado encontrado",
  clearOnSelect = true,
  showAllOption = true,
  allOptionLabel = "Todos",
}: InputAutoCompleteProps<T>) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce do termo de busca
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  // Filtrar opções baseado no termo de busca
  const filteredOptions = useMemo(() => {
    if (!debouncedSearchTerm) return [];
    
    return options
      .filter((option) =>
        option.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
      .slice(0, maxResults);
  }, [options, debouncedSearchTerm, maxResults]);

  // Sincronizar valor externo com estado interno
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  // Notificar mudanças no termo de busca debounced
  useEffect(() => {
    onChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onChange]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setShowDropdown(true);
    
    // Se o campo for limpo, limpar seleção
    if (!newValue) {
      onSelect(null);
    }
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const handleOptionSelect = (option: T | null) => {
    onSelect(option);
    
    if (clearOnSelect) {
      setSearchTerm("");
    } else {
      setSearchTerm(option?.name || "");
    }
    
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  const shouldShowDropdown = showDropdown && (searchTerm || selectedOption);
  const hasResults = filteredOptions.length > 0;

  return (
    <div className="relative">
      <div className="relative">
        {showIcon && (
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className={cn(
            showIcon && "pl-10",
            selectedOption && "pr-8",
            className
          )}
        />
        {selectedOption && (
          <button
            type="button"
            onClick={() => handleOptionSelect(null)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {shouldShowDropdown && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto"
        >
          <div className="p-2">
            {showAllOption && searchTerm && (
              <div
                className="px-3 py-2 text-sm cursor-pointer hover:bg-accent rounded-sm"
                onClick={() => handleOptionSelect(null)}
              >
                {allOptionLabel}
              </div>
            )}
            
            {loading ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                Carregando...
              </div>
            ) : hasResults ? (
              filteredOptions.map((option) => (
                <div
                  key={option.id}
                  className="px-3 py-2 text-sm cursor-pointer hover:bg-accent rounded-sm"
                  onClick={() => handleOptionSelect(option)}
                >
                  {option.name}
                </div>
              ))
            ) : searchTerm ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                {emptyMessage}
              </div>
            ) : null}
          </div>
        </div>
      )}

      {selectedOption && (
        <div className="mt-2 text-xs text-muted-foreground">
          Selecionado: {selectedOption.name}
        </div>
      )}
    </div>
  );
}