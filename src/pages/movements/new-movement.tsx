"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Package, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { ProductResponse } from "@/models/responses/product-response"
import { InputAutoComplete } from "@/components/shared/input-auto-complete"
import { productApi } from "@/api"

// Types
type StockMovementType = "PURCHASE" | "SALE" | "ADJUST_IN" | "ADJUST_OUT" | "RETURN_TO_SUPPLIER" | "RETURN_FROM_CLIENT"



interface Supplier {
  id: string
  name: string
}

interface StockMovementFormData {
  productId: string
  type: StockMovementType
  quantity: number
  unitCost?: number
  unitSalePrice?: number
  supplierId?: string
  description?: string
}

const mockSuppliers: Supplier[] = [
  { id: "1", name: "Fornecedor Tech Ltda" },
  { id: "2", name: "Distribuidora Digital" },
  { id: "3", name: "Importadora Global" },
]

const movementTypeConfig = {
  PURCHASE: { label: "Compra", color: "bg-green-100 text-green-800", isEntry: true },
  SALE: { label: "Venda", color: "bg-red-100 text-red-800", isEntry: false },
  ADJUST_IN: { label: "Ajuste Entrada", color: "bg-blue-100 text-blue-800", isEntry: true },
  ADJUST_OUT: { label: "Ajuste Saída", color: "bg-orange-100 text-orange-800", isEntry: false },
  RETURN_TO_SUPPLIER: { label: "Devolução p/ Fornecedor", color: "bg-purple-100 text-purple-800", isEntry: false },
  RETURN_FROM_CLIENT: { label: "Devolução de Cliente", color: "bg-teal-100 text-teal-800", isEntry: true },
}

export default function NewMovement() {
  const [isLoading, setIsLoading] = useState(false)


  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null)
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [productSearch, setProductSearch] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<StockMovementFormData>()

  const watchedType = watch("type")
  const watchedQuantity = watch("quantity")
  const watchedProductId = watch("productId")

  // Update selected product when productId changes
  const handleProductSelect = (product: ProductResponse | null) => {
    if (product) {
      setSelectedProduct(product)
      setValue("productId", product.id)
    } else {
      setSelectedProduct(null)
      setValue("productId", "")
    }
  }

  const loadProducts = async () => {
    try {
      const response = await productApi.get({
        page: 1,
        perPage: 30,
        searchTerm: productSearch,
      });
      setProducts(response.data.data);
    } catch (error) {
      toast.error("Erro ao carregar produtos");
    }
  };

  useEffect(() => {
    loadProducts();
  }, [productSearch]);

  // Calculate suggested sale price
  const getSuggestedSalePrice = () => {
    if (!selectedProduct) return 0
    // return selectedProduct. * (1 + selectedProduct.marginPercent)
    return 10
  }

  // Check if movement type requires supplier
  const requiresSupplier = watchedType === "PURCHASE" || watchedType === "RETURN_TO_SUPPLIER"

  // Check if it's an entry or exit movement
  const isEntryMovement = watchedType ? movementTypeConfig[watchedType].isEntry : false

  // Check stock availability for exit movements
  const hasInsufficientStock = !isEntryMovement && selectedProduct && watchedQuantity > selectedProduct.stockOnHand

  const onSubmit = async (data: StockMovementFormData) => {
    setIsLoading(true)

    try {
      // Mock API call
      console.log("Dados do formulário:", {
        ...data,
        product: selectedProduct,
        suggestedSalePrice: getSuggestedSalePrice(),
      })

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success(`${movementTypeConfig[data.type].label} de ${data.quantity} unidades registrada.`,)

      reset()
      setSelectedProduct(null)
    } catch (error) {
      toast.error("Tente novamente em alguns instantes.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Nova Movimentação de Estoque
        </CardTitle>
        <CardDescription>Registre entradas e saídas de produtos no estoque</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Product Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {/* Movement Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Movimentação *</Label>
              <Select onValueChange={(value) => setValue("type", value as StockMovementType)}>
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
              {errors.type && <p className="text-sm text-destructive">Tipo é obrigatório</p>}
            </div>
          </div>

          {/* Product Info Display */}
          {selectedProduct && (
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Produto:</span>
                    <p className="text-muted-foreground">{selectedProduct.name}</p>
                  </div>
                  <div>
                    <span className="font-medium">Estoque Atual:</span>
                    <p className="text-muted-foreground">{selectedProduct.stockOnHand ?? 0} unidades</p>
                  </div>
                  <div>
                    <span className="font-medium">Custo Médio:</span>
                    {/* <p className="text-muted-foreground">R$ {selectedProduct.avgUnitCost?.toFixed(2) ?? 0}</p> */}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quantity and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade{selectedProduct && `(${selectedProduct.unit})`} *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                step="1"
                placeholder="Digite a quantidade"
                {...register("quantity", {
                  required: "Quantidade é obrigatória",
                  min: { value: 1, message: "Quantidade deve ser maior que 0" },
                })}
              />
              {errors.quantity && <p className="text-sm text-destructive">{errors.quantity.message}</p>}
              {hasInsufficientStock && (
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    Estoque insuficiente! Disponível: {selectedProduct?.stockOnHand} unidades
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Unit Cost/Price */}
            <div className="space-y-2">
              {isEntryMovement ? (
                <>
                  <Label htmlFor="unitCost">Custo Unitário *</Label>
                  <Input
                    id="unitCost"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="R$ 0,00"
                    {...register("unitCost", {
                      required: "Custo unitário é obrigatório para entradas",
                    })}
                  />
                  {errors.unitCost && <p className="text-sm text-destructive">{errors.unitCost.message}</p>}
                </>
              ) : (
                <>
                  <Label htmlFor="unitSalePrice">Preço de Venda</Label>
                  <Input
                    id="unitSalePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder={selectedProduct ? `R$ ${getSuggestedSalePrice().toFixed(2)} (sugerido)` : "R$ 0,00"}
                    {...register("unitSalePrice")}
                  />
                  <p className="text-xs text-muted-foreground">
                    Opcional. Se não informado, será usado o preço sugerido baseado na margem.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Supplier (conditional) */}
          {requiresSupplier && (
            <div className="space-y-2">
              <Label htmlFor="supplierId">Fornecedor *</Label>
              <Select onValueChange={(value) => setValue("supplierId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  {mockSuppliers.map((supplier) => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Observações sobre a movimentação (opcional)"
              rows={3}
              {...register("description")}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button type="submit" disabled={isLoading || !!hasInsufficientStock} className="flex-1">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Movimentação
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset()
                setSelectedProduct(null)
              }}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
