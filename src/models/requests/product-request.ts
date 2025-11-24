export interface ProductRequest {
  name: string;
  initialStock: number;
  price: number;
  unit: "KG" | "UN" | "M2";
  description?: string;
}
