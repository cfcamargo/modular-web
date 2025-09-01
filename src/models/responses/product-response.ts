type Unit = "UN" | "M2" | "KG"

export interface ProductResponse {
  id: string;
  name: string;
  brand: string;
  unit: Unit;
  description: string;
  status: number;
  marginPercent?: string;
  stockOnHand: number;
  avgUnitCost: number;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string | null;
}
