import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { toast } from "sonner";
import { Link, useNavigate, useParams } from "react-router-dom";

import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { resetPasswordApi } from "@/api";

const signInForm = z.object({
  email: z.string().email(),
  fullName: z.string(),
  document: z.string(),
  password: z
    .string()
    .min(6, { message: "Precisa de pelo menos 6 caracteres" }),
  confirmPassword: z
    .string()
    .min(6, { message: "Precisa de pelo menos 6 caracteres" }),
});

type SignInForm = z.infer<typeof signInForm>;

export function Register() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [, setLoading] = useState(false);


  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<SignInForm>();

  const handleSignin = async (data: SignInForm) => {
    setLoading(true);
    resetPasswordApi
      .updateUserByCode(data, String(code))
      .then(() => {
        toast.success("Dados salvos com sucesso, você ja pode fazer login");
        navigate("/sign-in");
      })
      .catch(() => {
        toast.error("Erro ao salvar os dados, tente novamente");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGetUserByCode = () => {
    setLoading(true);
    resetPasswordApi
      .getUserDetailByCode(String(code))
      .then((response) => {
        response.data.user.email
          ? setValue("email", response.data.user.email)
          : setValue("email", "");

        response.data.user.fullName
          ? setValue("fullName", response.data.user.fullName)
          : setValue("fullName", "");

        response.data.user.document
          ? setValue("document", response.data.user.document)
          : setValue("document", "");
      })
      .catch((e) => {
        navigate("/sign-in");
        toast.error(e.response?.data.error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    handleGetUserByCode();
  }, []);

  return (
    <>
      <Helmet title="Login" />
      <div className="p-8">
        <div className="flex w-[350px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Finalizar Cadastro
            </h1>
            <p className="text-sm text-muted-foreground">
              Preencha os dados faltantes para finalizar o seu cadastro
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit(handleSignin)}>
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                autoComplete="off"
                type="text"
                id="name"
                {...register("fullName")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Seu e-mail</Label>
              <Input disabled type="email" id="email" {...register("email")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-document">CPF</Label>
              <Input
                autoComplete="off"
                type="text"
                id="document"
                {...register("document")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                autoComplete="new-password"
                type="password"
                id="password"
                {...register("password")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirme a senha</Label>
              <Input
                type="password"
                id="confirmPassword"
                {...register("confirmPassword")}
              />
            </div>

            <Button disabled={isSubmitting} className="w-full" type="submit">
              Salvar
            </Button>
            <Button asChild variant={"link"} className="w-full">
              <Link to="/sign-in">Cancelar</Link>
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
