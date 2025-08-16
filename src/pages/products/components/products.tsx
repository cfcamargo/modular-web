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

export function Products() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [meta, setMeta] = useState<MetaProps | null>();

  const getProducts = async (page: number = 1) => {
    setLoading(true);
    const request = {
      page,
      perPage: 10,
      searchTerm: ""
    };
    productApi
      .get(request)
      .then((response) => {
        setProducts(response.data.data);
        setMeta({
          page: response.data.page,
          perPage: response.data.perPage,
          total: response.data.total,
          lastPage: response.data.lastPage
        });
      })
      .catch(() => {
        toast.error("Erro ao buscar produtos");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <>
      <Helmet title="Products" />
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
                      // <ClientTableRow
                      //   client={product}
                      //   key={product.id}
                      //   destroyClient={() => destroyClient(client)}
                      // />
                      product.name
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
