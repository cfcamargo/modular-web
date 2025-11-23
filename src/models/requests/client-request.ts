export enum SupplierType {
  PF = "PF",
  PJ = "PJ",
}

export interface AddressPayload {
  street: string;
  number: string;
  complement?: string; // Opcional
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ClientRequest {
  name: string;
  document: string;
  type?: SupplierType;
  email?: string;
  phone?: string;
  status?: number;
  address?: AddressPayload | null;
}

export interface GetClientsRequest {
  page: number;
  searchTerm?: string;
  perPage: number;
}
