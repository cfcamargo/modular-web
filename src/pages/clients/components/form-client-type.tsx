import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useClientStore } from "@/store/clients/client";
import { Building2, User } from "lucide-react";
import { useEffect, useState } from "react";

interface FormClienteTypeProps {
  readonly setClientType: (clientType: "pj" | "pf") => void;
  readonly nextProgress: () => void;
}

export default function FormClientType({
  setClientType,
  nextProgress,
}: FormClienteTypeProps) {
  const [typeSelected, setTypeSelected] = useState<"pj" | "pf">("pf");

  const { type, setType } = useClientStore();

  const getStyles = (type: "pj" | "pf") => {
    if (type === typeSelected) {
      return "w-full cursor-pointer flex justify-center px-20 py-12 rounded-lg border border-primary items-center";
    }
    return "w-full cursor-pointer flex justify-center px-20 py-12 rounded-lg border border-muted-foreground items-center hover:border-primary";
  };

  const changeClientType = (type: "pj" | "pf") => {
    setTypeSelected(type);
    setClientType(type);
    setType(type);
    nextProgress();
  };

  useEffect(() => {
    setTypeSelected(type);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tipo de Cliente</CardTitle>
        <CardDescription>Selecione o tipo de cliente</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full flex justify-center items-center gap-8">
          <button
            className={getStyles("pf")}
            onClick={() => changeClientType("pf")}
          >
            <User />
            <span>PF</span>
          </button>
          <button
            className={getStyles("pj")}
            onClick={() => changeClientType("pj")}
          >
            <Building2 />
            <span>PJ</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
