import { Controller, Control } from "react-hook-form";
import CurrencyInput, { CurrencyInputProps } from "react-currency-input-field";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

interface CurrencyInputFieldProps extends CurrencyInputProps {}

export function ControlledCurrencyInput({
  className,
  ...props
}: CurrencyInputFieldProps) {
  return (
    <CurrencyInput
      intlConfig={{ locale: "pt-BR", currency: "BRL" }}
      allowNegativeValue={false}
      accept="0-9,."
      onKeyDown={(e) => {
        const allowedKeys = [
          "Backspace",
          "Delete",
          "ArrowLeft",
          "ArrowRight",
          "Tab",
          "Home",
          "End",
          ",", // vírgula do teclado
        ];

        const isNumberKey = /^[0-9]$/.test(e.key);

        if (!isNumberKey && !allowedKeys.includes(e.key)) {
          e.preventDefault();
        }
      }}
      decimalsLimit={2}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  );
}
