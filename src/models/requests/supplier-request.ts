export interface CreateSupplierRequest {
  type: "cpf" | "cnpj";   
  document: string;  
  name: string;  
  fantasyName?: string; 
}
