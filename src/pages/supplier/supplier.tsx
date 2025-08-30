import { useState } from "react";
import { Button } from "@/components/ui/button";
import TableFilter from "@/components/shared/table-filter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import {
  SupplierTableRow,
  SupplierResponse,
} from "./components/supplier-table-row";

// Dados mock para fornecedores
const mockSuppliers: SupplierResponse[] = [
  {
    id: "1",
    document: "12.345.678/0001-90",
    name: "Fornecedor ABC Ltda",
    status: "active",
  },
  {
    id: "2",
    document: "98.765.432/0001-10",
    name: "Distribuidora XYZ S.A.",
    status: "active",
  },
  {
    id: "3",
    document: "123.456.789-00",
    name: "João Silva - MEI",
    status: "inactive",
  },
  {
    id: "4",
    document: "11.222.333/0001-44",
    name: "Empresa Beta Comércio",
    status: "active",
  },
  {
    id: "5",
    document: "987.654.321-11",
    name: "Maria Santos - Autônoma",
    status: "active",
  },
];

export default function Supplier() {
  const [suppliers] = useState<SupplierResponse[]>(mockSuppliers);

  const handleViewDetails = (supplier: SupplierResponse) => {
    console.log("Ver detalhes do fornecedor:", supplier);
  };

  const handleDelete = (supplier: SupplierResponse) => {
    console.log("Excluir fornecedor:", supplier);
  };

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

      <div className="space-y-2.5">
        <TableFilter
          disabled={suppliers.length === 0}
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
              {suppliers.map((supplier) => {
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
        {suppliers.length === 0 && (
          <div className="w-full py-8 flex justify-center">
            <span className="text-zinc-600">Sem fornecedores cadastrados</span>
          </div>
        )}
      </div>
    </div>
  );
}
