import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Package,
  TrendingUp,
  TrendingDown,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { stockMovementApi } from "@/api/stock-movement-api";
import { ProductApi } from "@/api/product-api";

const productApi = new ProductApi();
import { ProductResponse } from "@/models/responses/product-response";

// Schemas de validação
const entrySchema = z.object({
  productId: z.string().min(1, "Produto é obrigatório"),
  quantity: z
    .string()
    .min(1, "Quantidade é obrigatória")
    .refine(
      (val) =>
        !isNaN(parseFloat(val.replace(",", "."))) &&
        parseFloat(val.replace(",", ".")) > 0,
      "Quantidade deve ser um número positivo"
    ),
  unitCost: z.number().min(0.01, "Custo unitário é obrigatório"),
  description: z.string().optional(),
});

const exitSchema = z.object({
  productId: z.string().min(1, "Produto é obrigatório"),
  quantity: z
    .string()
    .min(1, "Quantidade é obrigatória")
    .refine(
      (val) =>
        !isNaN(parseFloat(val.replace(",", "."))) &&
        parseFloat(val.replace(",", ".")) > 0,
      "Quantidade deve ser um número positivo"
    ),
  unitSalePrice: z.number().optional(),
  description: z.string().optional(),
});

const adjustSchema = z.object({
  productId: z.string().min(1, "Produto é obrigatório"),
  targetQuantity: z
    .string()
    .min(1, "Quantidade alvo é obrigatória")
    .refine(
      (val) =>
        !isNaN(parseFloat(val.replace(",", "."))) &&
        parseFloat(val.replace(",", ".")) >= 0,
      "Quantidade alvo deve ser um número válido"
    ),
  description: z.string().optional(),
});

type EntryFormData = z.infer<typeof entrySchema>;
type ExitFormData = z.infer<typeof exitSchema>;
type AdjustFormData = z.infer<typeof adjustSchema>;

export function NewMovement() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("entry");

  const entryForm = useForm<EntryFormData>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      productId: "",
      quantity: "",
      unitCost: 0,
      description: "",
    },
  });

  const exitForm = useForm<ExitFormData>({
    resolver: zodResolver(exitSchema),
    defaultValues: {
      productId: "",
      quantity: "",
      unitSalePrice: 0,
      description: "",
    },
  });

  const adjustForm = useForm<AdjustFormData>({
    resolver: zodResolver(adjustSchema),
    defaultValues: {
      productId: "",
      targetQuantity: "",
      description: "",
    },
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productApi.get({
        page: 1,
        perPage: 100,
        searchTerm: "",
      });
      setProducts(response.data.data);
    } catch (error) {
      toast.error("Erro ao carregar produtos");
    }
  };

  const onSubmitEntry = async (data: EntryFormData) => {
    try {
      setLoading(true);
      await stockMovementApi.createEntry({
        productId: data.productId,
        quantity: parseFloat(data.quantity.replace(",", ".")),
        unitCost: data.unitCost,
        description: data.description,
      });
      toast.success("Entrada registrada com sucesso!");
      navigate("/movements");
    } catch (error) {
      toast.error("Erro ao registrar entrada");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitExit = async (data: ExitFormData) => {
    try {
      setLoading(true);
      await stockMovementApi.createExit({
        productId: data.productId,
        quantity: parseFloat(data.quantity.replace(",", ".")),
        unitSalePrice: data.unitSalePrice,
        description: data.description,
      });
      toast.success("Saída registrada com sucesso!");
      navigate("/movements");
    } catch (error) {
      toast.error("Erro ao registrar saída");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitAdjust = async (data: AdjustFormData) => {
    try {
      setLoading(true);
      await stockMovementApi.createAdjust({
        productId: data.productId,
        targetQuantity: parseFloat(data.targetQuantity.replace(",", ".")),
        description: data.description,
      });
      toast.success("Ajuste registrado com sucesso!");
      navigate("/movements");
    } catch (error) {
      toast.error("Erro ao registrar ajuste");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/movements")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Nova Movimentação
          </h1>
          <p className="text-muted-foreground">
            Registre uma nova movimentação de estoque
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tipo de Movimentação</CardTitle>
          <CardDescription>
            Selecione o tipo de movimentação que deseja registrar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger
                value="entry"
                className="flex items-center space-x-2"
              >
                <TrendingUp className="h-4 w-4" />
                <span>Entrada</span>
              </TabsTrigger>
              <TabsTrigger value="exit" className="flex items-center space-x-2">
                <TrendingDown className="h-4 w-4" />
                <span>Saída</span>
              </TabsTrigger>
              <TabsTrigger
                value="adjust"
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Ajuste</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="entry" className="space-y-4">
              <Form {...entryForm}>
                <form
                  onSubmit={entryForm.handleSubmit(onSubmitEntry)}
                  className="space-y-4"
                >
                  <FormField
                    control={entryForm.control}
                    name="productId"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Produto *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um produto" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem
                                key={product.id}
                                value={product.id.toString()}
                              >
                                <div className="flex items-center space-x-2">
                                  <Package className="h-4 w-4" />
                                  <span>{product.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={entryForm.control}
                    name="quantity"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Quantidade *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 10 ou 10,5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={entryForm.control}
                    name="unitCost"
                    render={() => (
                      <FormItem>
                        <FormLabel>Custo Unitário *</FormLabel>
                        <FormControl></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={entryForm.control}
                    name="description"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Observação</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Observações sobre a entrada..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/movements")}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Registrando..." : "Registrar Entrada"}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="exit" className="space-y-4">
              <Form {...exitForm}>
                <form
                  onSubmit={exitForm.handleSubmit(onSubmitExit)}
                  className="space-y-4"
                >
                  <FormField
                    control={exitForm.control}
                    name="productId"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Produto *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um produto" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem
                                key={product.id}
                                value={product.id.toString()}
                              >
                                <div className="flex items-center space-x-2">
                                  <Package className="h-4 w-4" />
                                  <span>{product.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={exitForm.control}
                    name="quantity"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Quantidade *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 10 ou 10,5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={exitForm.control}
                    name="unitSalePrice"
                    render={() => (
                      <FormItem>
                        <FormLabel>Preço de Venda Unitário</FormLabel>
                        <FormControl></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={exitForm.control}
                    name="description"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Observação</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Observações sobre a saída..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/movements")}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Registrando..." : "Registrar Saída"}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="adjust" className="space-y-4">
              <Form {...adjustForm}>
                <form
                  onSubmit={adjustForm.handleSubmit(onSubmitAdjust)}
                  className="space-y-4"
                >
                  <FormField
                    control={adjustForm.control}
                    name="productId"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Produto *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um produto" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem
                                key={product.id}
                                value={product.id.toString()}
                              >
                                <div className="flex items-center space-x-2">
                                  <Package className="h-4 w-4" />
                                  <span>{product.name}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={adjustForm.control}
                    name="targetQuantity"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Quantidade Alvo *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 100 ou 100,5" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={adjustForm.control}
                    name="description"
                    render={({ field }: { field: any }) => (
                      <FormItem>
                        <FormLabel>Observação</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Motivo do ajuste de estoque..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/movements")}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Registrando..." : "Registrar Ajuste"}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
