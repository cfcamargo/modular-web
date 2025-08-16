export interface ProductRequest {
  name: string;
  brand: string;
  costPrice: number;
  description?: string
  price: number;
  unit: "KG" | "UN" | "M2";
}
