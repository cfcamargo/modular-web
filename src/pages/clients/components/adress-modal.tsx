import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; // Ajuste o import para sua tipagem
import { AddressPayload } from "@/models/requests/client-request";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (address: AddressPayload) => void;
  initialData?: AddressPayload | null;
}

export function AddressModal({
  isOpen,
  onClose,
  onConfirm,
  initialData,
}: AddressModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressPayload>();

  // Reseta/Preenche o formulário toda vez que o modal abre
  useEffect(() => {
    if (isOpen) {
      reset(
        initialData || {
          zipCode: "",
          street: "",
          number: "",
          complement: "",
          neighborhood: "",
          city: "",
          state: "",
        }
      );
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = (data: AddressPayload) => {
    onConfirm(data); // Passa o dado validado para o pai
    onClose(); // Fecha o modal
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Editar Endereço" : "Adicionar Endereço"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo. Todos os campos marcados com * são
            obrigatórios.
          </DialogDescription>
        </DialogHeader>

        {/* Formulário Isolado: O submit daqui não interfere no Pai */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CEP */}
            <div className="space-y-2">
              <Label htmlFor="zipCode">CEP *</Label>
              <Input
                id="zipCode"
                placeholder="00000-000"
                {...register("zipCode", { required: "CEP é obrigatório" })}
              />
              {errors.zipCode && (
                <p className="text-sm text-destructive">
                  {errors.zipCode.message}
                </p>
              )}
            </div>

            {/* Logradouro */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="street">Logradouro *</Label>
              <Input
                id="street"
                placeholder="Rua, Av..."
                {...register("street", {
                  required: "Logradouro é obrigatório",
                })}
              />
              {errors.street && (
                <p className="text-sm text-destructive">
                  {errors.street.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Número */}
            <div className="space-y-2">
              <Label htmlFor="number">Número *</Label>
              <Input
                id="number"
                {...register("number", { required: "Número é obrigatório" })}
              />
              {errors.number && (
                <p className="text-sm text-destructive">
                  {errors.number.message}
                </p>
              )}
            </div>

            {/* Complemento */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                placeholder="Apto, Bloco (Opcional)"
                {...register("complement")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Bairro */}
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro *</Label>
              <Input
                id="neighborhood"
                {...register("neighborhood", {
                  required: "Bairro é obrigatório",
                })}
              />
              {errors.neighborhood && (
                <p className="text-sm text-destructive">
                  {errors.neighborhood.message}
                </p>
              )}
            </div>

            {/* Cidade */}
            <div className="space-y-2">
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                {...register("city", { required: "Cidade é obrigatória" })}
              />
              {errors.city && (
                <p className="text-sm text-destructive">
                  {errors.city.message}
                </p>
              )}
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Label htmlFor="state">Estado *</Label>
              <Input
                id="state"
                maxLength={2}
                placeholder="UF"
                {...register("state", { required: "UF obrigatória" })}
              />
              {errors.state && (
                <p className="text-sm text-destructive">
                  {errors.state.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">Confirmar Endereço</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
