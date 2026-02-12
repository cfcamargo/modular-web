import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { AutoCompletePopover } from "@/components/shared/auto-complete-popover"; // Use o componente que criamos antes
import { productApi } from "@/api"; // Sua API
import { ProductResponse } from "@/models/responses/product-response";

interface ProductLineItemProps {
  index: number;
  remove: (index: number) => void;
  canRemove: boolean;
}

export function ProductLineItem({
  index,
  remove,
  canRemove,
}: ProductLineItemProps) {
  const form = useFormContext(); // Acessa o formulário do pai
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const quantity = form.watch(`items.${index}.quantity`) || 0;
  const unitPrice = form.watch(`items.${index}.unitPrice`) || 0;

  const subtotal = quantity * unitPrice;

  const [selectedProductObj, setSelectedProductObj] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleSearchProduct = async (term: string) => {
    setLoading(true);
    try {
      const response = await productApi.get({
        page: 1,
        perPage: 20,
        searchTerm: term,
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error("Erro ao buscar produtos", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (
    option: { id: string | number; name: string } | null,
  ) => {
    if (option) {
      const product = products.find((p) => p.id === option.id);
      form.setValue(`items.${index}.productId`, option.id);
      if (product) {
        form.setValue(`items.${index}.unitPrice`, product.price);
        form.setValue(`items.${index}.installmentPrice`, product.installmentPrice);
        setSelectedProductObj({ id: product.id, name: product.name });
      }
    } else {
      form.setValue(`items.${index}.productId`, "");
      form.setValue(`items.${index}.unitPrice`, 0);
      form.setValue(`items.${index}.installmentPrice`, 0);
      setSelectedProductObj(null);
    }
  };

  return (
    <TableRow>
      <TableCell>
        <AutoCompletePopover
          className="max-w-[300px]"
          placeholder="Buscar produto..."
          options={products.map((p) => ({ id: p.id, name: p.name }))}
          selectedOption={selectedProductObj}
          onSelect={handleSelect}
          loading={loading}
          handleChangeSearchTerm={(term) => handleSearchProduct(term)}
          onFocus={() => {
            if (products.length === 0) handleSearchProduct("");
          }}
        />
      </TableCell>
      <TableCell>
        <Input

          type="number"
          min="1"
          {...form.register(`items.${index}.quantity`)}
          className="h-9"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          step="0.01"
          min="0"
          {...form.register(`items.${index}.unitPrice`)}
          className="h-9"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          step="0.01"
          min="0"
          {...form.register(`items.${index}.installmentPrice`)}
          className="h-9"
        />
      </TableCell>
      <TableCell>
        <div className="font-medium">R$ {subtotal.toFixed(2)}</div>
      </TableCell>
      <TableCell>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => remove(index)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
}
