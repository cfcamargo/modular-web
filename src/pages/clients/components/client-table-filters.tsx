import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

interface ClientTableFilterProps {
  disabled: boolean;
}

export default function ClientTableFilters({
  disabled,
}: ClientTableFilterProps) {
  return (
    <form className="flex items-center gap-2">
      <span className="text-sm font-semibold">Filtros</span>
      <Input placeholder="CPF" className="h-8 w-auto" disabled={disabled} />
      <Input
        placeholder="Nome do cliente"
        className="h-8 w-full"
        disabled={disabled}
      />

      <Button type="submit" variant="secondary" size="xs" disabled={disabled}>
        <Search className="mr-2 h-4 w-4" />
        Filtrar resultados
      </Button>

      <Button type="button" variant="outline" size="xs" disabled={disabled}>
        <X className="mr-2 h-4 w-4" />
        Remover Filtros
      </Button>
    </form>
  );
}
