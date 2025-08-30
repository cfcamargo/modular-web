"use client";

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
const suppliers = [
  {
    id: "1",
    name: "Tech Solutions Ltda",
    cnpj: "12.345.678/0001-90",
    city: "São Paulo",
  },
  {
    id: "2",
    name: "Eletrônicos Brasil S.A.",
    cnpj: "98.765.432/0001-10",
    city: "Rio de Janeiro",
  },
  {
    id: "3",
    name: "Distribuidora Alpha",
    cnpj: "11.222.333/0001-44",
    city: "Belo Horizonte",
  },
  {
    id: "4",
    name: "Mega Suprimentos",
    cnpj: "55.666.777/0001-88",
    city: "Curitiba",
  },
  {
    id: "5",
    name: "Global Tech Import",
    cnpj: "33.444.555/0001-22",
    city: "Porto Alegre",
  },
];

interface SupplierComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function SupplierCombobox({
  value,
  onValueChange,
}: SupplierComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedSupplier = suppliers.find((supplier) => supplier.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-transparent"
        >
          {selectedSupplier ? (
            <span className="flex items-center gap-2">
              <span className="font-medium">{selectedSupplier.name}</span>
              <span className="text-xs text-muted-foreground">
                ({selectedSupplier.city})
              </span>
            </span>
          ) : (
            <span className="text-muted-foreground">
              Selecione um fornecedor...
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Buscar fornecedor..." />
          <CommandList>
            <CommandEmpty>Nenhum fornecedor encontrado.</CommandEmpty>
            <CommandGroup>
              {suppliers.map((supplier) => (
                <CommandItem
                  key={supplier.id}
                  value={`${supplier.name} ${supplier.cnpj}`}
                  onSelect={() => {
                    onValueChange(supplier.id === value ? "" : supplier.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === supplier.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{supplier.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {supplier.cnpj} • {supplier.city}
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
