import { forwardRef, useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface InputMoneyProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  currency?: string;
  currencySymbol?: string;
  error?: string;
}

const InputMoney = forwardRef<HTMLInputElement, InputMoneyProps>(
  (
    {
      label,
      currency = "BRL",
      currencySymbol = "R$",
      error,
      className,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const id = useId();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Permite: números (0-9), vírgula, ponto, backspace, delete, tab, escape, enter, home, end, setas
      const allowedKeys = [
        "Backspace",
        "Delete",
        "Tab",
        "Escape",
        "Enter",
        "Home",
        "End",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
      ];

      const isNumber = /^[0-9]$/.test(e.key);
      const isCommaOrDot = e.key === "," || e.key === ".";
      const isAllowedKey = allowedKeys.includes(e.key);
      const isCtrlA = e.ctrlKey && e.key === "a"; // Ctrl+A para selecionar tudo
      const isCtrlC = e.ctrlKey && e.key === "c"; // Ctrl+C para copiar
      const isCtrlV = e.ctrlKey && e.key === "v"; // Ctrl+V para colar
      const isCtrlX = e.ctrlKey && e.key === "x"; // Ctrl+X para recortar

      if (
        !isNumber &&
        !isCommaOrDot &&
        !isAllowedKey &&
        !isCtrlA &&
        !isCtrlC &&
        !isCtrlV &&
        !isCtrlX
      ) {
        e.preventDefault();
      }

      if (onKeyDown) {
        onKeyDown(e);
      }
    };

    return (
      <div className="space-y-2">
        {label && <Label htmlFor={id}>{label}</Label>}
        <div className="relative">
          <Input
            ref={ref}
            id={id}
            className={cn("peer ps-12 pe-12", className)}
            placeholder="0,00"
            type="text"
            onKeyDown={handleKeyDown}
            {...props}
          />
          <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
            {currencySymbol}
          </span>
          <span className="text-muted-foreground pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 text-sm peer-disabled:opacity-50">
            {currency}
          </span>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);

InputMoney.displayName = "InputMoney";

export default InputMoney;
