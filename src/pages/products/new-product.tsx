import { productApi } from "@/api";
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
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign, FileText, Package, Tag } from "lucide-react";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { useHookFormMask } from "use-mask-input";
import CurrencyInput from "react-currency-input-field";
import { cn } from "@/lib/utils";
import { ControlledCurrencyInput } from "@/components/ui/currency-input";

const formSchema = z.object({
  name: z.string().min(4, { message: "Digite o nome do produto" }),
  brand: z.string().min(4, { message: "Digite a fabricante do produto" }),
  price: z.string(),
  costPrice: z.string(),
  description: z.string().nullable(),
});

export function NewProduct() {
  const [loading, setLoading] = useState(false);

  type BasicDataForm = z.infer<typeof formSchema>;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BasicDataForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: "200",
      costPrice: "120",
    },
  });

  const registerWithMask = useHookFormMask(register);

  const onSubmitForm = (data: BasicDataForm) => {
    console.log(data);
    // const newProduct: ProductRequest = {
    //   brand: data.brand,
    //   name: data.name,
    //   price: Number(data.price),
    //   quantity: Number(data.quantity),
    // };

    return;

    setLoading(true);
    productApi
      .save(newProduct)
      .then((response) => {
        toast.success("Produto criado com sucesso");
        navigate(`/products/${response.data.product.id}`);
      })
      .catch((e) => {
        toast.error("Erro ao criar o produto");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Helmet title="Produtos|Cadastro De Produto" />
      <div className="min-h-screen py-8 px-4">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2 py-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                Cadastro de Produto
              </CardTitle>
              <CardDescription>
                Preencha as informações abaixo para cadastrar um novo produto
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-6 mt-4"
              onSubmit={handleSubmit(onSubmitForm)}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Nome do Produto
                  </Label>
                  <Input
                    id="name"
                    placeholder="Digite o nome do produto"
                    {...register("name")}
                  />
                  <p className="text-sm text-muted-foreground">
                    Nome comercial do produto
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand" className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Fabricante
                  </Label>
                  <Input
                    id="brand"
                    placeholder="Digite a fabricante"
                    {...register("brand")}
                  />
                  <p className="text-sm text-muted-foreground">
                    Nome da empresa fabricante
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price" className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Preço de Venda
                  </Label>
                  <ControlledCurrencyInput
                    name="price"
                    value={watch("price")}
                    onValueChange={(value) => {
                      console.log(value);
                      setValue("price", value!);
                    }}
                    id="price"
                  />
                  <p className="text-sm text-muted-foreground">
                    Preço de venda ao consumidor (R$)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="costPrice"
                    className="flex items-center gap-2"
                  >
                    <DollarSign className="w-4 h-4" />
                    Preço de Custo
                  </Label>
                  <ControlledCurrencyInput
                    name="costPrice"
                    value={watch("costPrice")}
                    onValueChange={(value) => {
                      setValue("costPrice", value!);
                    }}
                    id="costPrice"
                  />
                  <p className="text-sm text-muted-foreground">
                    Preço de custo do produto (R$)
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  placeholder="Digite uma descrição detalhada do produto (opcional)"
                  className="min-h-[100px]"
                  {...register("description")}
                />
                <p className="text-sm text-muted-foreground">
                  Descrição detalhada do produto (campo opcional)
                </p>
              </div>

              <div className="flex flex-col justify-end sm:flex-row gap-4 pt-6">
                <Button
                  variant="outline"
                  type="button"
                  className="flex-1 sm:flex-none bg-transparent"
                >
                  Cancelar
                </Button>
                <Button type="submit">Cadastrar Produto</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
