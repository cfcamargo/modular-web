import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Printer } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Quote } from "@/models/common/quotes";

interface PrintPreviewProps {
  quote: Quote;
  subtotal: number;
  total: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PrintPreview = ({
  quote,
  subtotal,
  total,
  open,
  onOpenChange,
}: PrintPreviewProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const calculateItemSubtotal = (item: any): number => {
    const qty =
      typeof item.quantity === "string"
        ? parseFloat(item.quantity) || 0
        : item.quantity || 0;
    const price =
      typeof item.unitPrice === "string"
        ? parseFloat(item.unitPrice) || 0
        : item.unitPrice || 0;
    const discount =
      typeof item.discount === "string"
        ? parseFloat(item.discount) || 0
        : item.discount || 0;

    return qty * price * (1 - discount / 100);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="print:hidden">
          <DialogTitle className="flex items-center justify-between">
            Visualização de Impressão
            <Button onClick={handlePrint} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Imprimir
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="print:p-0 print:bg-white print:text-black">
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">ORÇAMENTO</h1>
              <p className="text-muted-foreground">
                Data: {format(new Date(), "dd/MM/yyyy", { locale: ptBR })}
              </p>
            </div>

            <Separator />

            {/* Customer Info */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Dados do Cliente</h2>
              {quote.customer ? (
                <div className="space-y-1">
                  <p>
                    <strong>Cliente:</strong> {quote.customer.name}
                  </p>
                  {quote.customer.email && (
                    <p>
                      <strong>Email:</strong> {quote.customer.email}
                    </p>
                  )}
                  {quote.customer.phone && (
                    <p>
                      <strong>Telefone:</strong> {quote.customer.phone}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">Cliente não selecionado</p>
              )}
            </div>

            {/* Quote Details */}
            <div>
              <h2 className="text-lg font-semibold mb-3">
                Detalhes do Orçamento
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>Validade:</strong>
                  </p>
                  <p>
                    {quote.validUntil
                      ? format(quote.validUntil, "dd/MM/yyyy", { locale: ptBR })
                      : "Não definida"}
                  </p>
                </div>
              </div>
              {quote.notes && (
                <div className="mt-4">
                  <p>
                    <strong>Observações:</strong>
                  </p>
                  <p className="whitespace-pre-wrap">{quote.notes}</p>
                </div>
              )}
            </div>

            {/* Items Table */}
            <div>
              <h2 className="text-lg font-semibold mb-3">Itens</h2>
              {quote.items.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-2 text-left">
                          Produto
                        </th>
                        <th className="border border-border p-2 text-center">
                          Qtd
                        </th>
                        <th className="border border-border p-2 text-right">
                          Preço Unit.
                        </th>
                        <th className="border border-border p-2 text-center">
                          Desc. %
                        </th>
                        <th className="border border-border p-2 text-right">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {quote.items.map((item) => (
                        <tr key={item.id}>
                          <td className="border border-border p-2">
                            {item.product?.name || "Produto não selecionado"}
                          </td>
                          <td className="border border-border p-2 text-center">
                            {item.quantity}
                          </td>
                          <td className="border border-border p-2 text-right">
                            {formatCurrency(
                              typeof item.unitPrice === "string"
                                ? parseFloat(item.unitPrice) || 0
                                : item.unitPrice || 0
                            )}
                          </td>
                          <td className="border border-border p-2 text-center">
                            {item.discount || 0}%
                          </td>
                          <td className="border border-border p-2 text-right font-medium">
                            {formatCurrency(calculateItemSubtotal(item))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground">Nenhum item adicionado</p>
              )}
            </div>

            {/* Totals */}
            <div className="border-t pt-4">
              <div className="flex flex-col items-end space-y-2">
                <div className="flex justify-between w-64">
                  <span>Subtotal:</span>
                  <span className="font-medium">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                {quote.extraDiscount &&
                  parseFloat(quote.extraDiscount.toString()) > 0 && (
                    <div className="flex justify-between w-64">
                      <span>Desconto:</span>
                      <span className="font-medium text-destructive">
                        -
                        {formatCurrency(
                          parseFloat(quote.extraDiscount.toString())
                        )}
                      </span>
                    </div>
                  )}

                {quote.freight && parseFloat(quote.freight.toString()) > 0 && (
                  <div className="flex justify-between w-64">
                    <span>Frete:</span>
                    <span className="font-medium">
                      {formatCurrency(parseFloat(quote.freight.toString()))}
                    </span>
                  </div>
                )}

                <Separator className="w-64" />
                <div className="flex justify-between w-64 text-lg font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
