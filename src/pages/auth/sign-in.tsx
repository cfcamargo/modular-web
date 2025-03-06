import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { toast } from "sonner";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "@/api/sign-in";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const signInForm = z.object({
  email: z.string().email(),
  password: z.string(),
});

type SignInForm = z.infer<typeof signInForm>;

export function SignIn() {
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

  const navigate = useNavigate();

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
  });

  const handleSignin = async (userData: SignInForm) => {
    try {
      const { data } = await authenticate(userData);
      localStorage.setItem("modular-token", data.token.token);
      toast.success(
        `Login Bem sucessido, Bem vindo ${data.user.fullName.split(" ")[0]}`
      );

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch {}
  };

  return (
    <>
      <Helmet title="Login" />
      <div className="p-8">
        <div className="flex w-[350px] flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Painel Administrativo
            </h1>
            <p className="text-sm text-muted-foreground">
              Entre com seu usuário e senha
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit(handleSignin)}>
            <div className="space-y-2">
              <Label htmlFor="email">Seu e-mail</Label>
              <Input type="email" id="email" {...register("email")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input type="password" id="password" {...register("password")} />
            </div>

            <Button disabled={isSubmitting} className="w-full" type="submit">
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Login"
              )}
            </Button>

            <Button asChild variant={"link"} className="w-full">
              <Link to="/reset-password">Esqueci minha senha</Link>
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
