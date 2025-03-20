import { productApi } from "@/api";
import LoadingAnimation from "@/components/shared/loading-animation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductRequest } from "@/models/requests/product-request";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(4, { message: "Digite o nome do produto" }),
  brand: z.string().min(4, { message: "Digite a fabricante do produto" }),
  quantity: z.string(),
  price: z.string(),
});

export function EditProduct() {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  type BasicDataForm = z.infer<typeof formSchema>;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BasicDataForm>({
    resolver: zodResolver(formSchema),
  });

  const onSubmitForm = (data: BasicDataForm) => {
    const newProduct: ProductRequest = {
      brand: data.brand,
      name: data.name,
      price: Number(data.price),
      quantity: Number(data.quantity),
    };

    setLoading(true);
    productApi
      .update(newProduct, Number(id))
      .then((response) => {
        toast.success("Produto atualizado com sucesso");
        navigate(`/products/${response.data.product.id}`);
      })
      .catch((e) => {
        toast.error("Erro ao atualizar o produto");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getProductDetails = () => {
    setLoading(true);
    productApi
      .getDetails(Number(id))
      .then((response) => {
        setValue("brand", response.data.product.brand);
        setValue("name", response.data.product.name);
        setValue("price", String(response.data.product.price));
        setValue("quantity", String(response.data.product.quantity));
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

  useEffect(() => {
    getProductDetails();
  }, []);

  return (
    <>
      <Helmet title="Produtos|Editar Produto" />
      <Card>
        <CardHeader>
          <CardTitle>Cadastro de produto</CardTitle>
          <CardDescription>Cadastrar novo produto</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmitForm)}
            className="flex flex-col gap-4"
          >
            <div className="flex gap-4">
              <div className="grid flex-1 items-center gap-1.5">
                <Label htmlFor="name">Nome do produto</Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Nome Completo"
                  className="w-full"
                  {...register("name")}
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">
                    {errors.name.message}
                  </span>
                )}
              </div>
              <div className="grid flex-1 items-center gap-1.5">
                <Label htmlFor="name">Fabricante</Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Nome Completo"
                  className="w-full"
                  {...register("brand")}
                />
                {errors.brand && (
                  <span className="text-red-500 text-sm">
                    {errors.brand.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="grid flex-1 items-center gap-1.5">
                <Label htmlFor="name">Quantidade</Label>
                <Input
                  type="number"
                  id="name"
                  className="w-full"
                  {...register("quantity")}
                />
                {errors.quantity && (
                  <span className="text-red-500 text-sm">
                    {errors.quantity.message}
                  </span>
                )}
              </div>
              <div className="grid flex-1 items-center gap-1.5">
                <Label htmlFor="name">Valor</Label>
                <Input
                  type="number"
                  min={0}
                  id="name"
                  className="w-full"
                  {...register("price")}
                />
                {errors.price && (
                  <span className="text-red-500 text-sm">
                    {errors.price.message}
                  </span>
                )}
              </div>
            </div>
            <div className="w-full flex gap-2 justify-end py-8">
              <Button type="button" variant={"outline"} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" className="w-[100px]" disabled={loading}>
                {loading ? <LoadingAnimation /> : "Salvar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
