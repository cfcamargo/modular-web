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
import { InputAutoComplete } from "@/components/shared/input-auto-complete";
import { ProductResponse } from "@/models/responses/product-response";
import { productApi } from "@/api";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { QuoteItem } from "@/models/common/quotes";

interface ItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: QuoteItem | null;
  onSave: (item: QuoteItem) => void;
}

type FormValues = {
  product: ProductResponse | null;
  quantity: number;
  unitPrice: number;
  discount?: number; // %
};

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

  const form = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      product: null,
      quantity: 1,
      unitPrice: 0,
      discount: 0,
    },
  });

  // // Quando abrir/editar, popular o form
  // useEffect(() => {
  //   if (open) {
  //     if (item) {
  //       setSelectedProduct(item.product);
  //       form.reset({
  //         product: item.product ?? null,
  //         quantity: Number(item.quantity ?? 1),
  //         unitPrice: Number(item.unitPrice ?? 0),
  //         discount: Number(item.discount ?? 0),
  //       });
  //     } else {
  //       setSelectedProduct(null);
  //       form.reset({
  //         product: null,
  //         quantity: 1,
  //         unitPrice: 0,
  //         discount: 0,
  //       });
  //     }
  //   }
  // }, [item, open, form]);

  // Buscar produtos
  useEffect(() => {
    (async () => {
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
    })();
  }, [productSearch]);

  const onSubmit = (values: FormValues) => {
    if (!values.product) {
      toast.error("Selecione um produto");
      return;
    }

    const payload: QuoteItem = {
      id: item?.id ?? crypto.randomUUID(),
      product: values.product,
      quantity: values.quantity,
      unitPrice: values.unitPrice,
      discount: values.discount ?? 0,
    };

    onSave(payload);
    onOpenChange(false);
    form.reset();
  };

  const subtotal = (() => {
    const q = Number(form.watch("quantity") || 0);
    const p = Number(form.watch("unitPrice") || 0);
    const d = Number(form.watch("discount") || 0);
    return q * p * (1 - d / 100);
  })();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{item ? "Editar Item" : "Adicionar Item"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Produto */}
            <div className="space-y-2">
              <Label htmlFor="product">Produto *</Label>
              <Controller
                control={form.control}
                name="product"
                render={({ field }) => (
                  <InputAutoComplete
                    placeholder="Buscar produto..."
                    value={productSearch}
                    onChange={setProductSearch}
                    onSelect={(product) => {
                      setSelectedProduct(product);
                      field.onChange(product);
                      // Sugerir preço do produto (ex.: avgUnitCost) ao selecionar
                      form.setValue(
                        "unitPrice",
                        Number(product?.avgUnitCost ?? 0),
                        {
                          shouldValidate: true,
                          shouldDirty: true,
                        }
                      );
                    }}
                    options={products}
                    selectedOption={selectedProduct}
                    debounceMs={300}
                    maxResults={10}
                    emptyMessage="Nenhum produto encontrado"
                    allOptionLabel="Todos os produtos"
                    clearOnSelect={true}
                  />
                )}
              />
              <FormMessage />
            </div>

            {/* Quantidade */}
            <FormField
              control={form.control}
              name="quantity"
              rules={{ required: true, min: 0.01 }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Desconto (%) */}
            <FormField
              control={form.control}
              name="discount"
              rules={{ min: 0, max: 100 }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Desconto (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      placeholder="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Preço Unitário */}
            <FormField
              control={form.control}
              name="unitPrice"
              rules={{ required: true, min: 0 }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço Unitário</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Subtotal */}
            {form.watch("product") && form.formState.isValid && (
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                <span className="text-sm font-medium">Subtotal:</span>
                <span className="text-lg font-bold text-primary">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(subtotal || 0)}
                </span>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={!form.formState.isValid}>
                {item ? "Salvar" : "Adicionar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
