import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserResponse } from "@/models/responses/user-response";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export function DetailsUser() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserResponse | null>();

  const destroyProduct = () => {};

  return (
    <>
      {loading ? (
        <span>...Carregando</span>
      ) : (
        <>
          <Helmet title="Usuários|Detalhe Do Usuário" />
          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Usuário</CardTitle>
              <CardDescription>Detalhes completos do usuário</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="grid flex-1 items-center gap-1.5">
                    <Label htmlFor="name">Nome do usuário</Label>
                    <Input
                      type="text"
                      id="name"
                      className="w-full"
                      disabled
                      value={user?.fullName}
                    />
                  </div>
                  <div className="grid flex-1 items-center gap-1.5">
                    <Label htmlFor="name">CPF</Label>
                    <Input
                      type="text"
                      id="name"
                      placeholder="Nome Completo"
                      className="w-full"
                      defaultValue={user?.document}
                      disabled
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="grid flex-1 items-center gap-1.5">
                    <Label htmlFor="name">Cargo</Label>
                    <Input
                      type="text"
                      id="name"
                      disabled
                      className="w-full"
                      defaultValue={
                        user?.role === "ADMIN" ? "Administrador" : "Default"
                      }
                    />
                  </div>
                  <div className="grid flex-1 items-center gap-1.5">
                    <Label htmlFor="name">Data do registro</Label>
                    <Input
                      type="text"
                      min={0}
                      id="name"
                      className="w-full"
                      disabled
                      defaultValue={new Date(
                        user?.createdAt!
                      ).toLocaleDateString()}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full flex justify-end gap-2">
                <AlertDialog>
                  <Button asChild variant="destructive">
                    <AlertDialogTrigger>Deletar</AlertDialogTrigger>
                  </Button>
                  <AlertDialogContent>
                    <AlertDialogTitle>
                      Tem certeza que deseja deletar o produto?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Ao confirmar essa ação, o usuário{" "}
                      <span className="text-rose-600">{user?.fullName}</span>{" "}
                      sera excluido permanentemente. Esta acão não pode ser
                      desfeita !
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={destroyProduct}>
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button variant={"secondary"} asChild>
                  <Link to={`/users/${user?.id!}/edit`}>Editar</Link>
                </Button>
              </div>
            </CardFooter>
          </Card>
        </>
      )}
    </>
  );
}
