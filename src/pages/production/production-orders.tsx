import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Factory,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  MoreHorizontal,
  X,
  Calendar,
  Package,
  Hash,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

// Seus imports originais
import { ProductionResponse } from "@/models/responses/production-response";
import { productApi, productionApi } from "@/api";
import { PaginationEnum } from "@/utils/enums/PaginationEnum";
import { ProductionStatusEnum } from "@/utils/enums/ProductionStatusEnum";
import { ProductResponse } from "@/models/responses/product-response";
import { InputAutoComplete } from "@/components/shared/input-auto-complete";

// --- CONFIGURAÇÕES E UTILS ---

const STATUS_CONFIG = {
  [ProductionStatusEnum.PENDING]: {
    label: "Ordem Realizada",
    color: "bg-slate-100 text-slate-800 border-slate-300",
    icon: Clock,
  },
  [ProductionStatusEnum.IN_PRODUCTION]: {
    label: "Em Fabricação",
    color: "bg-blue-100 text-blue-800 border-blue-300",
    icon: Factory,
  },
  [ProductionStatusEnum.CONFERENCE]: {
    label: "Conferência",
    color: "bg-orange-100 text-orange-800 border-orange-300",
    icon: AlertCircle,
  },
  [ProductionStatusEnum.COMPLETED]: {
    label: "Pronto",
    color: "bg-green-100 text-green-800 border-green-300",
    icon: CheckCircle,
  },
  [ProductionStatusEnum.CANCELLED]: {
    label: "Cancelado",
    color: "bg-red-100 text-red-800 border-red-300",
    icon: XCircle,
  },
} as const;

type StatusType = keyof typeof STATUS_CONFIG;

const STATUS_FLOW: StatusType[] = [
  ProductionStatusEnum.PENDING,
  ProductionStatusEnum.CANCELLED,
  ProductionStatusEnum.IN_PRODUCTION,
  ProductionStatusEnum.CONFERENCE,
  ProductionStatusEnum.COMPLETED,
];

const getNextStatus = (currentStatus: StatusType): StatusType | null => {
  const currentIndex = STATUS_FLOW.indexOf(currentStatus);
  if (currentIndex < STATUS_FLOW.length - 1) {
    return STATUS_FLOW[currentIndex + 1];
  }
  return null;
};

// --- SCHEMAS ---

const productionOrderSchema = z.object({
  product: z.string().min(1, "Selecione um produto"),
  quantity: z.coerce.number().min(1, "Quantidade mínima é 1"),
  deadline: z.coerce.date({
    required_error: "Selecione uma data",
    invalid_type_error: "Data inválida",
  }),
});

type ProductionOrderForm = z.infer<typeof productionOrderSchema>;

type FilterStatusType =
  | "cancel"
  | "done"
  | "production"
  | "conference"
  | "pending"
  | "all";

// --- COMPONENTE DE AÇÕES (Extraído para reutilização) ---

interface OrderActionsProps {
  order: ProductionResponse;
  onUpdateStatus: (id: string, status: StatusType) => void;
}

