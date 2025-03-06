import { AddressProps } from "../data/address";
import { ContactProps } from "../data/contact";

export interface ClientResponse {
  id: number;
  fullName: string;
  type: "pj" | "pf";
  fantasyName: string;
  document: string;
  rgIe: string;
  im: string;
  createdAt: string;
  updatedAt: string;
  birthdate?: string;
}

export interface ClientDetailsResponse extends ClientResponse {
  address: AddressProps | null;
  contacts: ContactProps[];
}
