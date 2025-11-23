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
import { UserResponse } from "@/models/responses/user-response";
import { Pen, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

interface ClientTableRowProps {
  readonly user: UserResponse;
  readonly destroyUser: () => void;
}

export default function UserTableRow({
  user,
  destroyUser,
}: ClientTableRowProps) {
  const getUserRole = (id: number) => {
    switch (id) {
      case 1:
        return "Administrador";
      case 2:
        return "Padrão";
      case 3:
        return "Motorista";
      default:
        return "Unknown";
    }
  };

  return (
    <TableRow>
      <TableCell className="text-muted-foreground">{user.fullName}</TableCell>
      <TableCell className="text-muted-foreground">
        {user.document ? user.document : "-"}
      </TableCell>
      <TableCell>{getUserRole(user.role)}</TableCell>
      <TableCell className="font-medium">{user.email}</TableCell>
      <TableCell className="font-medium">
        {new Date(user.createdAt).toLocaleDateString()}
      </TableCell>
      <TableCell className="flex gap-4 items-center">
        <Button variant="outline" asChild size="sm">
          <Link to={`/users/${user.id}`}>
            <Search className="h-3 w-3" />
            <span className="sr-only">Detalhes do Usuário</span>
          </Link>
        </Button>
        <Button variant="outline" asChild size="sm">
          <Link to={`/users/${user.id}/edit`}>
            <Pen className="h-3 w-3" />
            <span className="sr-only">Editar Usuário</span>
          </Link>
        </Button>
        <AlertDialog>
          <Button asChild variant="outline" size="sm">
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
              <span className="text-rose-600">{user.fullName}</span> sera
              excluido permanentemente. Esta acão não pode ser desfeita !
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={destroyUser}>
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
}
