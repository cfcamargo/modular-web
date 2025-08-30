import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Package,
  TrendingUp,
  TrendingDown,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { stockMovementApi } from "@/api/stock-movement-api";
import { ProductApi } from "@/api/product-api";

const productApi = new ProductApi();
import { ProductResponse } from "@/models/responses/product-response";
import { StockMovementForm } from "./stock-movement-form";

// Schemas de validação
const entrySchema = z.object({
  productId: z.string().min(1, "Produto é obrigatório"),
  quantity: z
    .string()
    .min(1, "Quantidade é obrigatória")
    .refine(
      (val) =>
        !isNaN(parseFloat(val.replace(",", "."))) &&
        parseFloat(val.replace(",", ".")) > 0,
      "Quantidade deve ser um número positivo"
    ),
  unitCost: z.number().min(0.01, "Custo unitário é obrigatório"),
  description: z.string().optional(),
});

const exitSchema = z.object({
  productId: z.string().min(1, "Produto é obrigatório"),
  quantity: z
    .string()
    .min(1, "Quantidade é obrigatória")
    .refine(
      (val) =>
        !isNaN(parseFloat(val.replace(",", "."))) &&
        parseFloat(val.replace(",", ".")) > 0,
      "Quantidade deve ser um número positivo"
    ),
  unitSalePrice: z.number().optional(),
  description: z.string().optional(),
});

const adjustSchema = z.object({
  productId: z.string().min(1, "Produto é obrigatório"),
  targetQuantity: z
    .string()
    .min(1, "Quantidade alvo é obrigatória")
    .refine(
      (val) =>
        !isNaN(parseFloat(val.replace(",", "."))) &&
        parseFloat(val.replace(",", ".")) >= 0,
      "Quantidade alvo deve ser um número válido"
    ),
  description: z.string().optional(),
});

type EntryFormData = z.infer<typeof entrySchema>;
type ExitFormData = z.infer<typeof exitSchema>;
type AdjustFormData = z.infer<typeof adjustSchema>;

export function NewMovement() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("entry");

  const entryForm = useForm<EntryFormData>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      productId: "",
      quantity: "",
      unitCost: 0,
      description: "",
    },
  });

  const exitForm = useForm<ExitFormData>({
    resolver: zodResolver(exitSchema),
    defaultValues: {
      productId: "",
      quantity: "",
      unitSalePrice: 0,
      description: "",
    },
  });

  const adjustForm = useForm<AdjustFormData>({
    resolver: zodResolver(adjustSchema),
    defaultValues: {
      productId: "",
      targetQuantity: "",
      description: "",
    },
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await productApi.get({
        page: 1,
        perPage: 100,
        searchTerm: "",
      });
      setProducts(response.data.data);
    } catch (error) {
      toast.error("Erro ao carregar produtos");
    }
  };

  const onSubmitEntry = async (data: EntryFormData) => {
    try {
      setLoading(true);
      await stockMovementApi.createEntry({
        productId: data.productId,
        quantity: parseFloat(data.quantity.replace(",", ".")),
        unitCost: data.unitCost,
        description: data.description,
      });
      toast.success("Entrada registrada com sucesso!");
      navigate("/movements");
    } catch (error) {
      toast.error("Erro ao registrar entrada");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitExit = async (data: ExitFormData) => {
    try {
      setLoading(true);
      await stockMovementApi.createExit({
        productId: data.productId,
        quantity: parseFloat(data.quantity.replace(",", ".")),
        unitSalePrice: data.unitSalePrice,
        description: data.description,
      });
      toast.success("Saída registrada com sucesso!");
      navigate("/movements");
    } catch (error) {
      toast.error("Erro ao registrar saída");
    } finally {
      setLoading(false);
    }
  };

  const onSubmitAdjust = async (data: AdjustFormData) => {
    try {
      setLoading(true);
      await stockMovementApi.createAdjust({
        productId: data.productId,
        targetQuantity: parseFloat(data.targetQuantity.replace(",", ".")),
        description: data.description,
      });
      toast.success("Ajuste registrado com sucesso!");
      navigate("/movements");
    } catch (error) {
      toast.error("Erro ao registrar ajuste");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <StockMovementForm />
    </div>
  );
}
