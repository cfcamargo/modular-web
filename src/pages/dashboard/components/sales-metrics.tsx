import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package } from "lucide-react";
import { DashboardKPI } from "@/models/responses/dashboard-response";

interface SalesMetricsProps {
  kpi: DashboardKPI;
  loading: boolean;
}

export function SalesMetrics({ kpi, loading }: SalesMetricsProps) {
  const metrics = useMemo(() => {
    console.log(kpi);

    return [
      {
        title: "Total de Vendas",
        value: `R$ ${kpi ? kpi.totalRevenue : 0}`,
        icon: DollarSign,
      },
      {
        title: "Qtd. de Pedidos",
        value: kpi ? kpi.totalOrders : 0,
        icon: Package,
      },
      {
        title: "Qtd. de Orçamentos",
        value: kpi ? kpi.totalQuotes : 0,
        icon: Package,
      },
    ];
  }, [loading]);

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {metric.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
