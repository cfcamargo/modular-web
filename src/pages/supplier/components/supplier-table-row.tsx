import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Eye, Trash2 } from "lucide-react";

export interface SupplierResponse {
  id: string;
  document: string; // CPF/CNPJ
  name: string; // Nome/Razão Social
  status: "active" | "inactive";
}

interface SupplierTableRowProps {
  supplier: SupplierResponse;
  onViewDetails?: (supplier: SupplierResponse) => void;
  onDelete?: (supplier: SupplierResponse) => void;
}

export function SupplierTableRow({
  supplier,
  onViewDetails,
  onDelete,
}: SupplierTableRowProps) {
  return (
    <TableRow>
      <TableCell>{supplier.name}</TableCell>
      <TableCell className="font-medium">{supplier.document}</TableCell>
      <TableCell>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            supplier.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {supplier.status === "active" ? "Ativo" : "Inativo"}
        </span>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails?.(supplier)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(supplier)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
