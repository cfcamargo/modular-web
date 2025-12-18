import { useEffect, useState } from "react";

/**
 * Hook para debouncing de valores.
 * @param value O valor que será observado
 * @param delay O tempo de atraso em ms (padrão 500ms)
 * @returns O valor com atraso
 */
export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Cria um timer para atualizar o valor após o delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay || 500);

    // Limpa o timer anterior se o valor mudar antes do tempo acabar
    // Isso é o que faz o "cancelamento" das chamadas antigas
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
