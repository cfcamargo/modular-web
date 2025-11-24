type Unit = "UN" | "M2" | "KG";

export interface ProductResponse {
  id: string;
  name: string;
  unit: Unit;
  description: string;
  status: number;
  price: number;
  stockOnHand: number;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string | null;
}
