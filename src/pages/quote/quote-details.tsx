import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Printer,
  CheckCircle,
  Clock,
  Package,
  FileText,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Link, useNavigate, useParams } from "react-router-dom";
import { orderApi } from "@/api";
import OrderFormSkeleton from "./components/quote-details-skeleton";
import { OrderStatusEnum } from "@/utils/enums/OrderStatusEnum";
import { OrderDetailsResponse } from "@/models/responses/order-response";

// Status configuration
const STATUS_CONFIG = {
  [OrderStatusEnum.DRAFT]: {
    label: "Orçamento",
    color: "bg-slate-100 text-slate-800 border-slate-300",
    icon: FileText,
  },
  [OrderStatusEnum.SHIPMENT]: {
    label: "Entregando",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: Clock,
  },
  [OrderStatusEnum.CONFIRMED]: {
    label: "Confirmado",
    color: "bg-blue-100 text-blue-800 border-blue-300",
    icon: Package,
  },
  [OrderStatusEnum.DONE]: {
    label: "Entregue",
    color: "bg-green-100 text-green-800 border-green-300",
    icon: CheckCircle,
  },
  [OrderStatusEnum.CANCELED]: {
    label: "Cancelado",
    color: "bg-red-100 text-red-800 border-red-300",
    icon: X,
  },
  [OrderStatusEnum.PENDING]: {
    label: "Pendente",
    color: "bg-orange-100 text-orange-800 border-orange-300",
    icon: X,
  },
} as const;

