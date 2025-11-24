import { Helmet } from "react-helmet-async";
import ProductForm from "./components/product-form";
import { productApi } from "@/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { ProductRequest } from "@/models/requests/product-request";

export default function NewProduct() {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleCreate = async (data: ProductRequest) => {
    setIsLoading(true);
    await productApi
      .save(data)
      .then((resp) => {
        console.log("Produto criado com sucesso", resp.data);
        toast.success("Produto criado com sucesso!");
        navigate("/products");
      })
      .catch((error) => {
        console.log(error);
        const message = getErrorMessage(error);
        toast.error(message ?? "Erro ao criar produto ");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Helmet title="Novo Produto" />
      <ProductForm
        pageTitle="Novo Produto"
        isLoading={isLoading}
        onSubmit={handleCreate}
      />
    </>
  );
}
