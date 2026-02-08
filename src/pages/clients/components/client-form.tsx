import { useState } from "react";
import { useForm } from "react-hook-form";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  User,
  MapPin,
  Loader2,
  Save,
  Plus,
  Trash2,
  Pencil,
  ArrowLeft,
  Car,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  AddressPayload,
  ClientRequest,
  SupplierType,
} from "@/models/requests/client-request";

import { toast } from "sonner";
import { AddressModal } from "./adress-modal";

interface ClientFormProps {
  initialData?: ClientRequest; // Opcional: Se vier, é edição. Se não, é criação.
  onSubmit: (data: ClientRequest) => Promise<void>;
  isLoading: boolean;
  pageTitle: string;
  isEditMode?: boolean;
}

export function ClientForm({
  initialData,
  onSubmit,
  isLoading,
  pageTitle,
  isEditMode = true,
}: ClientFormProps) {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ClientRequest>({
    defaultValues: initialData || {
      type: SupplierType.PF,
      name: "",
      document: "",
      email: "",
      phone: "",
      address: undefined,
      ie: "",
    },
  });

  const personType = watch("type");
  const address = watch("address");

  const handleConfirmAddress = (addressData: AddressPayload) => {
    setValue("address", addressData, { shouldDirty: true });
    toast.success("Endereço atualizado!");
  };

  const handleRemoveAddress = () => {
    setValue("address", undefined, { shouldDirty: true });
    toast.info("Endereço removido (Salve para confirmar)");
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/clients">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{pageTitle}</h2>
          <p className="text-muted-foreground">
            {initialData
              ? "Edite os dados do cliente."
              : "Preencha os dados para cadastrar."}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Dados Principais
            </CardTitle>
            <CardDescription>Informações de identificação.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tipo de Pessoa */}
            <div className="space-y-3">
              <Label>Tipo de Cliente</Label>
              <RadioGroup
                defaultValue={initialData?.type || "PF"}
                onValueChange={(value) =>
                  setValue("type", value as SupplierType)
                }
                disabled={!isEditMode}
                className="flex flex-row space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PF" id="pf" />
                  <Label htmlFor="pf">Pessoa Física</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PJ" id="pj" />
                  <Label htmlFor="pj">Pessoa Jurídica</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>
                  {personType === "PF" ? "Nome Completo" : "Razão Social"} *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    disabled={!isEditMode}
                    className="pl-9"
                    {...register("name", { required: "Nome obrigatório" })}
                  />
                </div>
                {errors.name && (
                  <p className="text-destructive text-sm">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>{personType === "PF" ? "CPF" : "CNPJ"} *</Label>
                <Input
                  disabled={!isEditMode}
                  {...register("document", {
                    required: "Documento obrigatório",
                  })}
                />
                {errors.document && (
                  <p className="text-destructive text-sm">
                    {errors.document.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  disabled={!isEditMode}
                  type="email"
                  {...register("email", { required: "Email obrigatório" })}
                />
                {errors.email && (
                  <p className="text-destructive text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Telefone *</Label>
                <Input
                  disabled={!isEditMode}
                  {...register("phone", { required: "Telefone obrigatório" })}
                />
              </div>

              <div className="space-y-2">
                <Label>Inscrição Estadual</Label>
                <Input
                  disabled={!isEditMode}
                  {...register("ie")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            {isEditMode && (
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Endereço
                  </CardTitle>
                  <CardDescription>Localização para entregas.</CardDescription>
                </div>
                {!address && isEditMode && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddressModalOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Adicionar
                  </Button>
                )}
              </div>
            )}
            {!isEditMode && !address && (
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Sem endereço cadastrado
              </CardTitle>
            )}
          </CardHeader>

          {address && (
            <CardContent>
              <div className="rounded-lg border p-4 bg-muted/50 flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    {address.street}, {address.number}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {address.neighborhood} - {address.city}/{address.state}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    CEP: {address.zipCode}
                  </p>
                </div>
                {isEditMode && (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsAddressModalOpen(true)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={handleRemoveAddress}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {isEditMode && (
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/clients")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Salvar Dados
                </>
              )}
            </Button>
          </div>
        )}
      </form>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onConfirm={handleConfirmAddress}
        initialData={address}
      />
    </div>
  );
}
