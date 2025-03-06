import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClientStore } from "@/store/clients/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlus, Mail, Phone, PhoneOff, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface FormContactProps {
  readonly backProgress: () => void;
  readonly nextProgress: () => void;
}

const formSchema = z
  .object({
    type: z.enum(["email", "phone"]),
    contact: z.string(),
  })
  .refine(
    (data) => {
      if (data.type === "email") {
        return z.string().email().safeParse(data.contact).success;
      }
      return data.contact.length >= 11;
    },
    { message: "Contato inválido", path: ["contact"] }
  );

type FormSchemaType = z.infer<typeof formSchema>;

export function FormContactData({
  backProgress,
  nextProgress,
}: FormContactProps) {
  const [addContactShow, setAddContactShow] = useState(false);
  const [contactsList, setContactsList] = useState<FormSchemaType[]>([]);

  const { contacts, addContact, clearContacts } = useClientStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: { type: "email", contact: "" },
  });

  const selectedType = watch("type");

  const addContactToList = (data: FormSchemaType) => {
    setContactsList((prev) => [...prev, data]);
    reset();
  };

  const removeContact = (index: number) => {
    let contactTemp = [...contacts];
    contactTemp.splice(index, 1);
    setContactsList(contactTemp);
  };

  const handleNextProgress = () => {
    contactsList.forEach((contact) => {
      clearContacts();
      addContact(contact);
    });

    nextProgress();
  };

  useEffect(() => {
    if (contacts.length > 0) {
      setContactsList([]);
      setContactsList([...contacts]);
    }
  }, []);

  return (
    <>
      <Card>
        <CardContent className="px-6 py-10">
          <form onSubmit={handleSubmit(addContactToList)}>
            {addContactShow && (
              <div className="flex gap-4">
                {/* Select corretamente registrado */}
                <Select
                  onValueChange={(value) =>
                    setValue("type", value as "email" | "phone")
                  }
                  defaultValue="email"
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Celular</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                {/* Input corretamente registrado */}
                <Input
                  {...register("contact")}
                  className="flex-1"
                  placeholder={
                    selectedType === "phone"
                      ? "00 0 0000-0000"
                      : "email@email.com"
                  }
                  type={selectedType === "phone" ? "text" : "email"}
                />
                <Button type="submit" className="w-[200px]" variant="secondary">
                  Confirmar
                </Button>
              </div>
            )}
            {errors.contact && (
              <p className="text-red-500 text-sm">{errors.contact.message}</p>
            )}
          </form>

          <div className="py-8">
            <Button
              className="w-full h-10"
              onClick={() => setAddContactShow(!addContactShow)}
            >
              <CirclePlus />
              {addContactShow ? "Cancelar" : "Adicionar"}
            </Button>
          </div>

          <div className="pt-8 flex justify-center flex-col gap-2">
            {contactsList.length === 0 ? (
              <div className="flex items-center gap-4 text-zinc-400">
                <PhoneOff />
                Nenhum contato adicionado
              </div>
            ) : (
              contactsList.map((item, index) => (
                <div
                  key={index}
                  className="w-full flex justify-between items-center rounded-md bg-zinc-900 gap-4 text-lg border px-4 py-2"
                >
                  <span className="flex gap-4 items-center">
                    {item.type === "phone" ? <Phone /> : <Mail />}{" "}
                    {item.contact}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => removeContact(index)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      <div className="w-full flex justify-end items-center gap-4 pt-10">
        <Button type="button" onClick={backProgress}>
          Voltar
        </Button>
        <Button type="button" onClick={handleNextProgress}>
          Próximo
        </Button>
      </div>
    </>
  );
}
