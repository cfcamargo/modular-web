import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import TableFilter from "@/components/shared/table-filter";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { SupplierTableRow } from "./components/supplier-table-row";
import { PaginationEnum } from "@/utils/enums/PaginationEnum";
import { GridRequest } from "@/models/requests/grid-request";
import { supplierApi } from "@/api";
import { MetaProps } from "@/models/responses/meta-response";
import { toast } from "sonner";
import { SupplierResponse } from "@/models/responses/supplier-response";
import Pagination from "@/components/shared/pagination";

export default function Supplier() {
  const [suppliers, setSuppliers] = useState<SupplierResponse[]>();
  const [meta, setMeta] = useState<MetaProps | null>(null);
  const [loading, setLoading] = useState(false);

  const handleViewDetails = (supplier: SupplierResponse) => {
    console.log("Ver detalhes do fornecedor:", supplier);
  };

  const handleDelete = (supplier: SupplierResponse) => {
    console.log("Excluir fornecedor:", supplier);
  };

  const getSuppliers = async (page: number = 1, filter?: string) => {
    const productPaylod: GridRequest = {
      page,
      perPage: PaginationEnum.PER_PAGE20,
      searchTerm: filter ?? "",
    };

    setLoading(true);
    supplierApi
      .get(productPaylod)
      .then((response) => {
        let meta: MetaProps = {
          lastPage: response.data.lastPage,
          page: Number(response.data.page),
          perPage: Number(response.data.perPage),
          total: response.data.total,
        };
        setSuppliers(response.data.data);
        setMeta(meta);
      })
      .catch(() => {
        toast.error("Erro ao buscar fornecedores");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getSuppliers();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tighter">
          Fornecedores Cadastrados
        </h1>
        <div className="flex gap-2">
          <Button className="h-8" asChild>
            <Link to="/supplier/create">Novo Fornecedor</Link>
          </Button>
        </div>
      </div>
      {!loading && (
        <div className="space-y-2.5">
          <TableFilter
            disabled={suppliers?.length === 0}
            description="Nome do fornecedor"
            onClearFilter={() => {}}
            onSubmitFilter={() => {}}
          />

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome/Razão Social</TableHead>
                  <TableHead>CPF/CNPJ</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[300px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suppliers?.map((supplier) => {
                  return (
                    <SupplierTableRow
                      supplier={supplier}
                      key={supplier.id}
                      onViewDetails={() => handleViewDetails(supplier)}
                      onDelete={() => handleDelete(supplier)}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {meta && suppliers && suppliers.length > 0 && (
            <Pagination
              pageIndex={meta.page}
              totalCount={meta.total}
              perPage={meta.perPage}
              meta={meta}
              getData={getSuppliers}
            />
          )}
          {suppliers?.length === 0 && (
            <div className="w-full py-8 flex justify-center">
              <span className="text-zinc-600">
                Sem fornecedores cadastrados
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
