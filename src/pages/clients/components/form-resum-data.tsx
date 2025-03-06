import { clientApi } from "@/api";
import LoadingAnimation from "@/components/shared/loading-animation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useClientStore } from "@/store/clients/client";
import { Mail, Phone, PhoneOff } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

interface FormResumProps {
  readonly backProgress: () => void;
}

export function FormResumData({ backProgress }: FormResumProps) {
  const { type, basicData, address, contacts, reset, mode } = useClientStore();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const handleSaveClient = async () => {
    setLoading(true);
    const payload = {
      data: basicData,
      address: address,
      contacts: contacts,
    };

    if (mode === "create") {
      await clientApi
        .save(payload)
        .then((response) => {
          toast.success(
            `Cliente ${response.data.client.fullName} cadastrado com sucesso.`
          );
          reset();
          navigate(`/clients/${response.data.client.id}`);
        })
        .catch((e) => {
          toast.error("Erro ao criar cliente");
        })
        .finally(() => {
          setLoading(false);
        });
    }

    if (mode === "edit") {
      await clientApi
        .update(payload, Number(id))
        .then((response) => {
          toast.success(
            `Cliente ${basicData.fullName} atualizado com sucesso.`
          );
          reset();
          navigate(`/clients/${id}`);
        })
        .catch((e) => {
          toast.error("Erro ao atualizar o cliente");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Dados Básicos</CardTitle>
          <CardDescription>
            {type === "pf" ? "Pessoa Física" : "Pessoa Jurídica"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 px-6 space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">
              {type === "pf" ? "Nome Completo" : "Razão Social"}
            </Label>
            <Input
              type="text"
              id="name"
              placeholder="Nome Completo"
              className="w-full"
              defaultValue={basicData.fullName}
              readOnly
            />
          </div>

          <div className="flex gap-4">
            <div className="grid flex-1 items-center gap-1.5">
              <Label htmlFor="name">{type === "pf" ? "CPF" : "CNPJ"}</Label>
              <Input
                type="text"
                id="name"
                placeholder="Nome Completo"
                className="w-full"
                defaultValue={basicData.document}
                readOnly
              />
            </div>
            <div className="grid flex-1 items-center gap-1.5">
              <Label htmlFor="name">{type === "pf" ? "RG" : "IE"}</Label>
              <Input
                type="text"
                id="name"
                placeholder="Nome Completo"
                className="w-full"
                defaultValue={basicData.rgIe}
                readOnly
              />
            </div>
            {type === "pf" ? (
              <div className="w-[150px] grid items-center gap-1.5">
                <Label>Data de Nascimento</Label>
                <Input type="date" defaultValue={basicData.birthdate} />
              </div>
            ) : (
              ""
            )}
          </div>
        </CardContent>
      </Card>
      {address && (
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
                  defaultValue={address.street}
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
                  defaultValue={address.number}
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
                  defaultValue={address.neighborhood}
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
                  defaultValue={address.zipCode}
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
                  defaultValue={address.city}
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
                  defaultValue={address.state}
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
                  defaultValue={address.country}
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
          <CardDescription>Contatos cadastrados para o cliente</CardDescription>
        </CardHeader>
        <CardContent>
          {contacts.length === 0 ? (
            <div className="flex items-center gap-4 text-zinc-400">
              <PhoneOff />
              Nenhum contato adicionado
            </div>
          ) : (
            contacts.map((item, index) => (
              <div
                key={index}
                className="w-full flex justify-start items-center rounded-md bg-zinc-900 gap-4 text-lg border px-4 py-2"
              >
                <span className="flex gap-4 items-center">
                  {item.type === "phone" ? <Phone /> : <Mail />} {item.contact}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
      <div className="w-full flex justify-end items-center gap-4 pt-10">
        <Button type="button" onClick={backProgress} disabled={loading}>
          Voltar
        </Button>
        <Button
          className="w-[100px]"
          type="button"
          onClick={handleSaveClient}
          disabled={loading}
        >
          {loading ? <LoadingAnimation /> : "Salvar"}
        </Button>
      </div>
    </>
  );
}
