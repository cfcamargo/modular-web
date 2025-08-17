import { productApi } from "@/api";
import LoadingAnimation from "@/components/shared/loading-animation";
import Pagination from "@/components/shared/pagination";
import TableFilter from "@/components/shared/table-filter";
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
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import ProductTableRow from "./components/product-table-row";
import { GridRequest } from "@/models/requests/grid-request";
import { PaginationEnum } from "@/utils/enums/PaginationEnum";

export function Products() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [meta, setMeta] = useState<MetaProps | null>();

  const getProducts = async (page: number = 1, filter?: string) => {
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
          lastPage: response.data.lastPage,
          page: Number(response.data.page),
          perPage: Number(response.data.perPage),
          total: response.data.total,
        };
        setProducts(response.data.data);
        setMeta(meta);
      })
      .catch(() => {
        toast.error("Erro ao buscar produtos");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const destroyProduct = async (product: ProductResponse) => {
    console.log(product);
  };

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
          <TableFilter
            disabled={products.length === 0}
            description="Nome do produto"
            onClearFilter={() => {}}
            onSubmitFilter={() => {}}
          />

          <div className="rounded-md border">
            {loading ? (
              <LoadingAnimation />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead className="w-[100px]">Unidade</TableHead>
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
