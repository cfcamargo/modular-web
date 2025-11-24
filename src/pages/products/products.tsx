import { productApi } from "@/api";
import LoadingAnimation from "@/components/shared/loading-animation";
import Pagination from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MetaProps } from "@/models/responses/meta-response";
import { ProductResponse } from "@/models/responses/product-response";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ProductTableRow from "./components/product-table-row";
import { GridRequest } from "@/models/requests/grid-request";
import { PaginationEnum } from "@/utils/enums/PaginationEnum";
import { SearchInput } from "@/components/shared/search-input";
import { getErrorMessage } from "@/utils/getErrorMessage";

export function Products() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [meta, setMeta] = useState<MetaProps | null>();

  const navigate = useNavigate();

  const getProducts = useCallback(async (page: number = 1, filter?: string) => {
    const productPaylod: GridRequest = {
      page,
      perPage: PaginationEnum.PER_PAGE20,
      searchTerm: filter ?? "",
    };

    setLoading(true);
    productApi
      .get(productPaylod)
      .then((response) => {
        let meta: MetaProps = {
          lastPage: response.data.meta.lastPage,
          page: Number(response.data.meta.page),
          perPage: Number(response.data.meta.perPage),
          total: response.data.meta.total,
        };
        setProducts(response.data.products);
        setMeta(meta);
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
        toast.success("Produto deletado com sucesso");
        navigate("/products");
      })
      .catch((error) => {
        const message = getErrorMessage(error);
        toast.error(message ?? "Erro ao deletar o produto");
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
  }, []);

  return (
    <>
      <Helmet title="Produtos" />
      <div className="flex flex-col gap-4">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tighter">
            Produtos Cadastrados
          </h1>
          <div className="flex gap-2">
            <Button className="h-8" asChild disabled={loading}>
              <Link to="/products/create">Novo Produto</Link>
            </Button>
          </div>
        </div>

        <div className="space-y-2.5">
          <SearchInput onSearch={handleSearch} />

          <div className="rounded-md border">
            {loading ? (
              <div className="w-full h-full flex justify-center items-center">
                <LoadingAnimation />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Preco</TableHead>
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
          {products.length === 0 && (
            <div className="w-full py-8 flex justify-center">
              <span className="text-zinc-600">Sem produtos cadastrados</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
