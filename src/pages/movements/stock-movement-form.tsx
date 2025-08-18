"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ProductCombobox } from "@/components/product-combobox";
import { SupplierCombobox } from "@/components/supplier-combobox";
import { useToast } from "@/hooks/use-toast";
import { Package, TrendingUp, TrendingDown, Settings } from "lucide-react";

type MovementType = "entrada" | "saida" | "ajuste";

interface MovementData {
  type: MovementType;
  productId: string;
  quantity: number;
  costValue?: number;
  saleValue?: number;
  supplierId?: string;
  description?: string;
}

export function StockMovementForm() {
  const [movementType, setMovementType] = useState<MovementType>("entrada");
  const [formData, setFormData] = useState<MovementData>({
    type: "entrada",
    productId: "",
    quantity: 0,
    costValue: 0,
    saleValue: 0,
    supplierId: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleTypeChange = (type: MovementType) => {
    setMovementType(type);
    setFormData({
      type,
      productId: "",
      quantity: 0,
      costValue: type === "entrada" ? 0 : undefined,
      saleValue: type === "entrada" ? 0 : undefined,
      supplierId: type === "entrada" ? "" : undefined,
      description: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validações básicas
      if (!formData.productId) {
        toast({
          title: "Erro",
          description: "Selecione um produto",
          variant: "destructive",
        });
        return;
      }

      if (formData.quantity <= 0) {
        toast({
          title: "Erro",
          description: "Quantidade deve ser maior que zero",
          variant: "destructive",
        });
        return;
      }

      if (movementType === "entrada" && !formData.supplierId) {
        toast({
          title: "Erro",
          description: "Selecione um fornecedor para entrada",
          variant: "destructive",
        });
        return;
      }

      // Simular envio para API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Sucesso!",
        description: `Movimentação de ${movementType} registrada com sucesso`,
      });

      // Reset form
      setFormData({
        type: movementType,
        productId: "",
        quantity: 0,
        costValue: movementType === "entrada" ? 0 : undefined,
        saleValue: movementType === "entrada" ? 0 : undefined,
        supplierId: movementType === "entrada" ? "" : undefined,
        description: "",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao registrar movimentação",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIcon = (type: MovementType) => {
    switch (type) {
      case "entrada":
        return <TrendingUp className="h-4 w-4" />;
      case "saida":
        return <TrendingDown className="h-4 w-4" />;
      case "ajuste":
        return <Settings className="h-4 w-4" />;
    }
  };

  const getCardColor = (type: MovementType) => {
    switch (type) {
      case "entrada":
        return "border-green-200 bg-green-50/50";
      case "saida":
        return "border-red-200 bg-red-50/50";
      case "ajuste":
        return "border-blue-200 bg-blue-50/50";
    }
  };

  return (
    <Card
      className={`${getCardColor(movementType)} transition-colors duration-200`}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Movimentação de Estoque
        </CardTitle>
        <CardDescription>
          Registre entradas, saídas e ajustes no seu estoque
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seleção do Tipo de Movimentação */}
          <div className="space-y-2">
            <Label>Tipo de Movimentação</Label>
            <div className="grid grid-cols-3 gap-3">
              {(["entrada", "saida", "ajuste"] as MovementType[]).map(
                (type) => (
                  <Button
                    key={type}
                    type="button"
                    variant={movementType === type ? "default" : "outline"}
                    onClick={() => handleTypeChange(type)}
                    className="flex items-center gap-2 capitalize"
                  >
                    {getIcon(type)}
                    {type}
                  </Button>
                )
              )}
            </div>
          </div>

          {/* Seleção do Produto */}
          <div className="space-y-2">
            <Label htmlFor="product">Produto *</Label>
            <ProductCombobox
              value={formData.productId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, productId: value }))
              }
            />
          </div>

          {/* Quantidade */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade *</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              step="1"
              value={formData.quantity || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  quantity: Number.parseInt(e.target.value) || 0,
                }))
              }
              placeholder="Digite a quantidade"
            />
          </div>

          {/* Campos específicos para ENTRADA */}
          {movementType === "entrada" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="costValue">Valor de Custo *</Label>
                  <Input
                    id="costValue"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.costValue || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        costValue: Number.parseFloat(e.target.value) || 0,
                      }))
                    }
                    placeholder="0,00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="saleValue">Valor para Venda *</Label>
                  <Input
                    id="saleValue"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.saleValue || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        saleValue: Number.parseFloat(e.target.value) || 0,
                      }))
                    }
                    placeholder="0,00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier">Fornecedor *</Label>
                <SupplierCombobox
                  value={formData.supplierId || ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, supplierId: value }))
                  }
                />
              </div>
            </>
          )}

          {/* Campo de Valor para SAÍDA */}
          {movementType === "saida" && (
            <div className="space-y-2">
              <Label htmlFor="value">Valor</Label>
              <Input
                id="value"
                type="number"
                min="0"
                step="0.01"
                value={formData.costValue || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    costValue: Number.parseFloat(e.target.value) || 0,
                  }))
                }
                placeholder="0,00"
              />
            </div>
          )}

          {/* Descrição (opcional para todos os tipos) */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Descrição {movementType !== "ajuste" && "(opcional)"}
            </Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Digite uma descrição para esta movimentação..."
              rows={3}
            />
          </div>

          {/* Botão de Submit */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting
              ? "Registrando..."
              : `Registrar ${
                  movementType.charAt(0).toUpperCase() + movementType.slice(1)
                }`}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
