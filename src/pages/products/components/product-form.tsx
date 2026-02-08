import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, Save, Package } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { ProductResponse } from "@/models/responses/product-response";

export const productSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),

  price: z.coerce
    .number({ invalid_type_error: "Informe um valor numérico" })
    .min(0.01, "O preço deve ser maior que zero."),

  installmentPrice: z.coerce
    .number({ invalid_type_error: "Informe um valor numérico" })
    .min(0.01, "O preço deve ser maior que zero."),

  initialStock: z.coerce
    .number({ invalid_type_error: "Informe o estoque" })
    .int("O estoque deve ser inteiro")
    .min(0, "O estoque não pode ser negativo."),

  unit: z
    .string({ required_error: "Selecione uma unidade" })
    .min(1, "Selecione uma unidade."),

  description: z.string().optional(),
});

export type ProductFormSchema = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: ProductFormSchema;
  onSubmit: (data: ProductRequest) => Promise<void>;
  isLoading: boolean;
  pageTitle: string;
  isEditMode?: boolean;
  isEditScreen?: boolean
}

export default function ProductForm({
  initialData,
  onSubmit,
  isLoading,
  pageTitle,
  isEditMode = true,
  isEditScreen = false
}: ProductFormProps) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProductFormSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: "",
      price: "" as unknown as number,
      installmentPrice: "" as unknown as number,
      initialStock: "" as unknown as number,
      description: "",
      unit: "",
    },
  });
  

  const handleFormSubmit = (data: ProductFormSchema) => {
    console.log(data);
    onSubmit(data as ProductRequest);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/products">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{pageTitle}</h2>
          <p className="text-muted-foreground">
            {initialData
              ? "Edite as informações do produto."
              : "Preencha os dados para cadastrar um novo produto."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Dados do Produto
            </CardTitle>
            <CardDescription>
              Informações básicas de identificação e estoque.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Nome do Produto *</Label>
              <div className="relative">
                <Package className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  disabled={!isEditMode}
                  className="pl-9"
                  placeholder="Ex: Cimento CP II"
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="text-destructive text-sm">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>Preço a vista (R$) *</Label>
                <Input
                  disabled={!isEditMode}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("price")}
                />
                {errors.price && (
                  <p className="text-destructive text-sm">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Preço a prazo (R$) *</Label>
                <Input
                  disabled={!isEditMode}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("installmentPrice")}
                />
                {errors.installmentPrice && (
                  <p className="text-destructive text-sm">
                    {errors.installmentPrice.message}
                  </p>
                )}
              </div>

              {!initialData && (
                <div className="space-y-2">
                  <Label>Estoque Inicial *</Label>
                  <Input
                    disabled={!isEditMode}
                    type="number"
                    placeholder="0"
                    {...register("initialStock")}
                  />
                  {errors.initialStock && (
                    <p className="text-destructive text-sm">
                      {errors.initialStock.message}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label>Unidade de Medida *</Label>
                <Controller
                  control={control}
                  name="unit"
                  disabled={isEditScreen}
                  render={({ field }) => (
                    <Select
                      disabled={!isEditMode}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger disabled={isEditScreen}>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UN">Unidade (UN)</SelectItem>
                        <SelectItem value="KG">Quilograma (KG)</SelectItem>
                        <SelectItem value="M2">Metro Quadrado (M²)</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.unit && (
                  <p className="text-destructive text-sm">
                    {errors.unit.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                disabled={!isEditMode}
                placeholder="Detalhes adicionais sobre o produto..."
                className="min-h-[100px]"
                {...register("description")}
              />
            </div>
          </CardContent>
        </Card>

        <div>
          {JSON.stringify(initialData)}
        </div>

        {isEditMode && (
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/products")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Salvar Produto
                </>
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
