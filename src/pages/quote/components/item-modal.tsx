import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuoteItem } from "@/models/common/quotes";
import { InputAutoComplete } from "@/components/shared/input-auto-complete";
import { ProductResponse } from "@/models/responses/product-response";
import { productApi } from "@/api";
import { toast } from "sonner";

interface ItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: QuoteItem | null;
  onSave: (item: QuoteItem) => void;
}

export const ItemModal = ({
  open,
  onOpenChange,
  item,
  onSave,
}: ItemModalProps) => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponse | null>(null);

  const [formData, setFormData] = useState<QuoteItem>({
    id: "",
    product: null,
    quantity: 1,
    unitPrice: "",
    discount: "",
  });

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        id: "",
        product: null,
        quantity: 1,
        unitPrice: "",
        discount: "",
      });
    }
  }, [item, open]);

  const handleProductSelect = (product: ProductResponse | null) => {
    console.log(product);
    if (product) {
      setSelectedProduct(product);
      // setValue("productId", product.id, { shouldValidate: true });
    } else {
      setSelectedProduct(null);
      // setValue("productId", "", { shouldValidate: true });
    }
    setFormData((prev) => ({
      ...prev,
      product,
      unitPrice: product?.avgUnitCost?.toString() || "",
    }));
  };

  const handleSave = () => {
    if (!formData.product) return;

    onSave(formData);
    onOpenChange(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const calculateSubtotal = (): number => {
    const qty =
      typeof formData.quantity === "string"
        ? parseFloat(formData.quantity.toString()) || 0
        : formData.quantity || 0;
    const price =
      typeof formData.unitPrice === "string"
        ? parseFloat(formData.unitPrice) || 0
        : formData.unitPrice || 0;
    const discount =
      typeof formData.discount === "string"
        ? parseFloat(formData.discount) || 0
        : formData.discount || 0;

    return qty * price * (1 - discount / 100);
  };

  const isValid = formData.product && formData.quantity && formData.unitPrice;

  const loadProducts = async () => {
    try {
      const response = await productApi.get({
        page: 1,
        perPage: 30,
        searchTerm: productSearch,
      });
      setProducts(response.data.data);
    } catch {
      toast.error("Erro ao carregar produtos");
    }
  };

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productSearch]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{item ? "Editar Item" : "Adicionar Item"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product">Produto *</Label>
            <InputAutoComplete
              placeholder="Buscar produto..."
              value={productSearch}
              onChange={setProductSearch}
              onSelect={handleProductSelect}
              options={products}
              selectedOption={selectedProduct}
              debounceMs={300}
              maxResults={10}
              emptyMessage="Nenhum produto encontrado"
              allOptionLabel="Todos os produtos"
              clearOnSelect={true}
            />
            {/* {errors.productId && (
                <p className="text-sm text-destructive">
                  {errors.productId.message}
                </p>
              )} */}
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, discount: e.target.value }))
                }
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount">Desconto (%)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={formData.discount}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, discount: e.target.value }))
                }
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unitPrice">Preço Unitário</Label>
            <Input
              id="unitPrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.unitPrice}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, unitPrice: e.target.value }))
              }
              placeholder="0,00"
            />
          </div>

          {isValid && (
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
              <span className="text-sm font-medium">Subtotal:</span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(calculateSubtotal())}
              </span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!isValid}>
            {item ? "Salvar" : "Adicionar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
