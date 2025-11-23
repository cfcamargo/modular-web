import { SupplierType } from "../requests/client-request";

export interface AddressResponse {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ClientResponse {
  id?: string;
  name: string;
  document: string;
  type?: SupplierType;
  email?: string;
  phone?: string;
  status?: number;
  address?: AddressResponse;
}
