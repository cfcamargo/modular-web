import { productApi } from "@/api";
import { ProductRequest } from "@/models/requests/product-request";
import { ProductResponse } from "@/models/responses/product-response";
import { useUserLoggedStore } from "@/store/auth/user-logged";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import ProductForm from "./components/product-form";

export default function EditProduct() {

  const { id } = useParams();

  const [loadingDetails, setLoadingDetails] = useState(true);
  const [product, setProduct] = useState<ProductResponse | null>(null);

  const navigate = useNavigate();

  const getProductDetails = useCallback(async () => {
    await productApi
      .getDetails(id!)
      .then((resp) => {
        setProduct(resp.data);
      })
      .catch(() => {
        toast.error("Erro ao buscar o produto");
      })
      .finally(() => {
        setLoadingDetails(false);
      });
  }, []);

  const saveProduct = async (product: ProductRequest) => {
    console.log(product);
    await productApi
      .update(product, id!)
      .then(() => {
        toast.success("Produto atualizado com sucesso");
        navigate(`/products/${id}`);
      })
      .catch((error) => {
        const message = getErrorMessage(error);
        toast.error(message ?? "Erro ao atualizar o produto");
      });
  };

  useEffect(() => {
    getProductDetails();
  }, []);

  return (
    <>
      <Helmet title="Editar Produto" />
      {!loadingDetails && product && (
        <ProductForm
          pageTitle="Editar Produto"
          isLoading={false}
          onSubmit={saveProduct}
          isEditMode={true}
          isEditScreen={true}
          initialData={{
            ...product,
            initialStock: product.stockOnHand,
          }}
        />
      )}
    </>
  );
}