export function OrderDetails() {
  const [order, setOrder] = useState<OrderDetailsResponse | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [loadingChangeStatus, setLoadingChangeStatus] = useState(false);

  const [showGenerateOrderDialog, setShowGenerateOrderDialog] = useState(false);

  const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState<OrderStatusEnum | null>(
    null,
  );

  const { id } = useParams();

  const handleGenerateOrder = async () => {
    if (!order) return;
    await orderApi
      .changeStatus({
        id: order.id,
        status: OrderStatusEnum.PENDING,
      })
      .then(() => {
        toast.success("Pedido gerado com sucesso!");
        getOrderDetails();
      })
      .catch(() => {
        toast.error("Erro ao gerar pedido");
      })
      .finally(() => {
        setShowGenerateOrderDialog(false);
      });
  };

  const handlePrint = () => {
    window.print();
    toast.success("Abrindo visualização de impressão...");
  };

  const handleCancelOrder = async () => {
    setLoadingCancel(true);
    await orderApi.cancelOrderApi(order?.id!).then(() => {
      toast.success("Pedido cancelado com sucesso!");
      navigate("/quotes");
    });
  };

  const navigate = useNavigate();

  const getOrderDetails = async () => {
    await orderApi
      .findOne(id!)
      .then((resp) => {
        console.log(resp);
        setOrder(resp.data);
        setSelectedStatus(resp.data.status);
      })
      .catch(() => {
        toast.error("Erro ao buscar dados do pedido ou pedido nao existe");
        navigate("/quotes");
      })
      .finally(() => {
        setLoadingData(false);
      });
  };

  const changeStatus = async () => {
    if (!order || !selectedStatus) return;
    setLoadingChangeStatus(true);

    await orderApi
      .changeStatus({
        id: order.id,
        status: selectedStatus!,
      })
      .then(() => {
        toast.success("Status alterado com sucesso");
        setOrder({ ...order, status: selectedStatus });
        setShowStatusDialog(false);
      })
      .catch(() => {
        toast.error("Erro ao alterar status");
      })
      .finally(() => {
        setLoadingChangeStatus(false);
      });
  };

  const isQuotation = order?.status === OrderStatusEnum.DRAFT;

  useEffect(() => {
    getOrderDetails();
  }, []);

  if (loadingData) {
    return <OrderFormSkeleton />;
  }

  const StatusIcon = STATUS_CONFIG[order?.status!].icon;

  return (
    <div className="min-h-screen print:bg-white print:p-0 print:text-sm">
      <div className="mx-auto max-w-5xl space-y-6 print:space-y-4">
        {/* Header - Hidden on print */}
        <div className="flex items-center justify-between print:hidden">
          <div className="flex items-center gap-4">
            <Link to="/quotes">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{order?.code}</h1>
              <p className="text-sm text-muted-foreground">
                Detalhes do {isQuotation ? "orçamento" : "pedido"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            {order?.status === OrderStatusEnum.CONFIRMED && (
              <Button
                variant="destructive"
                onClick={() => setShowCancelOrderModal(true)}
              >
                <Printer className="mr-2 h-4 w-4" />
                Cancelar Pedido
              </Button>
            )}
          </div>
        </div>

        {/* Print Header - Only visible on print */}
        <div className="hidden print:block mb-8">
          <div className="text-center border-b-2 border-foreground pb-4 mb-6">
            <h1 className="text-2xl font-bold mb-1">Modular Pre Moldados</h1>
            <p className="text-sm">
              CNPJ: 26.181.053/0001-40 | Tel: (67) 9 9801-0803
            </p>
            <p className="text-sm">contato@grupomodularms.com.br</p>
          </div>
        </div>

        {/* Watermark for quotations - only on print */}
        {isQuotation && (
          <div className="hidden print:block fixed inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="text-9xl font-bold text-muted-foreground/10 rotate-[-45deg] select-none">
              ORÇAMENTO
            </div>
          </div>
        )}

        {/* Status and Actions - Hidden on print */}
        <div className="flex items-center justify-between gap-4 print:hidden">
          <Badge
            variant="outline"
            className={cn(
              "gap-2 text-base px-4 py-2",
              STATUS_CONFIG[order?.status!].color,
            )}
          >
            <StatusIcon className="h-5 w-5" />
            {STATUS_CONFIG[order?.status!].label}
          </Badge>

          <div className="flex items-center gap-2">
            {order?.status === OrderStatusEnum.DRAFT && (
              <Button onClick={() => setShowGenerateOrderDialog(true)}>
                <Package className="mr-2 h-4 w-4" />
                Gerar Pedido
              </Button>
            )}
            {order?.status !== OrderStatusEnum.CANCELED &&
              order?.status !== OrderStatusEnum.CONFIRMED && !isQuotation && (
                <Button
                  variant="outline"
                  onClick={() => setShowStatusDialog(true)}
                >
                  Alterar Status
                </Button>
              )}
          </div>
        </div>

        {/* Order Info */}
        <div className="grid gap-6 print:block print:space-y-2">
          {/* Order Info */}
          <Card className="print:shadow-none print:border-none print:mb-2">
            <CardHeader className="print:hidden">
              <CardTitle>
                Informações do {isQuotation ? "Orçamento" : "Pedido"}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2 print:flex print:flex-wrap print:gap-x-6 print:items-center print:px-0 print:py-0">
              <div className="print:flex print:items-center print:gap-2">
                <p className="text-sm text-muted-foreground mb-1 print:mb-0 print:font-semibold">Número:</p>
                <p className="font-mono font-semibold text-lg print:text-sm">{order?.code}</p>
              </div>
              <div className="print:flex print:items-center print:gap-2">
                <p className="text-sm text-muted-foreground mb-1 print:mb-0 print:font-semibold">Data:</p>
                <p className="font-semibold print:text-sm">
                  {format(order?.createdAt!, "dd/MM/yyyy", { locale: ptBR })}
                </p>
              </div>
              <div className="print:hidden">
                <p className="text-sm text-muted-foreground mb-1">Status</p>
                <Badge
                  variant="outline"
                  className={cn("gap-1.5", STATUS_CONFIG[order?.status!].color)}
                >
                  <StatusIcon className="h-4 w-4" />
                  {STATUS_CONFIG[order?.status!].label}
                </Badge>
              </div>
              {order?.observation && (
                <div className="md:col-span-2 print:w-full print:mt-1">
                  <span className="text-sm text-muted-foreground mb-1 print:mb-0 print:font-semibold print:mr-2">
                    Observações:
                  </span>
                  <span className="text-sm">{order.observation}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Info */}
          {order?.client && (
            <Card className="print:shadow-none print:border-none">
              <CardHeader className="print:hidden">
                <CardTitle>Dados do Cliente</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 print:flex print:flex-wrap print:gap-x-6 print:items-center print:px-0 print:py-0">
                <div className="print:flex print:flex-col print:items-start print:gap-2">
                  <p className="text-sm text-muted-foreground mb-1 print:mb-0 print:font-semibold">Nome:</p>
                  <p className="font-semibold print:text-sm">{order.client.name}</p>
                </div>
                <div className="print:flex print:flex-col print:items-start print:gap-2">
                  <p className="text-sm text-muted-foreground mb-1 print:mb-0 print:font-semibold">CPF/CNPJ:</p>
                  <p className="font-mono print:text-sm">{order.client.document}</p>
                </div>
                <div className="print:flex print:flex-col print:items-center print:gap-2">
                  <p className="text-sm text-muted-foreground mb-1 print:mb-0 print:font-semibold">Telefone:</p>
                  <p className="print:text-sm">{order.client.phone ?? "-"}</p>
                </div>
                <div className="print:flex print:flex-col print:items-center print:gap-2">
                  <p className="text-sm text-muted-foreground mb-1 print:mb-0 print:font-semibold">Email:</p>
                  <p className="print:text-sm">{order.client.email ?? "-"}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Items */}
        <Card className="print:shadow-none print:border-none">
          <CardHeader className="print:px-0 print:py-2">
            <CardTitle>
              Itens do {isQuotation ? "Orçamento" : "Pedido"}
            </CardTitle>
          </CardHeader>
          <CardContent className="print:px-0 print:py-0">
            <div className="rounded-md border print:border-none">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead className="text-center">Quantidade</TableHead>
                    <TableHead className="text-right">Valor Unit.</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order?.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.product.name}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        R$ {Number(item.price).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        R$ {Number(item.subtotal)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Address */}
        {/*{order?.shippingCost && order. && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Endereço de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{order.deliveryAddress}</p>
            </CardContent>
          </Card>
        )}*/}

        {/* Order Totals */}
        <Card className="print:shadow-none print:border-none print:break-inside-avoid">
          <CardHeader className="print:px-0 print:py-2">
            <CardTitle>Totais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 print:px-0 print:py-0">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal dos Itens:</span>
              <span className="font-medium">R$ {order?.finalTotal}</span>
            </div>

            {order?.shippingCost! > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Frete:</span>
                <span className="font-medium text-blue-600">
                  + R$ {order?.shippingCost.toFixed(2)}
                </span>
              </div>
            )}

            {order?.totalDiscount! > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Desconto:</span>
                <span className="font-medium text-green-600">
                  - R$ {order?.totalDiscount!.toFixed(2)}
                </span>
              </div>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-xl font-bold">TOTAL:</span>
              <span className="text-2xl font-bold text-primary">
                R$ {order?.finalTotal}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="hidden print:block pt-16 break-inside-avoid">
          <div className="flex justify-center">
            <div className="w-2/3 border-t border-black pt-2 text-center">
              <p className="font-medium">{order?.client?.name}</p>
              <p className="text-sm text-muted-foreground">Assinatura do Cliente</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Change Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Status</DialogTitle>
            <DialogDescription>
              Selecione o novo status para este pedido
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <Select
              value={selectedStatus}
              onValueChange={(value) =>
                setSelectedStatus(value as OrderStatusEnum)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={OrderStatusEnum.CONFIRMED}>
                  Confirmado
                </SelectItem>
                <SelectItem value={OrderStatusEnum.SHIPMENT}>
                  Rota de Entrega
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStatusDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={changeStatus} disabled={loadingChangeStatus}>
              {loadingChangeStatus ? "Alterando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Order Dialog */}
      <Dialog
        open={showCancelOrderModal}
        onOpenChange={setShowCancelOrderModal}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar o Pedido</DialogTitle>
            <DialogDescription>
              Deseja cancelar pedido? Os itens voltarao ao estoque. Ao confirmar
              não ha como reverter essa acão.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelOrderModal(false)}
              disabled={loadingCancel}
            >
              Cancelar
            </Button>
            <Button disabled={loadingCancel} onClick={handleCancelOrder}>
              {loadingCancel ? "Cancelando" : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Order Dialog */}
      <Dialog
        open={showGenerateOrderDialog}
        onOpenChange={setShowGenerateOrderDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gerar Pedido</DialogTitle>
            <DialogDescription>
              Deseja converter este orçamento em um pedido? O status será
              alterado para "Pendente".
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowGenerateOrderDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleGenerateOrder}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
