import { AddressProps } from "@/models/data/address";
import { BasicDataProps } from "@/models/data/client-basic-data";
import { ContactProps } from "@/models/data/contact";
import { create } from "zustand";

interface ClientStoreProps {
  mode: "create" | "edit";
  type: "pj" | "pf";
  basicData: BasicDataProps;
  address: AddressProps | null;
  contacts: ContactProps[];

  setMode: (mode: "create" | "edit") => void;
  setBasicData: (data: BasicDataProps) => void;
  setAddress: (data: AddressProps | null) => void;
  setType: (type: "pf" | "pj") => void;
  addContact: (data: ContactProps) => void;
  clearContacts: () => void;
  reset: () => void;
}

const initialState = {
  mode: "create" as const,
  type: "pf" as const,
  basicData: {} as BasicDataProps,
  address: {} as AddressProps,
  contacts: [],
};

export const useClientStore = create<ClientStoreProps>((set) => ({
  ...initialState,

  setBasicData: (data: BasicDataProps) =>
    set(() => ({
      basicData: data,
    })),

  setAddress: (data: AddressProps | null) =>
    set(() => ({
      address: data,
    })),

  addContact: (data: ContactProps) =>
    set((state) => ({
      contacts: [...state.contacts, data],
    })),

  setType: (type: "pj" | "pf") =>
    set(() => ({
      type: type,
    })),

  setMode: (mode: "create" | "edit") =>
    set(() => ({
      mode: mode,
    })),

  clearContacts: () =>
    set(() => ({
      contacts: [],
    })),

  reset: () => set(initialState),
}));
