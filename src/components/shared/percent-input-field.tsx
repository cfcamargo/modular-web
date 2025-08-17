import { forwardRef, useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PercentInputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  min?: string | number;
  max?: string | number;
}

const PercentInputField = forwardRef<HTMLInputElement, PercentInputFieldProps>(
  (
    {
      label,
      error,
      className,
      onKeyDown,
      min = 0,
      max = 100,
      onBlur,
      ...props
    },
    ref
  ) => {
    // Converte min e max para números
    const minValue = typeof min === "string" ? parseFloat(min) || 0 : min;
    const maxValue = typeof max === "string" ? parseFloat(max) || 100 : max;

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

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value) {
        const numericValue = parseFloat(value.replace(",", "."));
        if (!isNaN(numericValue)) {
          let clampedValue = numericValue;
          if (numericValue < minValue) {
            clampedValue = minValue;
          } else if (numericValue > maxValue) {
            clampedValue = maxValue;
          }

          if (clampedValue !== numericValue) {
            e.target.value = clampedValue.toString().replace(".", ",");
          }
        }
      }

      if (onBlur) {
        onBlur(e);
      }
    };

    return (
      <div className="space-y-2">
        {label && <Label htmlFor={id}>{label}</Label>}
        <div className="relative">
          <Input
            ref={ref}
            id={id}
            className={cn("peer ps-8", className)}
            placeholder="0,00"
            type="text"
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            {...props}
          />
          <span className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
            %
          </span>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);

PercentInputField.displayName = "PercentInputField";

export { PercentInputField };
