
type SupplierType = "CNPJ" | "CPF";

export interface SupplierResponse {
  id: string;
  type: SupplierType
  name: string;        
  fantasyName: string | null;
  document: string;         
  createdAt: Date;
  updatedAt: Date;
  status: number
}