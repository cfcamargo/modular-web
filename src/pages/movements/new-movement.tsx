import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Package, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { ProductResponse } from "@/models/responses/product-response";
import { InputAutoComplete } from "@/components/shared/input-auto-complete";
import { productApi, supplierApi } from "@/api";
import { stockMovementApi } from "@/api/stock-movement-api";
import { StockMovementType } from "@/models/common/stockMovementType";
import { CreateStockMovementRequest } from "@/models/requests/stock-movement-request";
import { StockMovementTypeEnum } from "@/utils/enums/StockMovementTypeEnum";
import { useUserLoggedStore } from "@/store/auth/user-logged";
import { useNavigate } from "react-router-dom";
import { SupplierResponse } from "@/models/responses/supplier-response";

interface StockMovementFormData {
  productId: string;
  type: StockMovementType;
  quantity: number;
  unitCost?: number;
  unitSalePrice?: number;
  supplierId?: string;
  description?: string;
}

const movementTypeConfig = {
  PURCHASE: {
    label: "Compra",
    color: "bg-green-100 text-green-800",
    isEntry: true,
  },
  SALE: { label: "Venda", color: "bg-red-100 text-red-800", isEntry: false },
  ADJUST_IN: {
    label: "Ajuste Entrada",
    color: "bg-blue-100 text-blue-800",
    isEntry: true,
  },
  ADJUST_OUT: {
    label: "Ajuste Saída",
    color: "bg-orange-100 text-orange-800",
    isEntry: false,
  },
  RETURN_TO_SUPPLIER: {
    label: "Devolução p/ Fornecedor",
    color: "bg-purple-100 text-purple-800",
    isEntry: false,
  },
  RETURN_FROM_CLIENT: {
    label: "Devolução de Cliente",
    color: "bg-teal-100 text-teal-800",
    isEntry: true,
  },
} as const;