function OrderActions({ order, onUpdateStatus }: OrderActionsProps) {
  const nextStatus = getNextStatus(order.status);

  if (order.status === ProductionStatusEnum.CANCELLED || !nextStatus) {
    if (order.status === ProductionStatusEnum.COMPLETED) {
      return (
        <Badge
          variant="secondary"
          className="gap-1 bg-green-50 text-green-700 border-green-200"
        >
          <CheckCircle className="h-3 w-3" />
          Finalizado
        </Badge>
      );
    }
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Ações da Ordem</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {order.status === ProductionStatusEnum.PENDING ? (
          <>
            <DropdownMenuItem
              onClick={() =>
                onUpdateStatus(order.id, ProductionStatusEnum.IN_PRODUCTION)
              }
              className="gap-2 cursor-pointer text-blue-600 focus:text-blue-700 font-medium"
            >
              <Play className="h-4 w-4" />
              Iniciar Fabricação
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                onUpdateStatus(order.id, ProductionStatusEnum.CANCELLED)
              }
              className="gap-2 cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
            >
              <XCircle className="h-4 w-4" />
              Cancelar Ordem
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem
            onClick={() => onUpdateStatus(order.id, nextStatus)}
            className="gap-2 cursor-pointer"
          >
            {(() => {
              const NextIcon = STATUS_CONFIG[nextStatus].icon;
              const actionText =
                nextStatus === ProductionStatusEnum.COMPLETED
                  ? "Finalizar Produção"
                  : `Avançar para ${STATUS_CONFIG[nextStatus].label}`;

              return (
                <>
                  <NextIcon className="h-4 w-4" />
                  {actionText}
                </>
              );
            })()}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// --- PÁGINA PRINCIPAL ---

export default function ProductionOrders() {
  const [orders, setOrders] = useState<ProductionResponse[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatusType>("all");
  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [productSearchTerm, setProductSearchTheme] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductResponse | null>(null);

  const form = useForm<ProductionOrderForm>({
    resolver: zodResolver(productionOrderSchema),
    defaultValues: {
      product: "",
      quantity: 1,
    },
  });

  const onSubmit = async (data: ProductionOrderForm) => {
    setLoading(true);
    await productionApi
      .createOrder({
        deadline: data.deadline,
        productId: data.product,
        quantity: data.quantity,
      })
      .then((resp) => {
        toast.success("Ordem criada com sucesso!");
        setDialogOpen(false);
        form.reset();
        setSelectedProduct(null);
        setProductSearchTheme("");
        getProductionOrders();
      })
      .catch((err) => {
        toast.error("Erro ao criar ordem.");
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getStatusEnum = (status?: FilterStatusType) => {
    switch (status ?? filterStatus) {
      case "cancel":
        return ProductionStatusEnum.CANCELLED;
      case "conference":
        return ProductionStatusEnum.CONFERENCE;
      case "done":
        return ProductionStatusEnum.COMPLETED;
      case "pending":
        return ProductionStatusEnum.PENDING;
      case "production":
        return ProductionStatusEnum.IN_PRODUCTION;
      default:
        return null;
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: StatusType) => {
    await productionApi
      .updateStatus({ orderId, status: newStatus })
      .then(() => {
        toast.success("Status atualizado com sucesso");
        getProductionOrders();
      })
      .catch(() => {
        toast.error("Erro ao atualizar o status");
      });
  };

  const getProductionOrders = useCallback(
    async (page = 1, searchTerm: string = "", status?: FilterStatusType) => {
      await productionApi
        .listAll({
          page,
          perPage: PaginationEnum.PER_PAGE20,
          searchTerm,
          status: status ? getStatusEnum(status) : null,
        })
        .then((resp) => {
          setOrders(resp.data.orders);
        })
        .catch(() => {
          toast.error("Erro ao buscar ordens");
          setOrders([]);
        });
    },
    []
  );

  const getProductList = async () => {
    setLoadingProducts(true);
    await productApi
      .get({
        page: 1,
        perPage: PaginationEnum.PER_PAGE20,
        searchTerm: productSearchTerm,
      })
      .then((response) => {
        setProducts(response.data.products);
      })
      .catch(() => {
        toast.error("Erro ao buscar produtos");
      })
      .finally(() => {
        setLoadingProducts(false);
      });
  };

  const handleSelectProduct = (product: ProductResponse) => {
    form.setValue("product", product!.id);
    setSelectedProduct(product);
    setProductSearchTheme(product.name);
    if (product) {
      form.clearErrors("product");
    }
  };

  useEffect(() => {
    getProductList();
  }, [productSearchTerm]);

  useEffect(() => {
    getProductionOrders();
  }, []);

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {/* Header Responsivo (Usa xs:flex-row para ajustar no celular) */}
      <div className="flex xs:flex-col md:flex-row xs:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Ordens de Produção
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Gerencie e acompanhe o processo de fabricação
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="xs:w-full md:w-auto gap-2">
              <Plus className="h-5 w-5" />
              Nova Ordem
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] w-full xs:w-[95vw] rounded-lg">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Factory className="h-5 w-5" />
                  Nova Ordem
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados para criar uma nova ordem.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Produto *</Label>
                  {!selectedProduct && (
                    <InputAutoComplete
                      onChange={(val) => setProductSearchTheme(val)}
                      onSelect={(product) => {
                        if (product) handleSelectProduct(product);
                      }}
                      options={products}
                      value={productSearchTerm}
                      placeholder="Pesquise..."
                      showAllOption={false}
                      loading={loadingProducts}
                    />
                  )}
                  {form.formState.errors.product && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.product.message}
                    </p>
                  )}
                  {selectedProduct && (
                    <div className="flex items-center justify-between p-2 border rounded-md bg-slate-50">
                      <span className="text-sm font-medium">
                        {selectedProduct.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedProduct(null);
                          setProductSearchTheme("");
                          form.setValue("product", "");
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid xs:grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Qtd *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      {...form.register("quantity")}
                      className={cn(
                        form.formState.errors.quantity && "border-red-500"
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Prazo *</Label>
                    <Input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      {...form.register("deadline", { valueAsDate: true })}
                    />
                  </div>
                </div>

                {(form.formState.errors.quantity ||
                  form.formState.errors.deadline) && (
                  <p className="text-sm text-red-500">
                    Verifique os campos obrigatórios.
                  </p>
                )}
              </div>

              <DialogFooter className="xs:flex-col md:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Criando..." : "Criar Ordem"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters Responsivo (Usa xs: para layout) */}
      <div className="flex flex-col xs:flex-row items-start xs:items-center gap-4 bg-muted/20 p-4 rounded-lg border">
        <Label
          htmlFor="status-filter"
          className="whitespace-nowrap font-medium"
        >
          Status:
        </Label>
        <Select
          value={filterStatus}
          onValueChange={(value) => {
            setFilterStatus(value as FilterStatusType);
            getProductionOrders(1, "", value as FilterStatusType);
          }}
        >
          <SelectTrigger id="status-filter" className="w-full xs:w-[250px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"all"}>Todos os Status</SelectItem>
            <SelectItem value={"cancel"}>Canceladas</SelectItem>
            <SelectItem value={"done"}>Concluídas</SelectItem>
            <SelectItem value={"conference"}>Em conferência</SelectItem>
            <SelectItem value={"production"}>Em produção</SelectItem>
            <SelectItem value={"pending"}>Ordem criada</SelectItem>
          </SelectContent>
        </Select>
        <div className="xs:hidden md:block ml-auto text-sm text-muted-foreground">
          {orders.length} registro(s)
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
            Nenhuma ordem encontrada
          </div>
        ) : (
          orders.map((order) => {
            const StatusIcon = STATUS_CONFIG[order.status].icon;
            return (
              <Card
                key={order.id}
                className="shadow-sm border-l-4"
                style={{
                  borderLeftColor:
                    order.status === ProductionStatusEnum.CANCELLED
                      ? "#ef4444"
                      : order.status === ProductionStatusEnum.COMPLETED
                      ? "#22c55e"
                      : "#3b82f6",
                }}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-xs font-mono text-muted-foreground">
                        #{order.code}
                      </span>
                      <h3 className="font-bold text-lg leading-tight">
                        {order.product.name}
                      </h3>
                    </div>
                    <OrderActions
                      order={order}
                      onUpdateStatus={updateOrderStatus}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 pb-3">
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Package className="w-3 h-3" /> Quantidade
                      </span>
                      <span className="font-semibold">
                        {order.quantity}{" "}
                        <span className="text-xs font-normal text-muted-foreground">
                          unid.
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Prazo
                      </span>
                      <span className="font-semibold">
                        {format(new Date(order.deadline), "dd/MM", {
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center">
                  <Badge
                    variant="outline"
                    className={cn(
                      "gap-1.5 py-1 px-3",
                      STATUS_CONFIG[order.status].color
                    )}
                  >
                    <StatusIcon className="h-3.5 w-3.5" />
                    {STATUS_CONFIG[order.status].label}
                  </Badge>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>

      {/* --- VISUALIZAÇÃO DESKTOP (TABLE) --- */}
      <div className="hidden md:block rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Código</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead className="text-center">Qtd.</TableHead>
              <TableHead>Prazo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-muted-foreground"
                >
                  Nenhuma ordem de produção encontrada
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => {
                const StatusIcon = STATUS_CONFIG[order.status].icon;

                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono font-medium text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Hash className="w-3 h-3" />
                        {order.code}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {order.product.name}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-mono">
                        {order.quantity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(order.deadline), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "gap-1.5",
                          STATUS_CONFIG[order.status].color
                        )}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        {STATUS_CONFIG[order.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <OrderActions
                        order={order}
                        onUpdateStatus={updateOrderStatus}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
