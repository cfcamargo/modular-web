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
import { useUserLoggedStore } from "@/store/auth/user-logged";
import { RoleEnum } from "@/utils/enums/RoleEnum";
import { Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

interface ClientTableRowProps {
  readonly product: ProductResponse;
  readonly destroyProduct: () => void;
}

export default function ProductTableRow({
  product,
  destroyProduct,
}: ClientTableRowProps) {
  const { user } = useUserLoggedStore();

  return (
    <TableRow>
      <TableCell className="text-muted-foreground">{product.name}</TableCell>
      <TableCell className="text-muted-foreground">{product.price}</TableCell>
      <TableCell className="text-left">{product.unit}</TableCell>
      <TableCell className="text-left">{product.stockOnHand}</TableCell>
      <TableCell className="text-left">{product.description}</TableCell>
      <TableCell className="flex gap-2 items-center justify-start">
        <Button variant="outline" asChild>
          <Link to={`/products/${product.id}`}>
            <Search className="h-3 w-3" />
            <span className="sr-only">Detalhes do Produto</span>
          </Link>
        </Button>
        {user?.role === RoleEnum.AMDMIN && (
          <AlertDialog>
            <Button asChild variant="outline">
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
        )}
      </TableCell>
    </TableRow>
  );
}
