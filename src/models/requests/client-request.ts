import { AddressProps } from "../data/address";
import { BasicDataProps } from "../data/client-basic-data";
import { ContactProps } from "../data/contact";

export interface ClientRequest {
  data: BasicDataProps;
  address: AddressProps | null;
  contacts: ContactProps[] | null;
}
