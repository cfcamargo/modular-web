import { useState, useEffect, useMemo, useRef } from "react";
import { Search, X, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BaseOption } from "@/models/common/baseOption";

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

interface AutoCompletePopoverProps<T extends BaseOption> {
  placeholder?: string;
  onSelect: (option: T | null) => void;
  options: T[];
  selectedOption?: T | null;
  loading?: boolean;
  debounceMs?: number;
  maxResults?: number;
  className?: string;
  emptyMessage?: string;
  handleChangeSearchTerm?: (value: string) => void;
}

export function AutoCompletePopover<T extends BaseOption>({
  placeholder = "Selecionar...",
  onSelect,
  options,
  selectedOption,
  loading = false,
  debounceMs = 300,
  maxResults = 10,
  className,
  handleChangeSearchTerm,
  emptyMessage = "Nenhum resultado encontrado",
}: AutoCompletePopoverProps<T>) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  const filteredOptions = useMemo(() => {
    if (!debouncedSearchTerm) return options.slice(0, maxResults);

    return options
      .filter((option) =>
        option.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
      )
      .slice(0, maxResults);
  }, [options, debouncedSearchTerm, maxResults]);

  useEffect(() => {
    if (!open) {
      setSearchTerm("");
    } else {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  }, [open]);

  const handleSelect = (option: T) => {
    onSelect(option);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(null);
    setSearchTerm("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal bg-transparent",
            className,
          )}
        >
          {selectedOption ? (
            <span className="truncate">{selectedOption.name}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}

          <div className="flex items-center ml-2">
            {selectedOption && (
              <div
                role="button"
                onClick={handleClear}
                className="mr-2 p-1 hover:bg-accent rounded-full text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3 w-3" />
              </div>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <input
            ref={inputRef}
            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (
                handleChangeSearchTerm &&
                typeof handleChangeSearchTerm === "function"
              ) {
                handleChangeSearchTerm(e.target.value);
              }
            }}
          />
        </div>
        <div className="max-h-[200px] overflow-y-auto p-1">
          {loading ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Carregando...
            </div>
          ) : filteredOptions.length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          ) : (
            filteredOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => handleSelect(option)}
                className={cn(
                  "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer",
                  selectedOption?.id === option.id &&
                    "bg-accent text-accent-foreground",
                )}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedOption?.id === option.id
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
                {option.name}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