export default function NewMovement() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponse | null>(null);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [supplierSearch, setSupplierSearch] = useState("");
  const [selectedSupplier, setSelectedSupplier] =
    useState<SupplierResponse | null>(null);
  const [suppliers, setSuppliers] = useState<SupplierResponse[]>([]);

  const { user } = useUserLoggedStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<StockMovementFormData>();

  const HiddenRegistrations = () => (
    <>
      <input
        type="hidden"
        {...register("productId", { required: "Produto é obrigatório" })}
      />
      <input
        type="hidden"
        {...register("type", { required: "Tipo é obrigatório" })}
      />
    </>
  );

  const watchedType = watch("type");
  const watchedQuantity = watch("quantity");

  const handleProductSelect = (product: ProductResponse | null) => {
    if (product) {
      setSelectedProduct(product);
      setValue("productId", product.id, { shouldValidate: true });
    } else {
      setSelectedProduct(null);
      setValue("productId", "", { shouldValidate: true });
    }
  };

  const handleSupplierSelect = (supplier: SupplierResponse | null) => {
    if (supplier) {
      setSelectedSupplier(supplier);
      setValue("supplierId", supplier.id, { shouldValidate: true });
    } else {
      setSelectedSupplier(null);
      setValue("supplierId", "", { shouldValidate: true });
    }
  };

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

  // helpers / regras
  const EXIT_TYPES = ["SALE", "ADJUST_OUT", "RETURN_TO_SUPPLIER"] as const;

  const requiresSupplier =
    watchedType === "PURCHASE" || watchedType === "RETURN_TO_SUPPLIER";
  const requiresCost =
    watchedType === "PURCHASE" ||
    watchedType === "ADJUST_IN" ||
    watchedType === "RETURN_FROM_CLIENT";
  const requiresSalePrice =
    watchedType === "PURCHASE" || watchedType === "SALE";
  const showSalePriceOptional =
    watchedType === "ADJUST_IN" || watchedType === "RETURN_FROM_CLIENT";

  const isExit = EXIT_TYPES.includes(watchedType as any);
  const hasInsufficientStock =
    isExit &&
    selectedProduct &&
    Number(watchedQuantity) > Number(selectedProduct.stockOnHand ?? 0);

  // unidades que aceitam decimais
  const isDecimalUnit = ["KG", "LT", "L", "M2", "M³", "M3"].includes(
    (selectedProduct?.unit as any) ?? ""
  );
  const quantityStep = isDecimalUnit ? "0.01" : "1";
  const quantityMin = isDecimalUnit ? "0.01" : "1";

  const getSuggestedSalePrice = () => {
    if (!selectedProduct) return 0;
    const avg = Number(selectedProduct.avgUnitCost ?? 0);
    const margin = Number(selectedProduct.marginPercent ?? 0) / 100;
    if (!avg) return 0;
    return avg * (1 + margin);
  };

  // Devolução do cliente usa custo médio atual (preenchido e bloqueado)
  useEffect(() => {
    if (
      watchedType === "RETURN_FROM_CLIENT" &&
      selectedProduct?.avgUnitCost != null
    ) {
      setValue("unitCost", Number(selectedProduct.avgUnitCost), {
        shouldValidate: true,
      });
    }
  }, [watchedType, selectedProduct?.avgUnitCost, setValue]);

  const onSubmit = async (data: StockMovementFormData) => {
    setIsLoading(true);
    // montar request apenas com campos relevantes
    const req: CreateStockMovementRequest = {
      productId: data.productId,
      type: StockMovementTypeEnum[data.type], // mantém compatibilidade com seu back
      quantity: String(data.quantity),
      description: data.description,
      userId: user!.id,
    };

    if (requiresSupplier) {
      // req.supplierId = data.supplierId!;
      req.supplierId = selectedSupplier?.id;
    }

    if (requiresCost) {
      req.unitCost = String(data.unitCost);
    }

    if (requiresSalePrice) {
      req.unitSalePrice = String(data.unitSalePrice);
    } else if (showSalePriceOptional && data.unitSalePrice != null) {
      req.unitSalePrice = String(data.unitSalePrice);
    }

    try {
      await stockMovementApi.createMovement(req);
      toast.success("Movimentação registrada.");
      reset();
      setSelectedProduct(null);
      navigate("/movements");
    } catch {
      toast.error("Tente novamente em alguns instantes.");
    } finally {
      setIsLoading(false);
    }
  };

  const getSuppliers = async () => {
    try {
      const response = await supplierApi.get({
        page: 1,
        perPage: 30,
        searchTerm: supplierSearch,
      });
      setSuppliers(response.data.data);
    } catch {
      setSuppliers([]);
      toast.error("Erro ao carregar fornecedores");
    }
  };

  useEffect(() => {
    getSuppliers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplierSearch]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Nova Movimentação de Estoque
        </CardTitle>
        <CardDescription>
          Registre entradas e saídas de produtos no estoque
        </CardDescription>
      </CardHeader>
      <CardContent>
        <HiddenRegistrations />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Product + Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Produto */}
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
              {errors.productId && (
                <p className="text-sm text-destructive">
                  {errors.productId.message}
                </p>
              )}
            </div>

            {/* Tipo */}
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Movimentação *</Label>
              <Select
                onValueChange={(value) =>
                  setValue("type", value as StockMovementType, {
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(movementTypeConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <Badge className={config.color}>{config.label}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-destructive">
                  {errors.type.message}
                </p>
              )}
            </div>
          </div>

          {/* Info do Produto */}
          {selectedProduct && (
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Produto:</span>
                    <p className="text-muted-foreground">
                      {selectedProduct.name}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Estoque Atual:</span>
                    <p className="text-muted-foreground">
                      {selectedProduct.stockOnHand ?? 0}{" "}
                      {selectedProduct.unit?.toLowerCase?.() ? "" : "unidades"}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">Custo Médio:</span>
                    <p className="text-muted-foreground">
                      {selectedProduct.avgUnitCost != null
                        ? `R$ ${Number(selectedProduct.avgUnitCost).toFixed(2)}`
                        : "—"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quantidade + Preços */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quantidade */}
            <div className="space-y-2">
              <Label htmlFor="quantity">
                Quantidade {selectedProduct ? `(${selectedProduct.unit})` : ""}{" "}
                *
              </Label>
              <Input
                id="quantity"
                type="number"
                min={quantityMin}
                step={quantityStep}
                placeholder="Digite a quantidade"
                {...register("quantity", {
                  required: "Quantidade é obrigatória",
                  min: {
                    value: Number(quantityMin),
                    message: `Quantidade deve ser ≥ ${quantityMin}`,
                  },
                })}
              />
              {errors.quantity && (
                <p className="text-sm text-destructive">
                  {errors.quantity.message}
                </p>
              )}
              {hasInsufficientStock && (
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    Estoque insuficiente! Disponível:{" "}
                    {selectedProduct?.stockOnHand}{" "}
                    {selectedProduct?.unit ?? "un"}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Custo Unitário (entradas / devolução cliente travada) */}
            <div className="space-y-2">
              {requiresCost ? (
                <>
                  <Label htmlFor="unitCost">
                    Custo Unitário{" "}
                    {watchedType === "RETURN_FROM_CLIENT"
                      ? "(custo médio atual)"
                      : "*"}
                  </Label>
                  <Input
                    id="unitCost"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="R$ 0,00"
                    readOnly={watchedType === "RETURN_FROM_CLIENT"}
                    {...register("unitCost", {
                      required:
                        watchedType === "RETURN_FROM_CLIENT"
                          ? false
                          : "Custo unitário é obrigatório para este tipo",
                    })}
                  />
                  {errors.unitCost && (
                    <p className="text-sm text-destructive">
                      {errors.unitCost.message}
                    </p>
                  )}
                  {watchedType === "RETURN_FROM_CLIENT" && (
                    <p className="text-xs text-muted-foreground">
                      Usando o custo médio atual do produto para recompor o
                      estoque.
                    </p>
                  )}
                </>
              ) : (
                <div />
              )}
            </div>

            {/* Preço de Venda (obrigatório em PURCHASE/SALE; opcional em ADJUST_IN/RETURN_FROM_CLIENT) */}
            <div className="space-y-2">
              {requiresSalePrice || showSalePriceOptional ? (
                <>
                  <Label htmlFor="unitSalePrice">
                    Preço de Venda {requiresSalePrice ? "*" : "(opcional)"}
                  </Label>
                  <Input
                    id="unitSalePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder={
                      selectedProduct
                        ? `R$ ${getSuggestedSalePrice().toFixed(2)} (sugerido)`
                        : "R$ 0,00"
                    }
                    {...register("unitSalePrice", {
                      required: requiresSalePrice
                        ? "Preço de venda é obrigatório para este tipo"
                        : false,
                    })}
                  />
                  {errors.unitSalePrice && (
                    <p className="text-sm text-destructive">
                      {errors.unitSalePrice.message}
                    </p>
                  )}
                  {!requiresSalePrice && (
                    <p className="text-xs text-muted-foreground">
                      Opcional. Se não informado, podemos usar o preço sugerido
                      baseado na margem.
                    </p>
                  )}
                </>
              ) : (
                <div />
              )}
            </div>
          </div>

          {/* Fornecedor (quando necessário) */}
          {requiresSupplier && (
            <div className="space-y-2">
              <Label htmlFor="product">Fornecedor *</Label>
              <InputAutoComplete
                placeholder="Buscar fornecedor..."
                value={productSearch}
                onChange={setSupplierSearch}
                onSelect={handleSupplierSelect}
                options={suppliers}
                selectedOption={selectedSupplier}
                debounceMs={300}
                maxResults={10}
                emptyMessage="Nenhum fornecedor encontrado"
                allOptionLabel="Todos os fornecedores"
                clearOnSelect={true}
              />
              {errors.productId && (
                <p className="text-sm text-destructive">
                  {errors.supplierId?.message}
                </p>
              )}
            </div>
          )}

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Observações sobre a movimentação (opcional)"
              rows={3}
              {...register("description")}
            />
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading || !!hasInsufficientStock}
              className="flex-1"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Movimentação
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setSelectedProduct(null);
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
