import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { BasicDataProps } from "@/models/data/client-basic-data";
import { useClientStore } from "@/store/clients/client";
import { useNavigate } from "react-router-dom";

interface FormBasicDataPfProps {
  readonly backProgress: () => void;
  readonly nextProgress: () => void;
}

const formSchema = z.object({
  fullName: z.string().min(4, { message: "Digite seu nome completo" }),
  cpf: z.string().min(11, { message: "O CPF precisa conter 11 dígitos" }),
  rg: z.string().min(6, { message: "O RG contém pelo menos 6 digitos" }),
  birthdate: z.string().min(8, { message: "Campo Obrigatório" }),
});

export default function FormBasicDataPf({
  backProgress,
  nextProgress,
}: FormBasicDataPfProps) {
  const { type, basicData, setBasicData, mode } = useClientStore();

  type BasicDataForm = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BasicDataForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: basicData.fullName ?? "",
      cpf: basicData.document ?? "",
      rg: basicData.rgIe ?? "",
      birthdate: basicData?.birthdate ?? "",
    },
  });

  const navigate = useNavigate();

  const handleNextProgress = (data: BasicDataForm) => {
    let transformedData: BasicDataProps = {
      document: data.cpf,
      fullName: data.fullName,
      rgIe: data.rg,
      type,
      birthdate: data.birthdate,
    };

    setBasicData(transformedData);
    nextProgress();
  };

  return (
    <form onSubmit={handleSubmit(handleNextProgress)}>
      <Card>
        <CardContent className="py-10 px-6 space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              type="text"
              id="name"
              placeholder="Nome Completo"
              className="w-full"
              {...register("fullName")}
            />
            {errors.fullName && (
              <span className="text-red-500 text-sm">
                {errors.fullName.message}
              </span>
            )}
          </div>

          <div className="flex gap-4">
            <div className="grid flex-1 items-center gap-1.5">
              <Label htmlFor="name">CPF</Label>
              <Input
                type="text"
                id="name"
                placeholder="Nome Completo"
                className="w-full"
                {...register("cpf")}
              />
              {errors.cpf && (
                <span className="text-red-500 text-sm">
                  {errors.cpf.message}
                </span>
              )}
            </div>
            <div className="grid flex-1 items-center gap-1.5">
              <Label htmlFor="name">RG</Label>
              <Input
                type="text"
                id="name"
                placeholder="Nome Completo"
                className="w-full"
                {...register("rg")}
              />
              {errors.rg && (
                <span className="text-red-500 text-sm">
                  {errors.rg.message}
                </span>
              )}
            </div>
            <div className="w-[150px] grid items-center gap-1.5">
              <Label>Data de Nascimento</Label>
              <Input type="date" {...register("birthdate")} />
              {errors.birthdate && (
                <span className="text-red-500 text-sm">
                  {errors.birthdate.message}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="w-full flex justify-end items-center gap-4 pt-10">
        <Button
          type="button"
          onClick={() =>
            mode === "create" ? backProgress() : navigate("/clients")
          }
        >
          Voltar
        </Button>
        <Button type="submit">Próximo</Button>
      </div>
    </form>
  );
}
