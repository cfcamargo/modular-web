import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Building2,
  User,
  FileText,
  Hash,
  Package,
  ArrowLeft,
} from "lucide-react";
import {
  validateCNPJ,
  validateCPF,
  formatCNPJ,
  formatCPF,
} from "@/lib/documentUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supplierApi } from "@/api";
import { toast } from "sonner";

// ------- Zod Schema (condicional) -------
const baseSchema = z.object({
  type: z.enum(["cnpj", "cpf"], {
    required_error: "Selecione o tipo de documento",
  }),
  document: z.string().min(1, "Documento é obrigatório"),
  fantasyName: z.string().optional(),
  name: z.string(),
});

const supplierSchema = baseSchema.superRefine((data, ctx) => {
  // valida documento conforme tipo
  if (data.type === "cnpj") {
    if (!validateCNPJ(data.document)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["document"],
        message: "CNPJ inválido",
      });
    }
    // PJ: razão social obrigatória
    if (!data.name || data.name.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["socialName"],
        message: "Razão social deve ter pelo menos 2 caracteres",
      });
    }
    // PJ: nome fantasia obrigatório
    if (!data.fantasyName || data.fantasyName.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["fantasyName"],
        message: "Nome fantasia deve ter pelo menos 2 caracteres",
      });
    }
  } else {
    // CPF
    if (!validateCPF(data.document)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["document"],
        message: "CPF inválido",
      });
    }
    // PF: apenas socialName (Nome completo) obrigatório
    if (!data.name || data.name.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["socialName"],
        message: "Nome completo deve ter pelo menos 2 caracteres",
      });
    }
    // PF: se enviar fantasia, ignoramos a obrigatoriedade (fica opcional)
  }
});

type SupplierFormData = z.infer<typeof supplierSchema>;

export function SupplierForm() {
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = Boolean(id);

  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      type: "cnpj",
      document: "",
      fantasyName: "",
      name: "",
    },
  });

  const type = form.watch("type");

  // Formata documento ao digitar
  const handleDocumentChange = (value: string) => {
    let digits = value.replace(/\D/g, "");
    const formatted = type === "cnpj" ? formatCNPJ(digits) : formatCPF(digits);
    form.setValue("document", formatted, { shouldValidate: true });
  };

  useEffect(() => {
    form.clearErrors();
    if (type === "cpf") {
      form.setValue("fantasyName", "", { shouldValidate: false });
    }
  }, [type]); // eslint-disable-line react-hooks/exhaustive-deps

  const navigate = useNavigate()

  const onSubmit = async (data: SupplierFormData) => {
    setIsSubmitting(true);
    try {
      supplierApi.save(data)
      .then(() => {
        toast.success("Fornecedor cadastrado com sucesso")
        navigate("/supplier")
      })
      
    } catch (error) {
      console.error("Erro ao cadastrar fornecedor:", error);
      toast.error("Erro ao cadastrar fornecedor. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/supplier">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? "Editar Fornecedor" : "Novo Fornecedor"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? "Atualize as informações do fornecedor"
              : "Preencha as informações para criar um novo fornecedor"}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Informações do Fornecedor
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Tipo de Documento */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Tipo de Documento
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(v) => field.onChange(v)}
                        value={field.value}
                        className="flex space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cnpj" id="cnpj" />
                          <Label htmlFor="cnpj" className="flex items-center gap-2 cursor-pointer">
                            <Building2 className="h-4 w-4" />
                            CNPJ (Pessoa Jurídica)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cpf" id="cpf" />
                          <Label htmlFor="cpf" className="flex items-center gap-2 cursor-pointer">
                            <User className="h-4 w-4" />
                            CPF (Pessoa Física)
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Documento */}
              <FormField
                control={form.control}
                name="document"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      {type === "cnpj" ? "CNPJ" : "CPF"}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          placeholder={
                            type === "cnpj"
                              ? "00.000.000/0000-00"
                              : "000.000.000-00"
                          }
                          className="pl-10"
                          maxLength={type === "cnpj" ? 18 : 14}
                          onChange={(e) => handleDocumentChange(e.target.value)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campos variáveis conforme o tipo */}
              {type === "cnpj" ? (
                // PESSOA JURÍDICA
                <>
                  {/* Razão Social (obrigatório em PJ) */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Razão Social *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              {...field}
                              placeholder="Razão social oficial do fornecedor"
                              className="pl-10"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Nome Fantasia (obrigatório em PJ) */}
                  <FormField
                    control={form.control}
                    name="fantasyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Nome Fantasia *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              {...field}
                              placeholder="Nome comercial do fornecedor"
                              className="pl-10"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                // PESSOA FÍSICA
                <>
                  {/* Nome completo (obrigatório em PF) */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Nome completo *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              {...field}
                              placeholder="Nome completo do fornecedor"
                              className="pl-10"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Nome fantasia oculto/ocional em PF (mantemos no form state, mas não exibimos) */}
                </>
              )}

              {/* Botões */}
              <div className="flex gap-4 pt-4 justify-end">
                <Button type="button" variant="outline" disabled={isSubmitting}>
                  <Link to="/supplier">Cancelar</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Cadastrando..." : "Cadastrar Fornecedor"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
