import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import LoadingAnimation from "@/components/shared/loading-animation";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function QuoteList() {
  const [loading, setLoading] = useState(false);
  const [quotes, setQuotes] = useState([]);

  return (
    <>
      <Helmet title="Produtos" />
      <div className="flex flex-col gap-4">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tighter">Orcamentos</h1>
          <div className="flex gap-2">
            <Button className="h-8" asChild disabled={loading}>
              <Link to="/quotes/create">Novo Orcamento</Link>
            </Button>
          </div>
        </div>

        <div className="space-y-2.5">
          {/* <TableFilter
            disabled={products.length === 0}
            description="Nome do produto"
            onClearFilter={() => {}}
            onSubmitFilter={() => {}}
          /> */}

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
                    <TableHead className="w-[100px]">Em estoque</TableHead>
                    <TableHead className="flex-1 overflow-ellipsis">
                      Descrição
                    </TableHead>
                    <TableHead className="w-[300px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quotes.map((product) => {
                    return (
                      // <ProductTableRow
                      //   product={product}
                      //   key={product.id}
                      //   destroyProduct={() => {}}
                      // />
                      <p>oi</p>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
          {/* {meta && products.length > 0 && (
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
          )} */}
        </div>
      </div>
    </>
  );
}
