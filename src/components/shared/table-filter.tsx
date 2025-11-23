import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useState } from "react";

interface ProductTableFilterProps {
  readonly disabled: boolean;
  readonly description: string;
  readonly onSubmitFilter: (value: string) => void;
  readonly onClearFilter: () => void;
}

export default function TableFilter({
  disabled,
  description,
  onSubmitFilter,
  onClearFilter,
}: ProductTableFilterProps) {
  const [inputValue, setInputValue] = useState("");

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFilter = (e: React.ChangeEvent<FormDataEvent>) => {
    e.preventDefault();
    if (inputValue.length > 1) {
      onSubmitFilter(inputValue);
    }
  };

  const handleClearFilter = () => {
    setInputValue("");
    onClearFilter();
  };

  return (
    <form className="flex items-center gap-2" onSubmit={() => handleFilter}>
      <span className="text-sm font-semibold">Filtros</span>
      <Input
        placeholder={description}
        className="h-8 w-full"
        disabled={disabled}
        onChange={handleChangeInput}
        value={inputValue}
      />

      <Button type="submit" variant="secondary" size="sm" disabled={disabled}>
        <Search className="mr-2 h-4 w-4" />
        Filtrar resultados
      </Button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={handleClearFilter}
      >
        <X className="mr-2 h-4 w-4" />
        Remover Filtros
      </Button>
    </form>
  );
}
