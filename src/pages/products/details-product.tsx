import { Helmet } from "react-helmet-async";
import ProductForm from "./components/product-form";
import { ProductRequest } from "@/models/requests/product-request";
import { useCallback, useEffect, useState } from "react";
import { productApi } from "@/api";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ProductResponse } from "@/models/responses/product-response";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useUserLoggedStore } from "@/store/auth/user-logged";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@radix-ui/react-alert-dialog";
import { Trash2 } from "lucide-react";
import { AlertDialogFooter } from "@/components/ui/alert-dialog";
import { RoleEnum } from "@/utils/enums/RoleEnum";

export default function EditProduct() {
  const handleCreate = async (data: ProductRequest) => {};

  const { id } = useParams();

  const [loadingDetails, setLoadingDetails] = useState(true);
  const [product, setProduct] = useState<ProductResponse | null>(null);

  const navigate = useNavigate();
  const { user } = useUserLoggedStore();

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

  const destroyProduct = async (product: ProductResponse) => {
    await productApi
      .destroy(product.id)
      .then(() => {
        toast.success("Produto excluído com sucesso");
        navigate("/products");
      })
      .catch((error) => {
        const message = getErrorMessage(error);
        toast.error(message ?? "Erro ao excluir o produto");
      });
  };

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
      <div className="mt-2 flex justify-end gap-2">
        <Button variant={"outline"} className="xs:w-full md:w-auto" asChild>
          <NavLink to={`/products/${product?.id}`}>Editar</NavLink>
        </Button>
        {user?.role === RoleEnum.AMDMIN && (
          <AlertDialog>
            <Button
              asChild
              variant={"destructive"}
              className="xs:w-full md:w-auto"
            >
              <AlertDialogTrigger>Deletar</AlertDialogTrigger>
            </Button>
            <AlertDialogContent>
              <AlertDialogTitle>
                Tem certeza que deseja deletar o produto?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Ao confirmar essa ação, o produto{" "}
                <span className="text-rose-600">{product?.name}</span> sera
                excluido permanentemente. Esta acão não pode ser desfeita !
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => destroyProduct}>
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
