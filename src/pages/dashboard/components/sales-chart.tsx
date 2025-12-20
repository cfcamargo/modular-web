import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DashboardChartItem } from "@/models/responses/dashboard-response";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface SalesChartProps {
  data: DashboardChartItem[];
}

export function SalesChart({ data }: SalesChartProps) {
  const chartConfig = {
    value: {
      label: "Vendas",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle>Evolução de Vendas</CardTitle>
        <CardDescription>
          Faturamento total distribuído pelo período selecionado
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 && (
          <div className="flex items-center justify-center mt-20">
            <p className="text-center text-muted-foreground">
              Nenhum dado disponível para o período selecionado.
            </p>
          </div>
        )}
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            data={data}
            margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />

            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                Intl.NumberFormat("pt-BR", {
                  notation: "compact",
                  compactDisplay: "short",
                  style: "currency",
                  currency: "BRL",
                }).format(value)
              }
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dashed"
                  formatter={(value) =>
                    new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(value))
                  }
                />
              }
            />

            <Bar
              dataKey="value"
              fill="var(--color-value)"
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
