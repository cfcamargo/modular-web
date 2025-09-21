import { Customer, Product } from "@/models/common/quotes";

export const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Empresa ABC Ltda",
    email: "contato@empresaabc.com.br",
    phone: "(11) 99999-0001",
  },
  {
    id: "2",
    name: "Tech Solutions Inc",
    email: "admin@techsolutions.com",
    phone: "(11) 99999-0002",
  },
  {
    id: "3",
    name: "Comercial XYZ",
    email: "vendas@comercialxyz.com.br",
    phone: "(11) 99999-0003",
  },
  {
    id: "4",
    name: "Indústria Moderna S.A.",
    email: "compras@industriamoderna.com.br",
    phone: "(11) 99999-0004",
  },
  {
    id: "5",
    name: "Startup Innovation",
    email: "hello@startupinnovation.io",
    phone: "(11) 99999-0005",
  },
];

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Notebook Dell Inspiron 15",
    defaultPrice: 2499.9,
  },
  {
    id: "2",
    name: "Monitor LG 24'' Full HD",
    defaultPrice: 799.9,
  },
  {
    id: "3",
    name: "Teclado Mecânico RGB",
    defaultPrice: 299.9,
  },
  {
    id: "4",
    name: "Mouse Wireless Logitech",
    defaultPrice: 129.9,
  },
  {
    id: "5",
    name: "Headset Gamer HyperX",
    defaultPrice: 449.9,
  },
  {
    id: "6",
    name: "Webcam Full HD 1080p",
    defaultPrice: 199.9,
  },
  {
    id: "7",
    name: "Impressora Multifuncional HP",
    defaultPrice: 899.9,
  },
  {
    id: "8",
    name: "Cadeira Gamer DT3Sports",
    defaultPrice: 1299.9,
  },
  {
    id: "9",
    name: "Mesa para Computador",
    defaultPrice: 599.9,
  },
  {
    id: "10",
    name: "Licença Microsoft Office 365",
    defaultPrice: 249.9,
  },
];
