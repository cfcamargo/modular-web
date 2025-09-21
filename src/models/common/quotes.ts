export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface Product {
  id: string;
  name: string;
  defaultPrice?: number;
}

export interface QuoteItem {
  id: string;
  product: Product | null;
  quantity: number | string;
  unitPrice: number | string;
  discount?: number | string;
}

export interface Quote {
  customer: Customer | null;
  validUntil: Date | null;
  notes?: string;
  items: QuoteItem[];
  freight?: number | string;
  extraDiscount?: number | string;
}
