import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductRequest } from "@/models/requests/product-request";
import { ProductApi } from "@/api/product-api";
import { ProductResponse } from "@/models/responses/product-response";

const productApi = new ProductApi();
import { zodResolver } from "@hookform/resolvers/zod";
import { Package, ArrowLeft, AlertTriangle } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { PercentInputField } from "@/components/shared/percent-input-field";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  brand: z.string().min(1, "Marca é obrigatória"),
  marginPercent: z.string().min(1, "Margem percentual é obrigatória"),
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
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [originalData, setOriginalData] = useState<ProductResponse | null>(
    null
  );
  const isEditing = Boolean(id);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      brand: "",
      marginPercent: "",
      unit: "UN",
    },
  });

  // Observa todos os campos do formulário
  const watchedFields = watch();

  // Verifica se houve mudanças nos campos
  const hasChanges = useMemo(() => {
    if (!isEditing || !originalData) return false;

    return (
      watchedFields.name !== originalData.name ||
      watchedFields.brand !== originalData.brand ||
      watchedFields.marginPercent !== String(originalData.marginPercent) ||
      watchedFields.description !== originalData.description
    );
  }, [watchedFields, originalData, isEditing]);

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
      const productData = product.data.product;

      // Armazena os dados originais para comparação
      setOriginalData(productData);

      setValue("name", productData.name);
      setValue("brand", productData.brand);
      setValue("marginPercent", String(productData.marginPercent));
      setValue("description", productData.description);
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
        marginPercent: Number(data.marginPercent),
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

  const handleDeactivateProduct = async () => {
    if (!id) return;

    setIsDeactivating(true);
    try {
      await productApi.deactivate(Number(id));
      toast.success("Produto desativado com sucesso!");
      navigate("/products");
    } catch (error) {
      toast.error("Erro ao desativar produto. Tente novamente.");
    } finally {
      setIsDeactivating(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Package className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">
            Carregando dados do produto...
          </p>
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
              : "Preencha as informações para criar um novo produto"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Informações do Produto
            </div>
            {isEditing && originalData && (
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm px-2 py-1 rounded-full ${
                    originalData.status === 1
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {originalData.status === 1 ? "Ativo" : "Inativo"}
                </span>
              </div>
            )}
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
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
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
                  <p className="text-sm text-destructive">
                    {errors.brand.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <PercentInputField
                  label="Margem Percentual"
                  placeholder="Digite a margem de lucro para o produto"
                  error={errors.marginPercent?.message}
                  {...register("marginPercent")}
                />
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
                  <p className="text-sm text-destructive">
                    {errors.unit.message}
                  </p>
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
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex gap-4 pt-6 justify-between">
              <div>
                {isEditing && originalData?.status === 1 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        variant="destructive"
                        disabled={isDeactivating}
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        {isDeactivating ? "Apagando..." : "Apagar Produto"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Apagar Produto</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja apagar este produto?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeactivateProduct}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Apagar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
              <div className="flex gap-4">
                <Button type="button" variant="outline" asChild>
                  <Link to="/products">Cancelar</Link>
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || (isEditing && !hasChanges)}
                >
                  {isLoading
                    ? "Salvando..."
                    : isEditing
                    ? "Atualizar Produto"
                    : "Criar Produto"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
