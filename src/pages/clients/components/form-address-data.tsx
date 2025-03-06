import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddressProps } from "@/models/data/address";
import { useClientStore } from "@/store/clients/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface FormAddressData {
  readonly backProgress: () => void;
  readonly nextProgress: () => void;
}

import { toast } from "sonner"; // Ou outra biblioteca de toast

const formSchema = z
  .object({
    street: z.string().nullable(),
    number: z.string().nullable(),
    neighborhood: z.string().nullable(),
    zipCode: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    country: z.string().nullable(),
  })
  .refine((data) => {
    const isAnyFieldFilled = Object.values(data).some(
      (value) => value && value.trim() !== ""
    );
    const areAllFieldsFilled = Object.values(data).every(
      (value) => value && value.trim() !== ""
    );

    if (isAnyFieldFilled && !areAllFieldsFilled) {
      toast.error(
        "Se começar a preencher o endereço, todos os campos são obrigatórios!"
      );
      return false;
    }

    return true;
  });

export function FormAddressData({
  backProgress,
  nextProgress,
}: FormAddressData) {
  const { setAddress, address } = useClientStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressProps>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      street: address?.street ?? "",
      state: address?.state ?? "",
      city: address?.city ?? "",
      country: address?.country ?? "",
      neighborhood: address?.neighborhood ?? "",
      number: address?.number ?? "",
      zipCode: address?.zipCode ?? "",
    },
  });

  const handleNextProgress = (data: AddressProps) => {
    const isAddressEmpty = Object.values(data).every(
      (value) => !value || value.trim() === ""
    );

    if (isAddressEmpty) {
      setAddress(null);
    } else {
      setAddress(data);
    }

    nextProgress();
  };

  return (
    <form onSubmit={handleSubmit(handleNextProgress)}>
      <Card>
        <CardContent className="py-10 px-6 space-y-4">
          <div className="flex gap-4">
            <div className="grid flex-1 items-center gap-1.5">
              <Label htmlFor="name">Rua</Label>
              <Input
                type="text"
                id="name"
                placeholder="Nome da rua"
                className="w-full"
                {...register("street")}
              />
              {errors.street && (
                <span className="text-red-500 text-sm">
                  {errors.street.message}
                </span>
              )}
            </div>
            <div className="w-[250px] grid items-center gap-1.5">
              <Label htmlFor="name">Número</Label>
              <Input
                type="text"
                id="name"
                placeholder="000"
                className="w-full"
                {...register("number")}
              />
              {errors.number && (
                <span className="text-red-500 text-sm">
                  {errors.number.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="grid flex-1 items-center gap-1.5">
              <Label htmlFor="name">Bairro</Label>
              <Input
                type="text"
                id="name"
                placeholder="Nome do bairro"
                className="w-full"
                {...register("neighborhood")}
              />
              {errors.neighborhood && (
                <span className="text-red-500 text-sm">
                  {errors.neighborhood.message}
                </span>
              )}
            </div>
            <div className="w-[400px] grid items-center gap-1.5">
              <Label htmlFor="name">CEP</Label>
              <Input
                type="text"
                id="name"
                placeholder="000.000.000-00"
                className="w-full"
                {...register("zipCode")}
              />
              {errors.zipCode && (
                <span className="text-red-500 text-sm">
                  {errors.zipCode.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="grid flex-1 items-center gap-1.5">
              <Label htmlFor="name">Cidade</Label>
              <Input
                type="text"
                id="name"
                placeholder="Nome da cidade"
                className="w-full"
                {...register("city")}
              />
              {errors.city && (
                <span className="text-red-500 text-sm">
                  {errors.city.message}
                </span>
              )}
            </div>
            <div className="flex-1 grid items-center gap-1.5">
              <Label htmlFor="name">Estado</Label>
              <Input
                type="text"
                id="name"
                placeholder="Nome do estado"
                className="w-full"
                {...register("state")}
              />
              {errors.state && (
                <span className="text-red-500 text-sm">
                  {errors.state.message}
                </span>
              )}
            </div>
            <div className="flex-1 grid items-center gap-1.5">
              <Label htmlFor="name">País</Label>
              <Input
                type="text"
                id="name"
                placeholder="Nome do país"
                className="w-full"
                {...register("country")}
              />
              {errors.country && (
                <span className="text-red-500 text-sm">
                  {errors.country.message}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="w-full flex justify-end items-center gap-4 pt-10">
        <Button type="button" onClick={backProgress}>
          Voltar
        </Button>
        <Button type="submit">Próximo</Button>
      </div>
    </form>
  );
}
