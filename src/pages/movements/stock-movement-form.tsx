import type React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Package,
  TrendingUp,
  TrendingDown,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { InputAutoComplete } from "@/components/shared/input-auto-complete";
import { SupplierCombobox } from "./components/supplier-combox";
import { ProductApi } from "@/api/product-api";
import { ProductResponse } from "@/models/responses/product-response";
import { Link } from "react-router-dom";

const productApi = new ProductApi();

type MovementType = "entry" | "exit" | "adjustment";

interface MovementData {
  type: MovementType;
  productId: string;
  quantity: number;
  costValue?: number;
  saleValue?: number;
  supplierId?: string;
  description?: string;
}

export function StockMovementForm() {
  const [movementType, setMovementType] = useState<MovementType>("entry");
  const [formData, setFormData] = useState<MovementData>({
    type: "entry",
    productId: "",
    quantity: 0,
    costValue: 0,
    saleValue: 0,
    supplierId: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponse | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productApi.get({
        page: 1,
        perPage: 100,
        searchTerm: "",
      });
      setProducts(response.data.data);
    } catch (error) {
      toast.error("Erro ao carregar produtos");
    }
  };

  const handleProductSelect = (product: ProductResponse | null) => {
    setSelectedProduct(product);
    setFormData((prev) => ({
      ...prev,
      productId: product ? product.id.toString() : "",
    }));
  };

  const handleTypeChange = (type: MovementType) => {
    setMovementType(type);
    setFormData({
      type,
      productId: "",
      quantity: 0,
      costValue: type === "entry" ? 0 : undefined,
      saleValue: type === "entry" ? 0 : undefined,
      supplierId: type === "entry" ? "" : undefined,
      description: "",
    });
    setSelectedProduct(null);
    setProductSearch("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validações básicas
      if (!formData.productId) {
        toast.error("Selecione um produto");
        return;
      }

      if (formData.quantity <= 0) {
        toast.error("Quantidade deve ser maior que zero");
        return;
      }

      if (movementType === "entry" && !formData.supplierId) {
        toast.error("Selecione um fornecedor para entrada");
        return;
      }

      // Simular envio para API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(`Movimentação de ${movementType} registrada com sucesso`);

      // Reset form
      setFormData({
        type: movementType,
        productId: "",
        quantity: 0,
        costValue: movementType === "entry" ? 0 : undefined,
        saleValue: movementType === "entry" ? 0 : undefined,
        supplierId: movementType === "entry" ? "" : undefined,
        description: "",
      });
    } catch (error) {
      toast.error("Erro ao registrar movimentação");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIcon = (type: MovementType) => {
    switch (type) {
      case "entry":
        return <TrendingUp className="h-4 w-4" />;
      case "exit":
        return <TrendingDown className="h-4 w-4" />;
      case "adjustment":
        return <Settings className="h-4 w-4" />;
    }
  };

  return (
    <Card className={`transition-colors duration-200`}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/movements">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Movimentação de Estoque
            </CardTitle>
            <CardDescription>
              Registre entradas, saídas e ajustes no seu estoque
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seleção do Tipo de Movimentação */}
          <div className="space-y-2">
            <Label>Tipo de Movimentação</Label>
            <div className="grid grid-cols-3 gap-3">
              {(["entry", "exit", "adjustment"] as MovementType[]).map(
                (type) => (
                  <Button
                    key={type}
                    type="button"
                    variant={movementType === type ? "default" : "outline"}
                    onClick={() => handleTypeChange(type)}
                    className="flex items-center gap-2 capitalize"
                  >
                    {getIcon(type)}
                    {type === "entry"
                      ? "Entrada"
                      : type === "exit"
                      ? "Saída"
                      : "Ajuste"}
                  </Button>
                )
              )}
            </div>
          </div>

          {/* Seleção do Produto */}
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
          </div>

          {/* Quantidade */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade *</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              step="1"
              value={formData.quantity || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  quantity: Number.parseInt(e.target.value) || 0,
                }))
              }
              placeholder="Digite a quantidade"
            />
          </div>

          {/* Campos específicos para ENTRADA */}
          {movementType === "entry" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="costValue">Valor de Custo *</Label>
                  <Input
                    id="costValue"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.costValue || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        costValue: Number.parseFloat(e.target.value) || 0,
                      }))
                    }
                    placeholder="0,00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="saleValue">Valor para Venda *</Label>
                  <Input
                    id="saleValue"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.saleValue || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        saleValue: Number.parseFloat(e.target.value) || 0,
                      }))
                    }
                    placeholder="0,00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier">Fornecedor *</Label>
                <SupplierCombobox
                  value={formData.supplierId || ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, supplierId: value }))
                  }
                />
              </div>
            </>
          )}

          {/* Campo de Valor para SAÍDA */}
          {movementType === "exit" && (
            <div className="space-y-2">
              <Label htmlFor="saleValue">Valor</Label>
              <Input
                id="saleValue"
                type="number"
                min="0"
                step="0.01"
                value={formData.saleValue || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    saleValue: Number.parseFloat(e.target.value) || 0,
                  }))
                }
                placeholder="0,00"
              />
            </div>
          )}

          {/* Descrição (opcional para todos os tipos) */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Descrição {movementType !== "adjustment" && "(opcional)"}
            </Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Digite uma descrição para esta movimentação..."
              rows={3}
            />
          </div>

          {/* Botão de Submit */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting
              ? "Registrando..."
              : `Registrar ${
                  movementType.charAt(0).toUpperCase() + movementType.slice(1)
                }`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
