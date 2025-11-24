import { Helmet } from "react-helmet-async";
import ProductForm from "./components/product-form";
import { ProductRequest } from "@/models/requests/product-request";
import { useCallback, useEffect, useState } from "react";
import { productApi } from "@/api";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { ProductResponse } from "@/models/responses/product-response";

export default function EditProduct() {
  const handleCreate = async (data: ProductRequest) => {};

  const { id } = useParams();

  const [loadingDetails, setLoadingDetails] = useState(true);
  const [product, setProduct] = useState<ProductResponse | null>(null);

  const getProductDetails = useCallback(async () => {
    await productApi
      .getDetails(id!)
      .then((resp) => {
        setProduct(resp.data);
      })
      .catch((err) => {
        toast.error("Erro ao buscar o produto");
      })
      .finally(() => {
        setLoadingDetails(false);
      });
  }, []);

  useEffect(() => {
    getProductDetails();
  }, []);

  return (
    <>
      <Helmet title="Detalhes do Produto" />
      {!loadingDetails && product && (
        <ProductForm
          pageTitle="Detalhes do Produto"
          isLoading={false}
          onSubmit={handleCreate}
          isEditMode={false}
          initialData={product}
        />
      )}
    </>
  );
}
