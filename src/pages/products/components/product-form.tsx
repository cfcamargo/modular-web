import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ControlledCurrencyInput } from "@/components/ui/currency-input";
import { ProductRequest } from "@/models/requests/product-request";
import { ProductApi } from "@/api/product-api";

const productApi = new ProductApi();
import { zodResolver } from "@hookform/resolvers/zod";
import { Package, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  brand: z.string().min(1, "Marca é obrigatória"),
  price: z.number().min(0.01, "Preço deve ser maior que zero"),
  costPrice: z.number().min(0.01, "Preço de custo deve ser maior que zero"),
  description: z.string().min(1, "Descrição é obrigatória"),
  unit: z.enum(["KG", "UN", "M2"], {
    required_error: "Unidade de medida é obrigatória",
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function ProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const isEditing = Boolean(id);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      brand: "",
      price: 0,
      costPrice: 0,
      description: "",
      unit: "UN",
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      loadProductData();
    }
  }, [id, isEditing]);

  const loadProductData = async () => {
    if (!id) return;
    
    setIsLoadingData(true);
    try {
      const product = await productApi.getDetails(id);
      setValue("name", product.data.product.name);
      setValue("brand", product.data.product.brand);
      setValue("price", product.data.product.price);
      setValue("costPrice", 0); // costPrice não existe no ProductResponse
      setValue("description", ""); // description não existe no ProductResponse
      setValue("unit", "UN"); // unit não existe no ProductResponse
    } catch (error) {
      toast.error("Erro ao carregar dados do produto");
      navigate("/products");
    } finally {
      setIsLoadingData(false);
    }
  };

  const onSubmitForm = async (data: FormData) => {
    setIsLoading(true);
    try {
      const productData: ProductRequest = {
        name: data.name,
        brand: data.brand,
        price: data.price,
        costPrice: data.costPrice,
        description: data.description,
        unit: data.unit,
      };

      if (isEditing && id) {
        await productApi.update(productData, Number(id));
        toast.success("Produto atualizado com sucesso!");
      } else {
        await productApi.save(productData);
        toast.success("Produto criado com sucesso!");
      }
      
      navigate("/products");
    } catch (error) {
      toast.error(
        isEditing 
          ? "Erro ao atualizar produto. Tente novamente."
          : "Erro ao criar produto. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Package className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Carregando dados do produto...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? "Editar Produto" : "Novo Produto"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing 
              ? "Atualize as informações do produto"
              : "Preencha as informações para criar um novo produto"
            }
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Informações do Produto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Produto</Label>
                <Input
                  id="name"
                  placeholder="Digite o nome do produto"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Marca</Label>
                <Input
                  id="brand"
                  placeholder="Digite a marca do produto"
                  {...register("brand")}
                />
                {errors.brand && (
                  <p className="text-sm text-destructive">{errors.brand.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Preço de Venda</Label>
                <Controller
                  control={control}
                  name="price"
                  render={({ field }) => (
                    <ControlledCurrencyInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="0,00"
                    />
                  )}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="costPrice">Preço de Custo</Label>
                <Controller
                  control={control}
                  name="costPrice"
                  render={({ field }) => (
                    <ControlledCurrencyInput
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="0,00"
                    />
                  )}
                />
                {errors.costPrice && (
                  <p className="text-sm text-destructive">{errors.costPrice.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unidade de Medida</Label>
                <Controller
                  control={control}
                  name="unit"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a unidade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="KG">Quilograma (KG)</SelectItem>
                        <SelectItem value="UN">Unidade (UN)</SelectItem>
                        <SelectItem value="M2">Metro Quadrado (M²)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.unit && (
                  <p className="text-sm text-destructive">{errors.unit.message}</p>
                )}
                {isEditing && (
                  <p className="text-xs text-muted-foreground">
                    A unidade de medida não pode ser alterada durante a edição
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Digite uma descrição detalhada do produto"
                className="min-h-[100px]"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="flex gap-4 pt-6">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : isEditing ? "Atualizar Produto" : "Criar Produto"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link to="/products">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}