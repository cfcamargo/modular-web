import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Factory,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  MoreHorizontal,
  X,
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { da, ptBR } from "date-fns/locale";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { ProductionResponse } from "@/models/responses/production-response";
import { productApi, productionApi } from "@/api";
import {
  CreateProductRequest,
  ProductionRequest,
} from "@/models/requests/production-request";
import { PaginationEnum } from "@/utils/enums/PaginationEnum";
import { ProductionStatusEnum } from "@/utils/enums/ProductionStatusEnum";
import { ProductResponse } from "@/models/responses/product-response";
import { InputAutoComplete } from "@/components/shared/input-auto-complete";
import { GridRequest } from "@/models/requests/grid-request";

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

const productionOrderSchema = z.object({
  product: z.string().min(1, "Selecione um produto"),
  quantity: z.coerce.number().min(1, "Quantidade mínima é 1"),
  deadline: z.date({ required_error: "Selecione uma data" }),
});

type ProductionOrderForm = z.infer<typeof productionOrderSchema>;

type FilterStatusType =
  | "cancel"
  | "done"
  | "production"
  | "conference"
  | "pending"
  | "all";

export function ProductionOrders() {
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
    const request: CreateProductRequest = {
      deadline: data.deadline,
      productId: data.product,
      quantity: data.quantity,
    };

    setLoading(true);
    await productionApi
      .createOrder(request)
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => {
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
      .then((resp) => {
        console.log(resp);
        toast.success("Status atualizado com sucesso");
        getProductionOrders();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Erro ao atualizar o status");
      });
  };

  const getNextStatus = (currentStatus: StatusType): StatusType | null => {
    const currentIndex = STATUS_FLOW.indexOf(currentStatus);
    if (currentIndex < STATUS_FLOW.length - 1) {
      return STATUS_FLOW[currentIndex + 1];
    }
    return null;
  };

  const getProductionOrders = useCallback(
    async (page = 1, searchTerm: string = "", status?: FilterStatusType) => {
      const request: ProductionRequest = {
        page,
        perPage: PaginationEnum.PER_PAGE20,
        searchTerm,
        status: status ? getStatusEnum(status) : null,
      };

      await productionApi
        .listAll(request)
        .then((resp) => {
          console.log(resp);
          setOrders(resp.data.orders);
        })
        .catch((err) => {
          toast.error("Erro ao buscar produtos");
          setOrders([]);
        })
        .finally(() => {
          console.log("finalizou");
        });
    },
    []
  );

  const getProductList = async () => {
    const request: GridRequest = {
      page: 1,
      perPage: PaginationEnum.PER_PAGE20,
      searchTerm: productSearchTerm,
    };
    setLoadingProducts(true);
    await productApi
      .get(request)
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
    if (product) {
      form.clearErrors("product");
    }
    setProductSearchTheme("");
  };

  useEffect(() => {
    getProductList();
  }, [productSearchTerm]);

  useEffect(() => {
    getProductionOrders();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Ordens de Produção
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie e acompanhe o processo de fabricação dos produtos
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Nova Ordem de Produção
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Factory className="h-5 w-5" />
                  Nova Ordem de Produção
                </DialogTitle>
                <DialogDescription>
                  Preencha os dados para criar uma nova ordem de produção. O
                  status inicial será "Ordem Realizada".
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Produto *</Label>
                  {!selectedProduct && (
                    <InputAutoComplete
                      onChange={(val) => {
                        setProductSearchTheme(val);
                      }}
                      onSelect={(product) => {
                        if (product) {
                          handleSelectProduct(product);
                        }
                      }}
                      options={products}
                      value={productSearchTerm}
                      placeholder="Pesquise um produto"
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
                    <p className="w-full flex justify-between items-center">
                      {selectedProduct.name}
                      <Button
                        onClick={() => {
                          setSelectedProduct(null);
                          form.setValue("product", "");
                        }}
                      >
                        <X />
                      </Button>
                    </p>
                  )}
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantidade a Produzir *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    {...form.register("quantity")}
                    className={cn(
                      form.formState.errors.quantity && "border-red-500"
                    )}
                  />
                  {form.formState.errors.quantity && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.quantity.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Prazo de Fabricação *</Label>
                  <Input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    {...form.register("deadline", { valueAsDate: true })}
                  />
                  {form.formState.errors.deadline && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.deadline.message}
                    </p>
                  )}
                </div>

                <div className="rounded-lg border bg-muted/50 p-3">
                  <p className="text-sm text-muted-foreground">
                    Status inicial:{" "}
                    <Badge
                      variant="outline"
                      className={
                        STATUS_CONFIG[ProductionStatusEnum.PENDING].color
                      }
                    >
                      {STATUS_CONFIG[ProductionStatusEnum.PENDING].label}
                    </Badge>
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Criar Ordem de Produção</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Label htmlFor="status-filter" className="whitespace-nowrap">
          Filtrar por status:
        </Label>
        <Select
          value={filterStatus}
          onValueChange={(value) => {
            setFilterStatus(value as FilterStatusType);
            getProductionOrders(1, "", value);
          }}
        >
          <SelectTrigger id="status-filter" className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"all"}>Todos os Status</SelectItem>
            <SelectItem value={"cancel"}>Canceladas</SelectItem>
            <SelectItem value={"done"}>Concluidas</SelectItem>
            <SelectItem value={"conference"}>Em conferencia</SelectItem>
            <SelectItem value={"production"}>Em producao</SelectItem>
            <SelectItem value={"pending"}>Ordem criada</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto text-sm text-muted-foreground">
          {orders.length}{" "}
          {orders.length === 1 ? "ordem encontrada" : "ordens encontradas"}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Numero</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead className="text-center">Quantidade</TableHead>
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
                const nextStatus = getNextStatus(order.status);

                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono font-semibold">
                      {order.code}
                    </TableCell>
                    <TableCell>{order.product.name}</TableCell>
                    <TableCell className="text-center font-semibold">
                      {order.quantity}
                    </TableCell>
                    <TableCell>
                      {format(order.deadline, "dd/MM/yyyy", { locale: ptBR })}
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
                    {order.status !== ProductionStatusEnum.CANCELLED && (
                      <TableCell className="text-right">
                        {nextStatus ? (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {order.status ===
                                ProductionStatusEnum.PENDING && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      updateOrderStatus(
                                        order.id,
                                        ProductionStatusEnum.CANCELLED
                                      )
                                    }
                                    className="gap-2"
                                  >
                                    {(() => {
                                      const NextIcon =
                                        STATUS_CONFIG[nextStatus].icon;
                                      return <NextIcon className="h-4 w-4" />;
                                    })()}
                                    Cancelar ordem
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      updateOrderStatus(
                                        order.id,
                                        ProductionStatusEnum.IN_PRODUCTION
                                      )
                                    }
                                    className="gap-2"
                                  >
                                    {(() => {
                                      const NextIcon =
                                        STATUS_CONFIG[
                                          ProductionStatusEnum.IN_PRODUCTION
                                        ].icon;
                                      return <NextIcon className="h-4 w-4" />;
                                    })()}
                                    Avançar para:{" "}
                                    {
                                      STATUS_CONFIG[
                                        ProductionStatusEnum.IN_PRODUCTION
                                      ].label
                                    }
                                  </DropdownMenuItem>
                                </>
                              )}
                              {order.status !==
                                ProductionStatusEnum.PENDING && (
                                <DropdownMenuItem
                                  onClick={() =>
                                    updateOrderStatus(order.id, nextStatus)
                                  }
                                  className="gap-2"
                                >
                                  {(() => {
                                    const NextIcon =
                                      STATUS_CONFIG[nextStatus].icon;
                                    return <NextIcon className="h-4 w-4" />;
                                  })()}
                                  Avançar para:{" "}
                                  {STATUS_CONFIG[nextStatus].label}
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Finalizado
                          </Badge>
                        )}
                      </TableCell>
                    )}
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
