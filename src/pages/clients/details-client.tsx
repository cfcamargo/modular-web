import { clientApi } from "@/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ClientDetailsResponse } from "@/models/responses/client-response";
import { Mail, Phone, PhoneOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function DetailsClient() {
  const { id } = useParams();
  const [client, setClient] = useState<ClientDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getClientData = async () => {
    setLoading(true);
    clientApi
      .getDetails(Number(id))
      .then((response) => {
        setClient(response.data.client);
      })
      .catch((e) => {
        if (e.status === 404) {
          toast.error("Cliente não encontrado na base de dados");
          navigate("/404");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getClientData();
  }, []);

  return (
    <>
      {loading ? (
        <span>...Loading</span>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Dados Básicos</CardTitle>
              <CardDescription>
                {client!.type === "pf" ? "Pessoa Física" : "Pessoa Jurídica"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 px-6 space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="name">
                  {client?.type === "pf" ? "Nome Completo" : "Razão Social"}
                </Label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Nome Completo"
                  className="w-full"
                  defaultValue={client?.fullName}
                  readOnly
                />
              </div>

              <div className="flex gap-4">
                <div className="grid flex-1 items-center gap-1.5">
                  <Label htmlFor="name">
                    {client?.type === "pf" ? "CPF" : "CNPJ"}
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    placeholder="Nome Completo"
                    className="w-full"
                    defaultValue={client?.document}
                    readOnly
                  />
                </div>
                <div className="grid flex-1 items-center gap-1.5">
                  <Label htmlFor="name">
                    {client?.type === "pf" ? "RG" : "IE"}
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    placeholder="Nome Completo"
                    className="w-full"
                    defaultValue={client?.rgIe}
                    readOnly
                  />
                </div>
                {client?.type === "pf" ? (
                  <div className="w-[150px] grid items-center gap-1.5">
                    <Label>Data de Nascimento</Label>
                    <Input type="date" defaultValue={client.birthdate} />
                  </div>
                ) : (
                  ""
                )}
              </div>
            </CardContent>
          </Card>
          {client?.address && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Endereço</CardTitle>
                <CardDescription>Endereço do cliente</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 px-6 space-y-4">
                <div className="flex gap-4">
                  <div className="grid flex-1 items-center gap-1.5">
                    <Label htmlFor="name">Rua</Label>
                    <Input
                      type="text"
                      id="name"
                      placeholder="Nome da rua"
                      className="w-full"
                      defaultValue={client.address.street}
                      readOnly
                    />
                  </div>
                  <div className="w-[250px] grid items-center gap-1.5">
                    <Label htmlFor="name">Número</Label>
                    <Input
                      type="text"
                      id="name"
                      placeholder="000"
                      className="w-full"
                      defaultValue={client.address.number}
                      readOnly
                    />
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
                      defaultValue={client.address.neighborhood}
                      readOnly
                    />
                  </div>
                  <div className="w-[400px] grid items-center gap-1.5">
                    <Label htmlFor="name">CEP</Label>
                    <Input
                      type="text"
                      id="name"
                      placeholder="000.000.000-00"
                      className="w-full"
                      defaultValue={client.address.zipCode}
                      readOnly
                    />
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
                      defaultValue={client.address.city}
                      readOnly
                    />
                  </div>
                  <div className="flex-1 grid items-center gap-1.5">
                    <Label htmlFor="name">Estado</Label>
                    <Input
                      type="text"
                      id="name"
                      placeholder="Nome do estado"
                      className="w-full"
                      defaultValue={client.address.state}
                      readOnly
                    />
                  </div>
                  <div className="flex-1 grid items-center gap-1.5">
                    <Label htmlFor="name">País</Label>
                    <Input
                      type="text"
                      id="name"
                      placeholder="Nome do país"
                      className="w-full"
                      defaultValue={client.address.country}
                      readOnly
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Contatos</CardTitle>
              <CardDescription>
                Contatos cadastrados para o cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              {client!.contacts.length === 0 ? (
                <div className="flex items-center gap-4 text-zinc-400">
                  <PhoneOff />
                  Nenhum contato adicionado
                </div>
              ) : (
                client!.contacts.map((item, index) => (
                  <div
                    key={index}
                    className="w-full flex justify-start items-center rounded-md bg-zinc-900 gap-4 text-lg border px-4 py-2"
                  >
                    <span className="flex gap-4 items-center">
                      {item.type === "phone" ? <Phone /> : <Mail />}{" "}
                      {item.contact}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
}
