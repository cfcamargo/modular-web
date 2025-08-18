import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, Filter, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { StockMovementResponse } from "@/models/responses/stock-movement-response";
import { ProductResponse } from "@/models/responses/product-response";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type MovementType = "ENTRY" | "EXIT" | "ADJUSTMENT";

export function Movements() {
  const [movements, setMovements] = useState<StockMovementResponse[]>([]);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState<MetaProps | null>();
  const [filters, setFilters] = useState({
    productId: "",
    type: undefined as MovementType | undefined,
    from: "",
    to: "",
  });
  const [productSearch, setProductSearch] = useState("");
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponse | null>(null);
  const [showProductDropdown, setShowProductDropdown] = useState(false);

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

  const getMovementTypeLabel = (type: string) => {
    const types = {
      ENTRY: "Entrada",
      EXIT: "Saída",
      ADJUSTMENT: "Ajuste",
    };
    return types[type as keyof typeof types] || type;
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

  const formatCurrency = (value?: number) => {
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

  const filteredProducts = useMemo(() => {
    if (!productSearch) return []; // Não mostra produtos se não há busca
    return products
      .filter((product) =>
        product.name.toLowerCase().includes(productSearch.toLowerCase())
      )
      .slice(0, 10); // Limita a 10 resultados
  }, [products, productSearch]);

  const handleProductSelect = (product: ProductResponse | null) => {
    setSelectedProduct(product);
    setFilters((prev) => ({
      ...prev,
      productId: product ? product.id.toString() : "",
    }));
    setProductSearch(""); // Limpa o campo de busca após seleção
    setShowProductDropdown(false);
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
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar produto..."
                        value={productSearch}
                        onChange={(e) => {
                          setProductSearch(e.target.value);
                          setShowProductDropdown(true);
                          if (!e.target.value) {
                            handleProductSelect(null);
                          }
                        }}
                        onFocus={() => setShowProductDropdown(true)}
                        onBlur={() =>
                          setTimeout(() => setShowProductDropdown(false), 200)
                        }
                        className="pl-10"
                      />
                      {showProductDropdown && productSearch && (
                        <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
                          <div className="p-2">
                            <div
                              className="px-3 py-2 text-sm cursor-pointer hover:bg-accent rounded-sm"
                              onClick={() => handleProductSelect(null)}
                            >
                              Todos os produtos
                            </div>
                            {filteredProducts.map((product) => (
                              <div
                                key={product.id}
                                className="px-3 py-2 text-sm cursor-pointer hover:bg-accent rounded-sm"
                                onClick={() => handleProductSelect(product)}
                              >
                                {product.name}
                              </div>
                            ))}
                            {filteredProducts.length === 0 && (
                              <div className="px-3 py-2 text-sm text-muted-foreground">
                                Nenhum produto encontrado
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    {selectedProduct && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Selecionado: {selectedProduct.name}
                      </div>
                    )}
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
                              : (value as MovementType),
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Todos os tipos" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os tipos</SelectItem>
                        <SelectItem value="ENTRY">Entrada</SelectItem>
                        <SelectItem value="EXIT">Saída</SelectItem>
                        <SelectItem value="ADJUSTMENT">Ajuste</SelectItem>
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
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Custo Unitário</TableHead>
                  <TableHead>Preço Unitário</TableHead>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Observação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.map((movement) => (
                  <TableRow key={movement.id}>
                    <TableCell>
                      {format(
                        new Date(movement.createdAt),
                        "dd/MM/yyyy HH:mm",
                        {
                          locale: ptBR,
                        }
                      )}
                    </TableCell>
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
                    <TableCell>{formatCurrency(movement.unitCost)}</TableCell>
                    <TableCell>
                      {formatCurrency(movement.unitSalePrice)}
                    </TableCell>
                    <TableCell>{movement.userId}</TableCell>
                    <TableCell>{movement.description || "-"}</TableCell>
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
