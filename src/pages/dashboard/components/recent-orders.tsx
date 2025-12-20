import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RecentOrder } from "@/models/responses/dashboard-response";
import { OrderStatusEnum } from "@/utils/enums/OrderStatusEnum";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PackageOpen } from "lucide-react";

const statusConfig: Record<
  OrderStatusEnum,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  CONFIRMED: { label: "Confirmado", variant: "default" },
  DONE: { label: "Concluído", variant: "outline" },
  SHIPMENT: { label: "Enviado", variant: "secondary" },
  DRAFT: { label: "Rascunho", variant: "secondary" },
  CANCELED: { label: "Cancelado", variant: "destructive" },
};

interface RecentOrdersProps {
  orders: RecentOrder[];
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatTime = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: ptBR,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Últimos Pedidos</CardTitle>
        <CardDescription>
          {orders.length > 0
            ? `Os ${orders.length} pedidos mais recentes no período`
            : "Nenhum pedido recente encontrado"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {orders.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[400px]">
              <p className="text-sm text-muted-foreground font-medium">
                <PackageOpen size={60} />
              </p>
            </div>
          )}
          <div className="space-y-4">
            {orders.map((order) => {
              const statusInfo = statusConfig[order.status] || {
                label: order.status,
                variant: "secondary",
              };

              return (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">
                        {order.code}
                      </p>
                      <Badge variant={statusInfo.variant}>
                        {statusInfo.label}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground font-medium">
                      {order.clientName}
                    </p>
                  </div>

                  <div className="text-right space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      {formatCurrency(order.total)}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {formatTime(order.date)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
