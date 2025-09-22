import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Printer, Save } from "lucide-react";
import { Quote, QuoteItem } from "@/models/common/quotes";
import { toast } from "sonner";
import { QuoteInfo } from "./components/quote-info";
import { QuoteItems } from "./components/quote-items";
import { QuoteTotals } from "./components/quote-totals";
import { PrintPreview } from "./components/print-preview";

export default function NewQuote() {
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  const [quote, setQuote] = useState<Quote>({
    customer: null,
    validUntil: null,
    notes: "",
    items: [],
    freight: "",
    extraDiscount: "",
  });

  // const addItem = (item: QuoteItem) => {
  //   const newItem: QuoteItem = {
  //     ...item,
  //     id: new Date().getTime().toString(),
  //   };
  //   setQuote((prev) => ({
  //     ...prev,
  //     items: [...prev.items, newItem],
  //   }));
  // };

  const toNum = (v: number | string | undefined | null) => Number(v ?? 0) || 0;

  const addItem = (item: QuoteItem) => {
    if (!item?.product?.id) return;

    setQuote((prev) => {
      const items = prev.items ?? [];
      const idx = items.findIndex((it) => it.product?.id === item.product!.id);

      if (idx === -1) {
        // novo item
        const newItem: QuoteItem = {
          ...item,
          id: String(Date.now()),
          quantity: toNum(item.quantity),
          unitPrice: toNum(item.unitPrice),
          discount: toNum(item.discount ?? 0),
        };
        return { ...prev, items: [...items, newItem] };
      }

      // já existe → mescla: soma quantidade e atualiza os outros campos
      const existing = items[idx];
      const merged: QuoteItem = {
        ...existing,
        ...item, // atualiza campos do novo
        id: existing.id, // mantém o id original da linha
        quantity: toNum(existing.quantity) + toNum(item.quantity),
        unitPrice: toNum(item.unitPrice),
        discount: toNum(item.discount ?? existing.discount ?? 0),
      };

      const next = [...items];
      next[idx] = merged;
      return { ...prev, items: next };
    });
  };

  const removeItem = (itemId: string) => {
    setQuote((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };

  const updateItem = (itemId: string, updatedItem: QuoteItem) => {
    setQuote((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId ? { ...updatedItem, id: itemId } : item
      ),
    }));
  };

  const calculateItemSubtotal = (item: QuoteItem): number => {
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

  const calculateSubtotal = (): number => {
    return quote.items.reduce(
      (sum, item) => sum + calculateItemSubtotal(item),
      0
    );
  };

  const calculateTotal = (): number => {
    const subtotal = calculateSubtotal();
    const extraDiscount =
      typeof quote.extraDiscount === "string"
        ? parseFloat(quote.extraDiscount) || 0
        : quote.extraDiscount || 0;
    const freight =
      typeof quote.freight === "string"
        ? parseFloat(quote.freight) || 0
        : quote.freight || 0;

    return subtotal - extraDiscount + freight;
  };

  const handleSave = () => {
    toast.success("Orçamento salvo com sucesso!");
  };

  const handleGenerateOrder = () => {
    if (quote.items.length === 0 || !quote.validUntil) {
      toast.warning("Adicione itens e defina a validade para gerar o pedido.");
      return;
    }

    toast.success("O pedido foi gerado com sucesso a partir do orçamento.");
  };

  const handlePrint = () => {
    setShowPrintPreview(true);
  };

  const canGenerateOrder = quote.items.length > 0 && quote.validUntil !== null;

  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Novo Orçamento
              </h1>
              <p className="text-muted-foreground">
                Crie um novo orçamento para seus clientes
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handlePrint}
                className="flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                Imprimir
              </Button>

              <Button
                variant="outline"
                onClick={handleSave}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Salvar
              </Button>

              <Button
                onClick={handleGenerateOrder}
                disabled={!canGenerateOrder}
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Gerar Pedido
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="">
            <QuoteInfo quote={quote} onUpdate={setQuote} />

            <QuoteItems
              items={quote.items}
              onAddItem={addItem}
              onRemoveItem={removeItem}
              onUpdateItem={updateItem}
              calculateItemSubtotal={calculateItemSubtotal}
            />
          </div>

          <QuoteTotals
            subtotal={calculateSubtotal()}
            total={calculateTotal()}
            extraDiscount={quote.extraDiscount!}
            freight={quote.freight!}
            onUpdateExtraDiscount={(value) =>
              setQuote((prev) => ({ ...prev, extraDiscount: value }))
            }
            onUpdateFreight={(value) =>
              setQuote((prev) => ({ ...prev, freight: value }))
            }
          />
        </div>
      </div>

      <PrintPreview
        quote={quote}
        subtotal={calculateSubtotal()}
        total={calculateTotal()}
        open={showPrintPreview}
        onOpenChange={setShowPrintPreview}
      />
    </div>
  );
}
