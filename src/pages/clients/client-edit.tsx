import { Helmet } from "react-helmet-async";
import { ClientForm } from "./components/client-form";
import { useCallback, useEffect, useState } from "react";
import { clientApi } from "@/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ClientResponse } from "@/models/responses/client-response";
import { getErrorMessage } from "@/utils/getErrorMessage";

export default function ClientEdit() {
  const [loading, setLoading] = useState(true);
  const [clientData, setClientData] = useState<ClientResponse | null>(null);
  const [submitLoagind, setSubmitLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

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

  const handleCreate = async (data: ClientResponse) => {
    setSubmitLoading(true);
    const { id, createdAt, updatedAt, ...rest } = data;
    await clientApi
      .update(rest, id!)
      .then(() => {
        toast.success("Cliente atualizado com sucesso!");
        navigate(`/clients/${clientData?.id}`);
      })
      .catch((error) => {
        const message = getErrorMessage(error);
        toast.error(message);
      })
      .then(() => {
        setSubmitLoading(false);
      });
  };

  return (
    <>
      <Helmet title="Detalhes do Cliente" />
      {!loading && clientData && (
        <ClientForm
          pageTitle="Detalhes Cliente"
          isLoading={submitLoagind}
          onSubmit={handleCreate}
          initialData={clientData!}
        />
      )}
    </>
  );
}
