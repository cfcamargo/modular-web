export const parseMoneyValue = (value: string): number => {
    if (!value) return 0;
    
    // Remove espaços e caracteres não numéricos exceto vírgula e ponto
    const cleanValue = value.replace(/[^\d.,]/g, '');
    
    // Se contém vírgula e ponto, assume formato brasileiro (1.234,56)
    if (cleanValue.includes(',') && cleanValue.includes('.')) {
      return parseFloat(cleanValue.replace(/\./g, '').replace(',', '.'));
    }
    
    // Se contém apenas vírgula, assume vírgula como decimal (1234,56)
    if (cleanValue.includes(',') && !cleanValue.includes('.')) {
      return parseFloat(cleanValue.replace(',', '.'));
    }
    
    // Se contém apenas ponto, verifica se é decimal ou separador de milhares
    if (cleanValue.includes('.') && !cleanValue.includes(',')) {
      const parts = cleanValue.split('.');
      // Se a última parte tem 2 dígitos, assume como decimal
      if (parts[parts.length - 1].length === 2) {
        return parseFloat(cleanValue);
      }
      // Caso contrário, assume como separador de milhares
      return parseFloat(cleanValue.replace(/\./g, ''));
    }
    
    // Apenas números
    return parseFloat(cleanValue) || 0;
  };

export const formatMoneyValue = (value: number): string => {
    if (value === null || value === undefined || isNaN(value)) return "0,00";
    
    // Usa a API nativa do JavaScript para formatação numérica brasileira
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  export const formatNumberToCurrency = (value: number): string => {
    console.log(value)
    if (value === null || value === undefined || isNaN(value)) return "0,00";
    
    // Usa a API nativa do JavaScript para formatação de moeda brasileira
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  };