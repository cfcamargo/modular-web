import { FormProgress } from "@/components/shared/form-progress";
import { useEffect, useState } from "react";
import FormBasicDataPf from "./components/form-basic-data-pf";
import FormBasicDataPJ from "./components/form-basic-data-pj";
import { FormAddressData } from "./components/form-address-data";
import { FormContactData } from "./components/form-contact-data";
import { FormResumData } from "./components/form-resum-data";
import { clientApi } from "@/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useClientStore } from "@/store/clients/client";
import { BasicDataProps } from "@/models/data/client-basic-data";

export default function EditClient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setType, setBasicData, setAddress, addContact, setMode } =
    useClientStore();

  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    { label: "Dados Basicos", description: "Cadastre as informações básicas" },
    { label: "Endereço", description: "Cadastre o Endereço" },
    { label: "Contato", description: "Adiciona Contatos" },
    { label: "Resumo", description: "Confirme as informações" },
  ];
  const [clientType, setClientType] = useState<"pj" | "pf">("pf");
  const [loading, setLoading] = useState(true);

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const getComponent = () => {
    if (currentStep === 1) {
      if (clientType === "pf") {
        return (
          <FormBasicDataPf
            backProgress={() => prevStep()}
            nextProgress={() => nextStep()}
          />
        );
      }

      return (
        <FormBasicDataPJ
          backProgress={() => prevStep()}
          nextProgress={() => nextStep()}
        />
      );
    }

    if (currentStep === 2) {
      return (
        <FormAddressData
          backProgress={() => prevStep()}
          nextProgress={() => nextStep()}
        />
      );
    }

    if (currentStep === 3) {
      return (
        <FormContactData
          backProgress={() => prevStep()}
          nextProgress={() => nextStep()}
        />
      );
    }

    if (currentStep === 4) {
      return <FormResumData backProgress={() => prevStep()} />;
    }
  };

  const getClientData = async () => {
    setLoading(true);
    clientApi
      .getDetails(Number(id))
      .then((response) => {
        setType(response.data.client.type);
        setClientType(response.data.client.type);

        const data: BasicDataProps = {
          document: response.data.client.document,
          fullName: response.data.client.fullName,
          rgIe: response.data.client.rgIe,
          type: response.data.client.type,
          birthdate: response.data.client.birthdate ?? "",
          fantasyName: response.data.client.fantasyName ?? "",
          im: response.data.client.im ?? "",
        };

        setBasicData(data);
        setAddress(response.data.client.address);
        if (response.data.client.contacts.length > 0) {
          response.data.client.contacts.forEach((item) => {
            console.log(item);
            addContact(item);
          });
        }
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
    setMode("edit");
    getClientData();
  }, []);

  return (
    <>
      {loading ? (
        <div>...loading</div>
      ) : (
        <>
          <FormProgress currentStep={currentStep} steps={steps} />
          <div className="mt-4">{getComponent()}</div>
        </>
      )}
    </>
  );
}
