import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputAutoComplete } from "@/components/shared/input-auto-complete";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { stockMovementApi } from "@/api/stock-movement-api";
import { ProductApi } from "@/api/product-api";
import LoadingAnimation from "@/components/shared/loading-animation";
import Pagination from "@/components/shared/pagination";
import { MetaProps } from "@/models/responses/meta-response";

const productApi = new ProductApi();
import { ProductResponse } from "@/models/responses/product-response";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MovementReponse } from "@/models/responses/stock-movement-response";
import { StockMovementTypeEnum, StockMovementTypeEnumPT } from "@/utils/enums/StockMovementTypeEnum";
import { StockMovementType } from "@/models/common/stockMovementType";


export function Movements() {
  const [movements, setMovements] = useState<MovementReponse[]>([]);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState<MetaProps | null>();
  const [filters, setFilters] = useState({
    productId: "",
    type: undefined as StockMovementTypeEnum | undefined,
    from: "",
    to: "",
  });
  const [productSearch, setProductSearch] = useState("");
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponse | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    loadMovements();
  }, [filters]);

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

  const loadMovements = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await stockMovementApi.getMovements({
        ...filters,
        page,
        perPage: 20,
      });
      let metaData: MetaProps = {
        lastPage: response.totalPages,
        page: Number(response.page),
        perPage: Number(response.perPage),
        total: response.total,
      };
      setMovements(response.data);
      setMeta(metaData);
    } catch (error) {
      toast.error("Erro ao carregar movimentações");
    } finally {
      setLoading(false);
    }
  };

  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id.toString() === productId);
    return product?.name || "Produto não encontrado";
  };

  const getMovementTypeLabel = (type: StockMovementType) => {
    return StockMovementTypeEnumPT[type]
  };

  const getMovementTypeBadge = (type: string) => {
    const variants = {
      ENTRY: "default",
      EXIT: "destructive",
      ADJUSTMENT: "secondary",
    };
    return variants[type as keyof typeof variants] || "outline";
  };

  const formatQuantity = (quantity: number, type: string) => {
    if (type === "EXIT") {
      return `-${quantity}`;
    }
    return quantity.toString();
  };

  const formatCurrency = (value?: number | null) => {
    if (!value) return "-";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const clearFilters = () => {
    setFilters({
      productId: "",
      type: undefined,
      from: "",
      to: "",
    });
    setProductSearch("");
    setSelectedProduct(null);
  };

  const handleProductSelect = (product: ProductResponse | null) => {
    setSelectedProduct(product);
    setFilters((prev) => ({
      ...prev,
      productId: product ? product.id.toString() : "",
    }));
  };

  const hasActiveFilters =
    filters.productId || filters.type || filters.from || filters.to;

  const activeFiltersCount = [
    filters.productId,
    filters.type,
    filters.from,
    filters.to,
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tighter">
          Movimentações de Estoque
        </h1>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="relative h-8">
                <Filter className="mr-2 h-4 w-4" />
                Filtros
                {activeFiltersCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-white rounded-full min-w-[1.25rem] h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filtros</h4>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-auto p-1 text-xs"
                    >
                      <X className="mr-1 h-3 w-3" />
                      Limpar
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Produto
                    </label>
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

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Tipo
                    </label>
                    <Select
                      value={filters.type || "all"}
                      onValueChange={(value) =>
                        setFilters((prev) => ({
                          ...prev,
                          type:
                            value === "all"
                              ? undefined
                              : (value as StockMovementTypeEnum),
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos os tipos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os tipos</SelectItem>
                        <SelectItem value={StockMovementTypeEnum.PURCHASE}>Compra</SelectItem>
                        <SelectItem value={StockMovementTypeEnum.SALE}>Venda</SelectItem>
                        <SelectItem value={StockMovementTypeEnum.ADJUST_IN}>Ajuste Entrada</SelectItem>
                        <SelectItem value={StockMovementTypeEnum.ADJUST_OUT}>Ajuste Saída</SelectItem>
                        <SelectItem value={StockMovementTypeEnum.RETURN_FROM_CLIENT}>Retorno do cliente</SelectItem>
                        <SelectItem value={StockMovementTypeEnum.RETURN_TO_SUPPLIER}>Retorno para fornecedor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Data inicial
                    </label>
                    <Input
                      type="date"
                      value={filters.from || ""}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          from: e.target.value || "",
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Data final
                    </label>
                    <Input
                      type="date"
                      value={filters.to || ""}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          to: e.target.value || "",
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button className="h-8" asChild disabled={loading}>
            <Link to="/movements/new">
              <Plus className="mr-2 h-4 w-4" />
              Nova Movimentação
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="rounded-md border">
          {loading ? (
            <LoadingAnimation />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Tipo de Movimentaçao</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Preço Venda Unitário</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell>{getProductName(movement.productId)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={getMovementTypeBadge(movement.type) as any}
                      >
                        {getMovementTypeLabel(movement.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatQuantity(movement.quantity, movement.type)}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(movement.unitSalePrice)}
                    </TableCell>
                    <TableCell>
                      {format(
                        new Date(movement.createdAt),
                        "dd/MM/yyyy HH:mm",
                        {
                          locale: ptBR,
                        }
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {meta && movements.length > 0 && (
          <Pagination
            pageIndex={meta.page}
            totalCount={meta.total}
            perPage={meta.perPage}
            meta={meta}
            getData={loadMovements}
          />
        )}
        {movements.length === 0 && !loading && (
          <div className="w-full py-8 flex justify-center">
            <span className="text-zinc-600">
              Nenhuma movimentação encontrada
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
