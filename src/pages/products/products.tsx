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

export function Products() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [meta, setMeta] = useState<MetaProps | null>();

  const getProducts = async (page: number = 1) => {
    setLoading(true);
    productApi
      .get(page)
      .then((response) => {
        setProducts(response.data.products.data);
        setMeta(response.data.products.meta);
      })
      .catch((e) => {
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
          <Button className="h-8" asChild disabled={loading}>
            <Link to="/products/create">Novo Produto</Link>
          </Button>
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
                    <TableHead className="w-[140px]">ID</TableHead>
                    <TableHead>Nome do Produto</TableHead>
                    <TableHead className="w-[140px]">Fabricante</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead></TableHead>
                    <TableHead></TableHead>
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
              pageIndex={meta.currentPage}
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
