import { Helmet } from "react-helmet-async";
import { ClientForm } from "./components/client-form";
import { useCallback, useEffect, useState } from "react";
import { ClientRequest } from "@/models/requests/client-request";
import { clientApi } from "@/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function ClientDetails() {
  const [loading, setLoading] = useState(true);
  const [clientData, setClientData] = useState<ClientRequest | null>(null);

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
    </>
  );
}
