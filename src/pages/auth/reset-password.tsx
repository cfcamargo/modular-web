import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { toast } from "sonner";
import { Link, useSearchParams } from "react-router-dom";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "@/api/sign-in";
import { Label } from "@/components/ui/label";

const signInForm = z.object({
  email: z.string().email(),
});

type SignInForm = z.infer<typeof signInForm>;

export function ResetPassword() {
  const [searchParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInForm>({
    defaultValues: {
      email: searchParams.get("email") ?? "",
    },
  });

  useMutation({
    mutationFn: signIn,
  });

  const handleSignin = async (data: SignInForm) => {
    try {
      // await authenticate(data);

      toast.success("Enviamos um link de autenticação para o seu email", {
        action: {
          label: "Reenviar",
          onClick: () => handleSignin(data),
        },
      });
    } catch {}
  };

  return (
    <>
      <Helmet title="Login" />
      <div className="p-8">
        <div className="flex w-[350px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Recuperar Senha
            </h1>
            <p className="text-sm text-muted-foreground">
              Entre com seu email, e enviaremos um link para redefinição
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit(handleSignin)}>
            <div className="space-y-2">
              <Label htmlFor="email">Seu e-mail</Label>
              <Input type="email" id="email" {...register("email")} />
            </div>

            <Button disabled={isSubmitting} className="w-full" type="submit">
              Enviar
            </Button>
            <Button asChild variant={"link"} className="w-full">
              <Link to="/sign-in">Voltar para o login</Link>
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
