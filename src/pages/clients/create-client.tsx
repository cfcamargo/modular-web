import { useState } from "react";
import { toast } from "sonner";
import { clientApi } from "@/api";
import { ClientRequest } from "@/models/requests/client-request";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { Helmet } from "react-helmet-async";
import { ClientForm } from "./components/client-form";

export function CreateClient() {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleCreate = async (data: ClientRequest) => {
    setIsLoading(true);
    try {
      await clientApi.save(data);
      toast.success("Cliente cadastrado com sucesso!");
      navigate("/clients");
    } catch (error: any) {
      const message = getErrorMessage(error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet title="Novo Cliente" />
      <ClientForm
        pageTitle="Novo Cliente"
        isLoading={isLoading}
        onSubmit={handleCreate}
      />
    </>
  );
}
