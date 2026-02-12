import { useEffect, useState } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form"; // Importar FormProvider
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Printer,
  Plus,
  User,
  Package,
  Truck,
  DollarSign,
  FileText,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { clientApi, orderApi } from "@/api";
import { ClientResponse } from "@/models/responses/client-response";
import { AutoCompletePopover } from "@/components/shared/auto-complete-popover";
import { BaseOption } from "@/models/common/baseOption";
import { ProductLineItem } from "./components/ProductLineItem";
import { useUserLoggedStore } from "@/store/auth/user-logged";
import { useNavigate } from "react-router-dom";
import { OrderStatusEnum } from "@/utils/enums/OrderStatusEnum";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const orderItemSchema = z.object({
  productId: z.string().min(1, "Selecione um produto"),
  quantity: z.coerce.number().min(1, "Quantidade mínima é 1"),
  unitPrice: z.coerce.number().min(0.01, "Preço deve ser maior que 0"),
  installmentPrice: z.coerce.number().min(0.01, "Preço a prazo deve ser maior que 0"),
});

const salesOrderSchema = z.object({
  customerId: z.string().min(1, "Selecione um cliente"),
  items: z.array(orderItemSchema).min(1, "Adicione pelo menos um item"),
  includeDelivery: z.boolean(),
  deliveryAddress: z.string().optional(),
  shippingCost: z.coerce.number().min(0).default(0),
  discount: z.coerce.number().min(0).default(0),
});

type SalesOrderFormData = z.infer<typeof salesOrderSchema>;

