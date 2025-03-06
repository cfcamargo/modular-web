import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useClientStore } from "@/store/clients/client";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { BasicDataProps } from "@/models/data/client-basic-data";

interface FormBasicDataPJProps {
  readonly nextProgress: () => void;
  readonly backProgress: () => void;
}

const formSchema = z.object({
  fullName: z.string().min(4, { message: "Digite seu nome completo" }),
  cpnj: z.string().min(11, { message: "O CPF precisa conter 11 dígitos" }),
  ieIm: z.string().min(6, { message: "O RG contém pelo menos 6 digitos" }),
});

export default function FormBasicDataPJ({
  nextProgress,
  backProgress,
}: FormBasicDataPJProps) {
  const { type, basicData, setBasicData } = useClientStore();

  type BasicDataForm = z.infer<typeof formSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BasicDataForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: basicData?.fullName ?? "",
      cpnj: basicData?.document ?? "",
      ieIm: basicData?.rgIe ?? "",
    },
  });

  const handleNextProgress = (data: BasicDataForm) => {
    let transformedData: BasicDataProps = {
      document: data.cpnj,
      fullName: data.fullName,
      rgIe: data.ieIm,
      type,
    };

    setBasicData(transformedData);
    nextProgress();
  };

  return (
    <form onSubmit={handleSubmit(handleNextProgress)}>
      <Card>
        <CardContent className="py-10 px-6 space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Nome Fantasia</Label>
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
              <Label htmlFor="name">CNPJ</Label>
              <Input
                type="text"
                id="name"
                placeholder="Nome Completo"
                className="w-full"
                {...register("cpnj")}
              />
              {errors.cpnj && (
                <span className="text-red-500 text-sm">
                  {errors.cpnj.message}
                </span>
              )}
            </div>
            <div className="grid flex-1 items-center gap-1.5">
              <Label htmlFor="name">IE | IM</Label>
              <Input
                type="text"
                id="name"
                placeholder="Nome Completo"
                className="w-full"
                {...register("ieIm")}
              />
              {errors.ieIm && (
                <span className="text-red-500 text-sm">
                  {errors.ieIm.message}
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
