import { zodResolver } from "@hookform/resolvers/zod";
import { ca } from "date-fns/locale";
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { userApi } from "@/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const signInForm = z
  .object({
    email: z.string().email(),
    fullName: z.string(),
    document: z.string().min(11, { message: "Digite um CPF válido" }),
    password: z
      .string()
      .min(6, { message: "Precisa de pelo menos 6 caracteres" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Precisa de pelo menos 6 caracteres" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type SignInForm = z.infer<typeof signInForm>;

export function Register() {
  const { code } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const form = useForm<SignInForm>({
    resolver: zodResolver(signInForm),
    defaultValues: {
      email: "",
      fullName: "",
      document: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
  } = form;

  const handleSignin = async (data: SignInForm) => {
    const request = {
      fullName: data.fullName,
      email: data.email,
      document: data.document,
      password: data.password,
      resetCode: code!,
    };

    await userApi
      .updateUserByCode(request)
      .then((resp) => {
        console.log(resp);
        toast.success("Dados salvos com sucesso, você ja pode fazer login");
        navigate("/sign-in");
      })
      .catch(() => {
        toast.error("Erro ao salvar os dados, tente novamente");
      });
  };

  const onInvalid = (errors: any) => {
    console.log("Formulário inválido:", errors);
  };

  const handleGetUserByCode = useCallback(async () => {
    setLoading(true);
    await userApi
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
  }, [code, navigate, setValue]);

  useEffect(() => {
    handleGetUserByCode();
  }, [handleGetUserByCode]);

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
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={handleSubmit(handleSignin, onInvalid)}
            >
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="document"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirme a senha</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={isSubmitting} className="w-full" type="submit">
                Salvar
              </Button>
              <Button asChild variant={"link"} className="w-full">
                <Link to="/sign-in">Cancelar</Link>
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
