import { FormProgress } from "@/components/shared/form-progress";
import { useEffect, useState } from "react";
import FormClientType from "./components/form-client-type";
import FormBasicDataPf from "./components/form-basic-data-pf";
import FormBasicDataPJ from "./components/form-basic-data-pj";
import { FormAddressData } from "./components/form-address-data";
import { FormContactData } from "./components/form-contact-data";
import { FormResumData } from "./components/form-resum-data";
import { useClientStore } from "@/store/clients/client";

export default function CreateClient() {
  const [currentStep, setCurrentStep] = useState(1);
  const steps = [
    { label: "Tipo de Cliente", description: "PJ ou PF" },
    { label: "Dados Basicos", description: "Cadastre as informações básicas" },
    { label: "Endereço", description: "Cadastre o Endereço" },
    { label: "Contato", description: "Adiciona Contatos" },
    { label: "Resumo", description: "Confirme as informações" },
  ];
  const [clientType, setClientType] = useState<"pj" | "pf">("pf");
  const { reset } = useClientStore();

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const getComponent = () => {
    if (currentStep === 1) {
      return (
        <FormClientType
          setClientType={setClientType}
          nextProgress={() => nextStep()}
        />
      );
    }
    if (currentStep === 2) {
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

    if (currentStep === 3) {
      return (
        <FormAddressData
          backProgress={() => prevStep()}
          nextProgress={() => nextStep()}
        />
      );
    }

    if (currentStep === 4) {
      return (
        <FormContactData
          backProgress={() => prevStep()}
          nextProgress={() => nextStep()}
        />
      );
    }

    if (currentStep === 5) {
      return <FormResumData backProgress={() => prevStep()} />;
    }
  };

  useEffect(() => {
    reset();
  }, []);

  return (
    <>
      <FormProgress currentStep={currentStep} steps={steps} />
      <div className="mt-4">{getComponent()}</div>
    </>
  );
}
