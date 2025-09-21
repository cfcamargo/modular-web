import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calculator } from "lucide-react";

interface QuoteTotalsProps {
  subtotal: number;
  total: number;
  extraDiscount: number | string;
  freight: number | string;
  onUpdateExtraDiscount: (value: string) => void;
  onUpdateFreight: (value: string) => void;
}

export const QuoteTotals = ({
  subtotal,
  total,
  extraDiscount,
  freight,
  onUpdateExtraDiscount,
  onUpdateFreight,
}: QuoteTotalsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Totais do Orçamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b">
          <span className="font-medium text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="extraDiscount">Desconto Adicional (R$)</Label>
          <Input
            id="extraDiscount"
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            value={extraDiscount}
            onChange={(e) => onUpdateExtraDiscount(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="freight">Frete (R$)</Label>
          <Input
            id="freight"
            type="number"
            min="0"
            step="0.01"
            placeholder="0,00"
            value={freight}
            onChange={(e) => onUpdateFreight(e.target.value)}
          />
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold">Total</span>
            <span className="text-xl font-bold text-primary">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
