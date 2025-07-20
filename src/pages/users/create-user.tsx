import LoadingAnimation from "@/components/shared/loading-animation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { userApi } from "@/api";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(4, { message: "Digite o nome do usuário" }).optional(),
  email: z.string().email(),
  role: z.number().default(2),
});

export default function CreateUser() {
  const [loading, setLoading] = useState(false);

  type BasicDataForm = z.infer<typeof formSchema>;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<BasicDataForm>({
    resolver: zodResolver(formSchema),
  });

  const onSubmitForm = (data: BasicDataForm) => {
    setLoading(true);
    userApi.save(data).then((response) => {
      toast.success(
        "Email enviado, o usuário pode completar seu registo através do link"
      );
      navigate("/users");
    });
    console.log(data);
  };

  const handleSelectChange = (value: "ADMIN" | "DEFAULT") => {
    setValue("role", value);
  };

  return (
    <>
      <Helmet title="Usuários|Cadastro De Usuário" />
      <Card>
        <CardHeader>
          <CardTitle>Cadastro de usuário</CardTitle>
          <CardDescription>Cadastrar novo usuário</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmitForm)}
            className="flex flex-col gap-4"
          >
            <div className="grid flex-1 items-center gap-1.5">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                type="text"
                id="name"
                placeholder="Nome Completo"
                className="w-full"
                {...register("name")}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid flex-1 items-center gap-1.5">
                <Label htmlFor="name">Email</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Email"
                  className="w-full"
                  {...register("email")}
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="grid flex-1 items-center gap-1.5">
                <Label htmlFor="name">Cargo</Label>
                <Select onValueChange={handleSelectChange} defaultValue="2">
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Selecione o cargo</SelectLabel>
                      <SelectItem value="1">Administrador</SelectItem>
                      <SelectItem value="2">Usuário</SelectItem>
                      <SelectItem value="3">Motorista</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="w-full flex gap-2 justify-end py-8">
              <Button
                type="button"
                variant={"outline"}
                disabled={loading}
                asChild
              >
                <Link to="/users">Voltar</Link>
              </Button>
              <Button type="submit" className="w-[100px]" disabled={loading}>
                {loading ? <LoadingAnimation /> : "Salvar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
