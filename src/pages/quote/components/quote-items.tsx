import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Package, Edit } from "lucide-react";
import { ItemModal } from "./item-modal";
import { QuoteItem } from "@/models/common/quotes";

interface QuoteItemsProps {
  items: QuoteItem[];
  onAddItem: (item: QuoteItem) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateItem: (itemId: string, updatedItem: QuoteItem) => void;
  calculateItemSubtotal: (item: QuoteItem) => number;
}

export const QuoteItems = ({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  calculateItemSubtotal,
}: QuoteItemsProps) => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<QuoteItem | null>(null);

  const handleAddItem = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEditItem = (item: QuoteItem) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleSaveItem = (item: QuoteItem) => {
    if (editingItem) {
      onUpdateItem(editingItem.id, item);
    } else {
      onAddItem(item);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Package className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">
        Nenhum item adicionado
      </h3>
      <p className="text-muted-foreground mb-4">
        Comece adicionando produtos ao seu orçamento
      </p>
      <Button onClick={handleAddItem} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Adicionar primeiro item
      </Button>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Itens do Orçamento
          </CardTitle>
          {items.length > 0 && (
            <Button
              onClick={handleAddItem}
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Adicionar Item
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="w-24">Qtd</TableHead>
                  <TableHead className="w-32">Preço Unit.</TableHead>
                  <TableHead className="w-24">Desc. %</TableHead>
                  <TableHead className="w-32">Subtotal</TableHead>
                  <TableHead className="w-20">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="font-medium">
                        {item.product?.name || "Produto não selecionado"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">
                        {item.quantity}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">
                        {typeof item.unitPrice === "string"
                          ? `R$ ${parseFloat(item.unitPrice || "0")
                              .toFixed(2)
                              .replace(".", ",")}`
                          : `R$ ${(item.unitPrice || 0)
                              .toFixed(2)
                              .replace(".", ",")}`}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground">
                        {item.discount ? `${item.discount}%` : "0%"}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(calculateItemSubtotal(item))}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditItem(item)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(item.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <ItemModal
        open={showModal}
        onOpenChange={setShowModal}
        item={editingItem}
        onSave={handleSaveItem}
      />
    </Card>
  );
};
