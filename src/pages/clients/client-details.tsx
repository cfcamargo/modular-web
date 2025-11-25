import { Helmet } from "react-helmet-async";
import { ClientForm } from "./components/client-form";
import { useCallback, useEffect, useState } from "react";
import { ClientRequest } from "@/models/requests/client-request";
import { clientApi } from "@/api";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useUserLoggedStore } from "@/store/auth/user-logged";
import { RoleEnum } from "@/utils/enums/RoleEnum";
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

export default function ClientDetails() {
  const [loading, setLoading] = useState(true);
  const [clientData, setClientData] = useState<ClientRequest | null>(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUserLoggedStore();

  const handleGetDetails = useCallback(async () => {
    await clientApi
      .getDetails(id!)
      .then((response) => {
        setClientData(response.data);
      })
      .catch(() => {
        toast.error("Cliente não encontrado");
        navigate("/clients");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    handleGetDetails();
  }, []);

  const destroyClient = async () => {
    clientApi
      .destroy(String(clientData?.id))
      .then(() => {
        toast.success(`O cliente ${clientData?.name} foi deletado com sucesso`);
        navigate("/clients");
      })
      .catch(() => {
        toast.error("Erro ao deletar cliente");
      });
  };

  const handleEdit = async (data: ClientRequest) => {};

  return (
    <>
      <Helmet title="Detalhes do Cliente" />
      {!loading && clientData && (
        <ClientForm
          pageTitle="Detalhes do cliente"
          isLoading={false}
          onSubmit={handleEdit}
          initialData={clientData!}
          isEditMode={false}
        />
      )}
      <div className="mt-2 flex justify-end gap-2">
        <Button variant={"outline"} className="xs:w-full md:w-auto" asChild>
          <NavLink to={`/clients/${clientData?.id}`}>Editar</NavLink>
        </Button>
        {user?.role === RoleEnum.AMDMIN && (
          <AlertDialog>
            <Button
              asChild
              variant="destructive"
              className="xs:w-full md:w-auto"
            >
              <AlertDialogTrigger>Deletar</AlertDialogTrigger>
            </Button>
            <AlertDialogContent>
              <AlertDialogTitle>
                Tem certeza que deseja deletar o cliente?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Ao confirmar essa ação, o cliente{" "}
                <span className="text-rose-600">{clientData?.name}</span> sera
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
      </div>
    </>
  );
}
