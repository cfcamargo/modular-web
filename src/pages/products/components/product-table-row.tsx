import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { ProductResponse } from "@/models/responses/product-response";
import { Pen, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

interface ClientTableRowProps {
  readonly product: ProductResponse;
  readonly destroyProduct: () => void;
}

export default function ProductTableRow({
  product,
  destroyProduct,
}: ClientTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-mono text-xs font-medium">
        {product.id}
      </TableCell>
      <TableCell className="text-muted-foreground">{product.name}</TableCell>
      <TableCell>{product.brand}</TableCell>
      <TableCell className="font-medium">{product.price}</TableCell>
      <TableCell className="font-medium">{product.quantity}</TableCell>
      <TableCell className="flex gap-4 items-center">
        <Button variant="outline" asChild size="xs">
          <Link to={`/products/${product.id}`}>
            <Search className="h-3 w-3" />
            <span className="sr-only">Detalhes do Produto</span>
          </Link>
        </Button>
        <Button variant="outline" asChild size="xs">
          <Link to={`/products/${product.id}/edit`}>
            <Pen className="h-3 w-3" />
            <span className="sr-only">Editar produto</span>
          </Link>
        </Button>
        <AlertDialog>
          <Button asChild variant="outline" size="xs">
            <AlertDialogTrigger>
              <Trash2 className="h-3 w-3" />
            </AlertDialogTrigger>
          </Button>
          <AlertDialogContent>
            <AlertDialogTitle>
              Tem certeza que deseja deletar o produto?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Ao confirmar essa ação, o produto{" "}
              <span className="text-rose-600">{product.name}</span> sera
              excluido permanentemente. Esta acão não pode ser desfeita !
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={destroyProduct}>
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
}
