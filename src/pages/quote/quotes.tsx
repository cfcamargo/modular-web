import { useState } from "react";
import {
  Plus,
  Eye,
  Edit,
  X,
  Calendar,
  Filter,
  ShoppingCart,
  FileText,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Status types and configuration
const STATUS_CONFIG = {
  orcamento: {
    label: "Orçamento",
    color: "bg-slate-100 text-slate-800 border-slate-300",
    icon: FileText,
  },
  pendente: {
    label: "Pendente",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: Clock,
  },
  confirmado: {
    label: "Confirmado",
    color: "bg-blue-100 text-blue-800 border-blue-300",
    icon: ShoppingCart,
  },
  entregue: {
    label: "Entregue",
    color: "bg-green-100 text-green-800 border-green-300",
    icon: CheckCircle,
  },
  cancelado: {
    label: "Cancelado",
    color: "bg-red-100 text-red-800 border-red-300",
    icon: X,
  },
} as const;

type StatusType = keyof typeof STATUS_CONFIG;

interface SalesOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerDocument: string;
  date: Date;
  total: number;
  status: StatusType;
  itemsCount: number;
  hasDelivery: boolean;
}

import { Clock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

// Mock orders data
const mockOrders: SalesOrder[] = [
  {
    id: "1",
    orderNumber: "PV-2025-001",
    customerName: "João Silva",
    customerDocument: "123.456.789-00",
    date: new Date(2025, 0, 20),
    total: 4500.0,
    status: "confirmado",
    itemsCount: 3,
    hasDelivery: true,
  },
  {
    id: "2",
    orderNumber: "PV-2025-002",
    customerName: "Empresa XYZ Ltda",
    customerDocument: "12.345.678/0001-90",
    date: new Date(2025, 0, 19),
    total: 12500.0,
    status: "entregue",
    itemsCount: 8,
    hasDelivery: true,
  },
  {
    id: "3",
    orderNumber: "ORC-2025-003",
    customerName: "Maria Santos",
    customerDocument: "987.654.321-00",
    date: new Date(2025, 0, 18),
    total: 2100.0,
    status: "orcamento",
    itemsCount: 2,
    hasDelivery: false,
  },
  {
    id: "4",
    orderNumber: "PV-2025-004",
    customerName: "Carlos Oliveira",
    customerDocument: "456.789.123-00",
    date: new Date(2025, 0, 17),
    total: 3200.0,
    status: "pendente",
    itemsCount: 4,
    hasDelivery: true,
  },
  {
    id: "5",
    orderNumber: "PV-2025-005",
    customerName: "Ana Costa",
    customerDocument: "321.654.987-00",
    date: new Date(2025, 0, 15),
    total: 850.0,
    status: "cancelado",
    itemsCount: 1,
    hasDelivery: false,
  },
];

export default function Quotes() {
  const [orders] = useState<SalesOrder[]>(mockOrders);
  const [filterStatus, setFilterStatus] = useState<StatusType | "all">("all");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");

  // Apply filters
  const filteredOrders = orders.filter((order) => {
    // Status filter
    if (filterStatus !== "all" && order.status !== filterStatus) return false;

    // Date range filter
    if (dateFrom && order.date < dateFrom) return false;
    if (dateTo && order.date > dateTo) return false;

    // Search filter (by order number or customer name)
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      if (
        !order.orderNumber.toLowerCase().includes(search) &&
        !order.customerName.toLowerCase().includes(search)
      ) {
        return false;
      }
    }

    return true;
  });

  // Calculate statistics
  const stats = {
    total: filteredOrders.length,
    orcamento: filteredOrders.filter((o) => o.status === "orcamento").length,
    pendente: filteredOrders.filter((o) => o.status === "pendente").length,
    confirmado: filteredOrders.filter((o) => o.status === "confirmado").length,
    entregue: filteredOrders.filter((o) => o.status === "entregue").length,
    valorTotal: filteredOrders.reduce((sum, o) => sum + o.total, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Pedidos de Venda
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todos os pedidos e orçamentos da sua empresa
          </p>
        </div>
        <Link to="/quotes/create">
          <Button size="lg" className="gap-2">
            <Plus className="h-5 w-5" />
            Novo Pedido
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-slate-100 p-2">
              <FileText className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Orçamentos</p>
              <p className="text-2xl font-bold">{stats.orcamento}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-2">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pendentes</p>
              <p className="text-2xl font-bold">{stats.pendente}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Entregues</p>
              <p className="text-2xl font-bold">{stats.entregue}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Valor Total</p>
              <p className="text-xl font-bold">
                R$ {stats.valorTotal.toLocaleString("pt-BR")}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filtros</span>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Buscar</Label>
            <Input
              id="search"
              placeholder="Pedido ou cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <Label htmlFor="status-filter">Status</Label>
            <Select
              value={filterStatus}
              onValueChange={(value) =>
                setFilterStatus(value as StatusType | "all")
              }
            >
              <SelectTrigger id="status-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="orcamento">Orçamento</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="entregue">Entregue</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date From */}
          <div className="space-y-2">
            <Label>Data Inicial</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateFrom && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "Selecionar"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Date To */}
          <div className="space-y-2">
            <Label>Data Final</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateTo && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "dd/MM/yyyy") : "Selecionar"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {(filterStatus !== "all" || dateFrom || dateTo || searchTerm) && (
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilterStatus("all");
                setDateFrom(undefined);
                setDateTo(undefined);
                setSearchTerm("");
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        )}
      </Card>

      {/* Orders Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-center">Itens</TableHead>
                <TableHead>Entrega</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-12 text-muted-foreground"
                  >
                    Nenhum pedido encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => {
                  const StatusIcon = STATUS_CONFIG[order.status].icon;

                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono font-semibold">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {order.customerName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {order.customerDocument}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(order.date, "dd/MM/yyyy", { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-mono">
                          {order.itemsCount}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {order.hasDelivery ? (
                          <Badge variant="outline" className="gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Sim
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Retirada
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold">
                        R$ {order.total.toLocaleString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "gap-1.5",
                            STATUS_CONFIG[order.status].color
                          )}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {STATUS_CONFIG[order.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Results summary */}
      <div className="text-sm text-muted-foreground text-center">
        Mostrando {filteredOrders.length} de {orders.length}{" "}
        {filteredOrders.length === 1 ? "pedido" : "pedidos"}
      </div>
    </div>
  );
}
