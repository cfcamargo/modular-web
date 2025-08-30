import { useState } from "react";
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
import { Link, useParams } from "react-router-dom";

const supplierSchema = z
  .object({
    documentType: z.enum(["cnpj", "cpf"], {
      required_error: "Selecione o tipo de documento",
    }),
    document: z.string().min(1, "Documento é obrigatório"),
    fantasyName: z
      .string()
      .min(2, "Nome fantasia deve ter pelo menos 2 caracteres"),
    socialName: z
      .string()
      .min(2, "Razão social deve ter pelo menos 2 caracteres"),
  })
  .refine(
    (data) => {
      if (data.documentType === "cnpj") {
        return validateCNPJ(data.document);
      } else {
        return validateCPF(data.document);
      }
    },
    {
      message: "Documento inválido",
      path: ["document"],
    }
  );

type SupplierFormData = z.infer<typeof supplierSchema>;

export function SupplierForm() {
  const { id } = useParams<{ id: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(id);

  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      documentType: "cnpj",
      document: "",
      fantasyName: "",
      socialName: "",
    },
  });

  const documentType = form.watch("documentType");

  const handleDocumentChange = (value: string) => {
    let formatted = value.replace(/\D/g, "");

    if (documentType === "cnpj") {
      formatted = formatCNPJ(formatted);
    } else {
      formatted = formatCPF(formatted);
    }

    form.setValue("document", formatted);
  };

  const onSubmit = async (data: SupplierFormData) => {
    setIsSubmitting(true);

    try {
      // Aqui você faria a chamada para sua API
      console.log("Dados do fornecedor:", data);

      // Simular delay da API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset do formulário após sucesso
      form.reset();

      // Aqui você poderia mostrar uma notificação de sucesso
      alert("Fornecedor cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao cadastrar fornecedor:", error);
      alert("Erro ao cadastrar fornecedor. Tente novamente.");
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
              Informações do Produto
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Tipo de Documento */}
              <FormField
                control={form.control}
                name="documentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Tipo de Documento
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cnpj" id="cnpj" />
                          <Label
                            htmlFor="cnpj"
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Building2 className="h-4 w-4" />
                            CNPJ (Pessoa Jurídica)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cpf" id="cpf" />
                          <Label
                            htmlFor="cpf"
                            className="flex items-center gap-2 cursor-pointer"
                          >
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
                      {documentType === "cnpj" ? "CNPJ" : "CPF"}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Hash className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          placeholder={
                            documentType === "cnpj"
                              ? "00.000.000/0000-00"
                              : "000.000.000-00"
                          }
                          className="pl-10"
                          maxLength={documentType === "cnpj" ? 18 : 14}
                          onChange={(e) => handleDocumentChange(e.target.value)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nome Fantasia */}
              <FormField
                control={form.control}
                name="fantasyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Nome Fantasia
                    </FormLabel>
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

              {/* Razão Social */}
              <FormField
                control={form.control}
                name="socialName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Razão Social
                    </FormLabel>
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