export default function NewQuote() {
  const form = useForm<SalesOrderFormData>({
    resolver: zodResolver(salesOrderSchema),
    defaultValues: {
      customerId: "",
      items: [{ productId: "", quantity: 1, unitPrice: 0, installmentPrice: 0 }],
      includeDelivery: false,
      shippingCost: 0,
      discount: 0,
    },
  });

  const { user } = useUserLoggedStore();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPaymentMethodDialog, setShowPaymentMethodDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"SPOT" | "INSTALLMENT">("SPOT");

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchItems = form.watch("items");
  const watchIncludeDelivery = form.watch("includeDelivery");
  const watchShippingCost = form.watch("shippingCost");
  const watchDiscount = form.watch("discount");

  const subtotal = watchItems.reduce((sum, item) => {
    return sum + (item.quantity || 0) * (item.unitPrice || 0);
  }, 0);

  const shipping = watchIncludeDelivery ? Number(watchShippingCost) || 0 : 0;
  const discount = Number(watchDiscount) || 0;
  const total = subtotal + shipping - discount;

  const onSubmit = async (
    data: SalesOrderFormData,
    status: "draft" | "order",
  ) => {
    // Determine the price based on status and payment method
    // If it's a draft, we might want to keep the unitPrice as is or logic might differ?
    // For now, if it's an order, we check paymentMethod.
    // However, the requirement says "se ele clicar em gerar pedido...".
    // So for draft, we probably just save as is. But wait, the schema has both.
    // The payload to createOrder expects 'price'.
    
    // We should map items to set the correct 'price'
    const itemsPayload = watchItems.map((item) => {
      let finalPrice = Number(item.unitPrice);
      if (status === "order" && paymentMethod === "INSTALLMENT") {
        finalPrice = Number(item.installmentPrice);
      }
      return {
        productId: item.productId,
        quantity: Number(item.quantity),
        price: finalPrice,
      };
    });

    const payload = {
      clientId: selectedClient?.id,
      userId: user?.id,
      address: data.deliveryAddress,
      observation: "",
      shippingCost: data.shippingCost,
      totalDiscount: data.discount,
      status:
        status === "draft" ? OrderStatusEnum.DRAFT : OrderStatusEnum.CONFIRMED,
      items: itemsPayload,
    };
    setLoading(true);

    await orderApi
      .createOrder(payload)
      .then(() => {
        toast.success(
          status === "draft"
            ? "O orçamento foi criado com sucesso"
            : "O pedido foi criado com sucesso",
        );
        navigate("/quotes");
      })
      .catch(() => {
        toast.error("Erro ao criar orçamento");
      })
      .finally(() => {
        setLoading(false);
        setShowPaymentMethodDialog(false);
      });
  };

  const handleGenerateOrderClick = () => {
    setShowPaymentMethodDialog(true);
  };

  const confirmGenerateOrder = () => {
    form.handleSubmit((data) => onSubmit(data, "order"))();
  };

  const [clients, setClients] = useState<ClientResponse[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [selectedClient, setSelectedClient] = useState<BaseOption | null>(null);
  const [clientSearchTerm, setClientSearchTerm] = useState<string>("");

  const getClients = async () => {
    setLoadingClients(true);
    const response = await clientApi.get({
      page: 1,
      perPage: 20,
      searchTerm: clientSearchTerm,
    });
    setClients(response.data.clients);
    setLoadingClients(false);
  };

  useEffect(() => {
    getClients();
  }, [clientSearchTerm]);

  return (
    <div className="min-h-screen">
      <FormProvider {...form}>
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-balance">
                Novo Pedido de Venda
              </h1>
              <p className="text-sm text-muted-foreground">
                Crie um novo pedido ou orçamento para seu cliente
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir / PDF
            </Button>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Dados do Cliente
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Cliente</Label>
                      <AutoCompletePopover
                        onSelect={(client) => {
                          setSelectedClient(client);
                          if (client)
                            form.setValue("customerId", client.id.toString());
                        }}
                        handleChangeSearchTerm={setClientSearchTerm}
                        options={clients.map((c) => ({
                          name: c.name!,
                          id: c.id!,
                        }))}
                        loading={loadingClients}
                        selectedOption={selectedClient}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Itens do Pedido
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Produto</TableHead>
                            <TableHead className="w-24">Qtd</TableHead>
                            <TableHead className="w-32">Valor Unit.</TableHead>
                            <TableHead className="w-32">Valor a Prazo</TableHead>
                            <TableHead className="w-32">Subtotal</TableHead>
                            <TableHead className="w-12"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {fields.map((field, index) => (
                            <ProductLineItem
                              key={field.id}
                              index={index}
                              remove={remove}
                              canRemove={fields.length > 1}
                            />
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      disabled={loading}
                      size="sm"
                      onClick={() =>
                        append({ productId: "", quantity: 1, unitPrice: 0, installmentPrice: 0 })
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Item
                    </Button>

                    <Separator />

                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span>Subtotal dos Itens:</span>
                      <span>R$ {subtotal.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Entrega e Logística
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="include-delivery"
                        className="cursor-pointer"
                      >
                        Incluir Entrega?
                      </Label>
                      <Switch
                        id="include-delivery"
                        checked={watchIncludeDelivery}
                        onCheckedChange={(checked) =>
                          form.setValue("includeDelivery", checked)
                        }
                        disabled={loading}
                      />
                    </div>

                    {watchIncludeDelivery && (
                      <div className="space-y-4 animate-in fade-in-50 duration-200">
                        <div className="space-y-2">
                          <Label htmlFor="delivery-address">
                            Endereço de Entrega
                          </Label>
                          <Textarea
                            id="delivery-address"
                            placeholder="Digite o endereço completo..."
                            {...form.register("deliveryAddress")}
                            rows={3}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="shipping-cost">
                            Custo de Frete (R$)
                          </Label>
                          <Input
                            id="shipping-cost"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            {...form.register("shippingCost")}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="lg:sticky lg:top-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Pagamento e Totais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="discount">Desconto (R$)</Label>
                      <Input
                        id="discount"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...form.register("discount")}
                      />
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span className="font-medium">
                          R$ {subtotal.toFixed(2)}
                        </span>
                      </div>

                      {watchIncludeDelivery && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Frete:</span>
                          <span className="font-medium text-blue-600">
                            + R$ {shipping.toFixed(2)}
                          </span>
                        </div>
                      )}

                      {discount > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Desconto:
                          </span>
                          <span className="font-medium text-green-600">
                            - R$ {discount.toFixed(2)}
                          </span>
                        </div>
                      )}

                      <Separator />

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">TOTAL FINAL:</span>
                        <span className="text-2xl font-bold text-primary">
                          R$ {total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6 space-y-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={form.handleSubmit((data) =>
                        onSubmit(data, "draft"),
                      )}
                      disabled={loading}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Salvar como Orçamento
                    </Button>

                    <Button
                      type="button"
                      className="w-full"
                      onClick={handleGenerateOrderClick}
                      disabled={loading}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Gerar Pedido
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </FormProvider>

      <Dialog open={showPaymentMethodDialog} onOpenChange={setShowPaymentMethodDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerar Pedido</DialogTitle>
            <DialogDescription>
              Selecione a forma de pagamento para este pedido.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) => setPaymentMethod(value as "SPOT" | "INSTALLMENT")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="SPOT" id="spot" />
                <Label htmlFor="spot">À Vista (Usa Valor Unitário)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="INSTALLMENT" id="installment" />
                <Label htmlFor="installment">A Prazo (Usa Valor a Prazo)</Label>
              </div>
            </RadioGroup>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentMethodDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmGenerateOrder} disabled={loading}>
              {loading ? "Gerando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
