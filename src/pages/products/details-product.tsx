import { productApi } from "@/api";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductResponse } from "@/models/responses/product-response";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export function DetailsProduct() {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<ProductResponse>();
  const { id } = useParams();

  const navigate = useNavigate();

  const getProductDetails = () => {
    setLoading(true);
    productApi
      .getDetails(Number(id))
      .then((response) => {
        setProduct(response.data.product);
        console.log(response.data);
      })
      .catch((e) => {
        if (e.status === 404) {
          toast.error("Produto não encontrado na base de dados");
          navigate("/404");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const destroyProduct = async () => {
    productApi
      .destroy(product!.id)
      .then(() => {
        navigate("/products");
        toast("Produto deletado com sucesso");
      })
      .catch(() => {
        toast("Erro ao deletar o produto");
      });
  };

  useEffect(() => {
    getProductDetails();
  }, []);

  return (
    <>
      {loading ? (
        <span>...Carregando</span>
      ) : (
        <>
          <Helmet title="Produtos|Detalhe Do Produto" />
          <Card>
            <CardHeader>
              <CardTitle>Cadastro de produto</CardTitle>
              <CardDescription>Cadastrar novo produto</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="grid flex-1 items-center gap-1.5">
                    <Label htmlFor="name">Nome do produto</Label>
                    <Input
                      type="text"
                      id="name"
                      className="w-full"
                      disabled
                      value={product?.name}
                    />
                  </div>
                  <div className="grid flex-1 items-center gap-1.5">
                    <Label htmlFor="name">Fabricante</Label>
                    <Input
                      type="text"
                      id="name"
                      placeholder="Nome Completo"
                      className="w-full"
                      defaultValue={product?.brand}
                      disabled
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="grid flex-1 items-center gap-1.5">
                    <Label htmlFor="name">Quantidade</Label>
                    <Input
                      type="text"
                      id="name"
                      disabled
                      className="w-full"
                      defaultValue={product?.quantity}
                    />
                  </div>
                  <div className="grid flex-1 items-center gap-1.5">
                    <Label htmlFor="name">Valor</Label>
                    <Input
                      type="text"
                      min={0}
                      id="name"
                      className="w-full"
                      disabled
                      defaultValue={product?.price}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full flex justify-end gap-2">
                <AlertDialog>
                  <Button asChild variant="destructive">
                    <AlertDialogTrigger>Deletar</AlertDialogTrigger>
                  </Button>
                  <AlertDialogContent>
                    <AlertDialogTitle>
                      Tem certeza que deseja deletar o produto?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Ao confirmar essa ação, o produto{" "}
                      <span className="text-rose-600">{product?.name}</span>{" "}
                      sera excluido permanentemente. Esta acão não pode ser
                      desfeita !
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={destroyProduct}>
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button variant={"secondary"}>Editar</Button>
              </div>
            </CardFooter>
          </Card>
        </>
      )}
    </>
  );
}
