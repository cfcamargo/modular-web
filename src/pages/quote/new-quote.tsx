import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Printer,
  Plus,
  Trash2,
  Search,
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

// Mock data
const mockCustomers = [
  {
    id: "1",
    name: "João Silva",
    document: "123.456.789-00",
    phone: "(11) 98765-4321",
  },
  {
    id: "2",
    name: "Maria Santos",
    document: "987.654.321-00",
    phone: "(11) 91234-5678",
  },
  {
    id: "3",
    name: "Empresa XYZ Ltda",
    document: "12.345.678/0001-90",
    phone: "(11) 3456-7890",
  },
  {
    id: "4",
    name: "Carlos Oliveira",
    document: "456.789.123-00",
    phone: "(11) 99876-5432",
  },
];

const mockProducts = [
  { id: "1", name: "Notebook Dell Inspiron 15", price: 3500.0 },
  { id: "2", name: "Mouse Logitech MX Master 3", price: 450.0 },
  { id: "3", name: "Teclado Mecânico Keychron K2", price: 650.0 },
  { id: "4", name: 'Monitor LG 27" 4K', price: 1800.0 },
  { id: "5", name: "Webcam Logitech C920", price: 350.0 },
  { id: "6", name: "Headset HyperX Cloud II", price: 550.0 },
];

const orderItemSchema = z.object({
  productId: z.string().min(1, "Selecione um produto"),
  quantity: z.coerce.number().min(1, "Quantidade mínima é 1"),
  unitPrice: z.coerce.number().min(0.01, "Preço deve ser maior que 0"),
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
  const [customerOpen, setCustomerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<
    (typeof mockCustomers)[0] | null
  >(null);

  const form = useForm<SalesOrderFormData>({
    resolver: zodResolver(salesOrderSchema),
    defaultValues: {
      customerId: "",
      items: [{ productId: "", quantity: 1, unitPrice: 0 }],
      includeDelivery: false,
      shippingCost: 0,
      discount: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchItems = form.watch("items");
  const watchIncludeDelivery = form.watch("includeDelivery");
  const watchShippingCost = form.watch("shippingCost");
  const watchDiscount = form.watch("discount");

  // Calculate subtotal for each item
  const calculateItemSubtotal = (index: number) => {
    const item = watchItems[index];
    if (!item) return 0;
    return item.quantity * item.unitPrice;
  };

  // Calculate order totals
  const subtotal = watchItems.reduce((sum, item) => {
    return sum + item.quantity * item.unitPrice;
  }, 0);

  const shipping = watchIncludeDelivery ? Number(watchShippingCost) || 0 : 0;
  const discount = Number(watchDiscount) || 0;
  const total = subtotal + shipping - discount;

  const handleProductSelect = (index: number, productId: string) => {
    const product = mockProducts.find((p) => p.id === productId);
    if (product) {
      form.setValue(`items.${index}.productId`, productId);
      form.setValue(`items.${index}.unitPrice`, product.price);
    }
  };

  const handleCustomerSelect = (customer: (typeof mockCustomers)[0]) => {
    setSelectedCustomer(customer);
    form.setValue("customerId", customer.id);
    setCustomerOpen(false);
  };

  const onSubmit = (data: SalesOrderFormData, status: "draft" | "order") => {
    console.log("[v0] Form data:", data);
    console.log("[v0] Status:", status);

    if (status === "draft") {
      toast.success("Orçamento salvo com sucesso!");
    } else {
      toast.success("Pedido gerado com sucesso!");
    }
  };

  return (
    <div className="min-h-screen">
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
            {/* Main Content - 2 columns */}
            <div className="space-y-6 lg:col-span-2">
              {/* Customer Selection */}
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
                    <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-full justify-between bg-transparent"
                        >
                          {selectedCustomer
                            ? selectedCustomer.name
                            : "Selecione um cliente..."}
                          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <Command>
                          <CommandInput placeholder="Buscar cliente..." />
                          <CommandList>
                            <CommandEmpty>
                              Nenhum cliente encontrado.
                            </CommandEmpty>
                            <CommandGroup>
                              {mockCustomers.map((customer) => (
                                <CommandItem
                                  key={customer.id}
                                  onSelect={() =>
                                    handleCustomerSelect(customer)
                                  }
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {customer.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {customer.document}
                                    </span>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {form.formState.errors.customerId && (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.customerId.message}
                      </p>
                    )}
                  </div>

                  {selectedCustomer && (
                    <div className="rounded-lg bg-muted p-3 space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">CPF/CNPJ:</span>
                        <span>{selectedCustomer.document}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">Telefone:</span>
                        <span>{selectedCustomer.phone}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Items */}
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
                          <TableHead className="w-32">Subtotal</TableHead>
                          <TableHead className="w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fields.map((field, index) => (
                          <TableRow key={field.id}>
                            <TableCell>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-between text-left font-normal bg-transparent"
                                  >
                                    {watchItems[index]?.productId
                                      ? mockProducts.find(
                                          (p) =>
                                            p.id === watchItems[index].productId
                                        )?.name
                                      : "Selecionar..."}
                                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-80 p-0"
                                  align="start"
                                >
                                  <Command>
                                    <CommandInput placeholder="Buscar produto..." />
                                    <CommandList>
                                      <CommandEmpty>
                                        Nenhum produto encontrado.
                                      </CommandEmpty>
                                      <CommandGroup>
                                        {mockProducts.map((product) => (
                                          <CommandItem
                                            key={product.id}
                                            onSelect={() =>
                                              handleProductSelect(
                                                index,
                                                product.id
                                              )
                                            }
                                          >
                                            <div className="flex flex-col">
                                              <span className="font-medium">
                                                {product.name}
                                              </span>
                                              <span className="text-xs text-muted-foreground">
                                                R$ {product.price.toFixed(2)}
                                              </span>
                                            </div>
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="1"
                                {...form.register(`items.${index}.quantity`)}
                                className="h-9"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                {...form.register(`items.${index}.unitPrice`)}
                                className="h-9"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                R$ {calculateItemSubtotal(index).toFixed(2)}
                              </div>
                            </TableCell>
                            <TableCell>
                              {fields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-9 w-9"
                                  onClick={() => remove(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({ productId: "", quantity: 1, unitPrice: 0 })
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

              {/* Delivery Section */}
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

            {/* Sidebar - 1 column */}
            <div className="space-y-6">
              {/* Payment and Totals */}
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
                        <span className="text-muted-foreground">Desconto:</span>
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

              {/* Action Buttons */}
              <Card>
                <CardContent className="pt-6 space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={form.handleSubmit((data) =>
                      onSubmit(data, "draft")
                    )}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Salvar como Orçamento
                  </Button>

                  <Button
                    type="button"
                    className="w-full"
                    onClick={form.handleSubmit((data) =>
                      onSubmit(data, "order")
                    )}
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
    </div>
  );
}
