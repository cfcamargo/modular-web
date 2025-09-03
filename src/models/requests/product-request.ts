export interface ProductRequest {
  name: string;
  brand: string;
  unit: "KG" | "UN" | "M2";
  description?: string
  marginPercent: number
}
