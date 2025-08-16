import CurrencyInput, { CurrencyInputProps } from "react-currency-input-field";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface CurrencyInputFieldProps extends Omit<CurrencyInputProps, 'value' | 'onValueChange' | 'onChange'> {
  value?: number | string;
  onChange?: (value: number | undefined) => void;
}

export const ControlledCurrencyInput = forwardRef<HTMLInputElement, CurrencyInputFieldProps>((
  { className, value, onChange, ...props },
  ref
) => {
  // Converte valor numérico para string formatada para exibição
  const formatValueForDisplay = (val: number | string | undefined): string | undefined => {
    if (val === undefined || val === null || val === '') return undefined;
    
    // Se já é uma string, verifica se é válida
    if (typeof val === 'string') {
      // Se a string está vazia ou é apenas espaços, retorna undefined
      if (val.trim() === '') return undefined;
      // Se contém apenas números, vírgulas e pontos, retorna como está
      if (/^[0-9.,\s]*$/.test(val)) return val;
      // Caso contrário, tenta converter para número e reformatar
      const numericValue = parseFloat(val.replace(/\./g, '').replace(',', '.'));
      if (!isNaN(numericValue)) {
        return numericValue.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      }
      return undefined;
    }
    
    // Se é um número, converte para string formatada brasileira
    if (typeof val === 'number') {
      // Verifica se é um número válido
      if (isNaN(val) || !isFinite(val)) return undefined;
      // Garante que não seja negativo (já que allowNegativeValue é false)
      const positiveVal = Math.max(0, val);
      return positiveVal.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    
    return undefined;
  };

  // Converte string formatada para número
  const handleValueChange = (value: string | undefined) => {
    if (!onChange) return;
    
    if (!value || value.trim() === '') {
      onChange(undefined);
      return;
    }

    try {
      // Remove formatação e converte para número
      const cleanValue = value.replace(/\./g, '').replace(',', '.');
      const numericValue = parseFloat(cleanValue);
      
      // Verifica se é um número válido e finito
      if (isNaN(numericValue) || !isFinite(numericValue)) {
        onChange(undefined);
        return;
      }
      
      // Garante que não seja negativo
      const positiveValue = Math.max(0, numericValue);
      
      // Limita a 2 casas decimais
      const roundedValue = Math.round(positiveValue * 100) / 100;
      
      onChange(roundedValue);
    } catch (error) {
      // Em caso de erro na conversão, define como undefined
      console.warn('Erro ao converter valor monetário:', error);
      onChange(undefined);
    }
  };

  return (
    <CurrencyInput
      ref={ref}
      intlConfig={{ locale: "pt-BR", currency: "BRL" }}
      allowNegativeValue={false}
      accept="0-9,."
      value={formatValueForDisplay(value)}
      onValueChange={handleValueChange}
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
});

ControlledCurrencyInput.displayName = "ControlledCurrencyInput";
