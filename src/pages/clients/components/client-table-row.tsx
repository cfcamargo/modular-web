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
import { ClientResponse } from "@/models/responses/client-response";
import { useUserLoggedStore } from "@/store/auth/user-logged";
import { RoleEnum } from "@/utils/enums/RoleEnum";
import { Pen, Search, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

interface ClientTableRowProps {
  readonly client: ClientResponse;
  readonly destroyClient: () => void;
}

export default function ClientTableRow({
  client,
  destroyClient,
}: ClientTableRowProps) {
  const userLoggedStore = useUserLoggedStore();

  return (
    <TableRow>
      <TableCell className="text-muted-foreground">{client.name}</TableCell>
      <TableCell>{client.document}</TableCell>
      <TableCell className="font-medium">
        {client.type?.toUpperCase()}
      </TableCell>
      <TableCell className="flex gap-4 items-center">
        <Button variant="outline" asChild>
          <Link to={`/clients/${client.id}`}>
            <Search className="h-3 w-3" />
            <span className="sr-only">Detalhes do cliente</span>
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to={`/clients/${client.id}/edit`}>
            <Pen className="h-3 w-3" />
            <span className="sr-only">Editar do cliente</span>
          </Link>
        </Button>
        {userLoggedStore.user?.role === RoleEnum.AMDMIN && (
          <AlertDialog>
            <Button asChild variant="outline">
              <AlertDialogTrigger>
                <Trash2 className="h-3 w-3" />
              </AlertDialogTrigger>
            </Button>
            <AlertDialogContent>
              <AlertDialogTitle>
                Tem certeza que deseja deletar o cliente?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Ao confirmar essa ação, o cliente{" "}
                <span className="text-rose-600">{client.name}</span> sera
                excluido permanentemente. Esta acão não pode ser desfeita !
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={destroyClient}>
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
