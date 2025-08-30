import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Mock data - substitua pela sua fonte de dados real
const products = [
  {
    id: "1",
    name: "Notebook Dell Inspiron 15",
    code: "NB001",
    category: "Eletrônicos",
  },
  {
    id: "2",
    name: "Mouse Logitech MX Master 3",
    code: "MS001",
    category: "Periféricos",
  },
  {
    id: "3",
    name: "Teclado Mecânico Keychron K2",
    code: "KB001",
    category: "Periféricos",
  },
  {
    id: "4",
    name: 'Monitor LG UltraWide 29"',
    code: "MN001",
    category: "Monitores",
  },
  {
    id: "5",
    name: "Smartphone Samsung Galaxy S23",
    code: "SM001",
    category: "Celulares",
  },
  {
    id: "6",
    name: "Fone de Ouvido Sony WH-1000XM4",
    code: "FN001",
    category: "Áudio",
  },
  {
    id: "7",
    name: "Tablet iPad Air 5ª Geração",
    code: "TB001",
    category: "Tablets",
  },
  {
    id: "8",
    name: "Impressora HP LaserJet Pro",
    code: "PR001",
    category: "Impressoras",
  },
];

interface ProductComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function ProductCombobox({
  value,
  onValueChange,
}: ProductComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedProduct = products.find((product) => product.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
        >
          {selectedProduct ? (
            <span className="flex items-center gap-2">
              <span className="font-medium">{selectedProduct.name}</span>
              <span className="text-xs text-muted-foreground">
                ({selectedProduct.code})
              </span>
            </span>
          ) : (
            <span className="text-muted-foreground">
              Selecione um produto...
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar produto..." />
          <CommandList>
            <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
            <CommandGroup>
              {products.map((product) => (
                <CommandItem
                  key={product.id}
                  value={`${product.name} ${product.code}`}
                  onSelect={() => {
                    onValueChange(product.id === value ? "" : product.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === product.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{product.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {product.code} • {product.category}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
