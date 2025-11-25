import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { Edit, Package, Trash, Layers, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { productApi } from "@/api";
import LoadingAnimation from "@/components/shared/loading-animation";
import Pagination from "@/components/shared/pagination";
import { SearchInput } from "@/components/shared/search-input";
import ProductTableRow from "./components/product-table-row";

import { MetaProps } from "@/models/responses/meta-response";
import { ProductResponse } from "@/models/responses/product-response";
import { GridRequest } from "@/models/requests/grid-request";
import { PaginationEnum } from "@/utils/enums/PaginationEnum";
import { getErrorMessage } from "@/utils/getErrorMessage";

export function Products() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [meta, setMeta] = useState<MetaProps | null>(null);

  const navigate = useNavigate();

  const getProducts = useCallback(async (page: number = 1, filter?: string) => {
    const productPayload: GridRequest = {
      page,
      perPage: PaginationEnum.PER_PAGE20,
      searchTerm: filter ?? "",
    };

    setLoading(true);
    productApi
      .get(productPayload)
      .then((response) => {
        const metaData: MetaProps = {
          lastPage: response.data.meta.lastPage,
          page: Number(response.data.meta.page),
          perPage: Number(response.data.meta.perPage),
          total: response.data.meta.total,
        };
        setProducts(response.data.products);
        setMeta(metaData);
      })
      .catch(() => {
        toast.error("Erro ao buscar produtos");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const destroyProduct = async (product: ProductResponse) => {
    await productApi
      .destroy(product.id)
      .then(() => {
        toast.success("Produto excluído com sucesso");
        getProducts(meta?.page);
      })
      .catch((error) => {
        const message = getErrorMessage(error);
        toast.error(message ?? "Erro ao excluir o produto");
      });
  };

  const handleSearch = useCallback(
    (term: string) => {
      getProducts(1, term);
    },
    [getProducts]
  );

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  // Formatador de moeda para uso nos cards mobile
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <>
      <Helmet title="Produtos" />
      <div className="flex flex-col gap-4 pb-20 md:pb-0">
        <div className="w-full flex flex-col xs:flex-row justify-between items-start xs:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tighter">
            Produtos Cadastrados
          </h1>
          <div className="flex gap-2 w-full xs:w-auto">
            <Button
              className="h-10 xs:h-9 w-full xs:w-auto"
              asChild
              disabled={loading}
            >
              <Link to="/products/create">Novo Produto</Link>
            </Button>
          </div>
        </div>

        <div className="space-y-2.5">
          <SearchInput onSearch={handleSearch} />

          <div className="rounded-md border-none md:border">
            {loading ? (
              <div className="w-full h-40 flex justify-center items-center">
                <LoadingAnimation />
              </div>
            ) : (
              <>
                {/* --- VISUALIZAÇÃO MOBILE (CARDS) --- */}
                {/* Usa md:hidden para esconder em telas médias/grandes */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {products.map((product) => (
                    <NavLink to={`/products/${product.id}`}>
                      <Card
                        key={product.id}
                        className="shadow-sm border-l-4 border-l-primary/20"
                      >
                        <CardHeader className="p-4 pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg leading-tight">
                                {product.name}
                              </h3>
                              <Badge
                                variant="secondary"
                                className="mt-1.5 font-mono text-xs"
                              >
                                {formatCurrency(product.price)}
                              </Badge>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-xs shrink-0 ml-2"
                            >
                              {product.unit}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-2 pb-3 space-y-3">
                          <div className="flex items-center justify-between text-sm bg-muted/20 p-2 rounded">
                            <span className="text-muted-foreground flex items-center gap-1.5">
                              <Layers className="w-4 h-4" /> Estoque Atual:
                            </span>
                            <span className="font-semibold">
                              {product.stockOnHand}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </NavLink>
                  ))}
                </div>

                <div className="hidden md:block border rounded-md bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead className="w-[100px]">Unidade</TableHead>
                        <TableHead className="w-[100px]">Em estoque</TableHead>
                        <TableHead className="flex-1 overflow-ellipsis">
                          Descrição
                        </TableHead>
                        <TableHead className="w-[300px]">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => {
                        return (
                          <ProductTableRow
                            product={product}
                            key={product.id}
                            destroyProduct={() => destroyProduct(product)}
                          />
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </div>

          {meta && products.length > 0 && (
            <Pagination
              pageIndex={meta.page}
              totalCount={meta.total}
              perPage={meta.perPage}
              meta={meta}
              getData={getProducts}
            />
          )}

          {products.length === 0 && !loading && (
            <div className="w-full py-8 flex justify-center border rounded-lg border-dashed bg-muted/10">
              <span className="text-zinc-600 flex items-center gap-2">
                <Package className="w-4 h-4" /> Sem produtos cadastrados
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
