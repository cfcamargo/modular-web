import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
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
  Clock,
  CheckCircle,
  Car,
  Box,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Componentes UI (Shadcn)
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

import { orderApi } from "@/api";
import { useDebounce } from "@/hooks/use-debounce";
import { OrderResponse } from "@/models/responses/order-response";
import { OrderStatusEnum } from "@/utils/enums/OrderStatusEnum";
import { GetOrdersRequest } from "@/models/requests/order-request";
import { MetaProps } from "@/models/responses/meta-response";
import Pagination from "@/components/shared/pagination";
import { OrderCountersProps } from "@/api/order-api";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  [OrderStatusEnum.DRAFT]: {
    label: "Orçamento",
    color: "bg-slate-100 text-slate-800 border-slate-300",
    icon: FileText,
  },
  [OrderStatusEnum.SHIPMENT]: {
    label: "Pendente",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
    icon: Clock,
  },
  [OrderStatusEnum.CONFIRMED]: {
    label: "Confirmado",
    color: "bg-blue-100 text-blue-800 border-blue-300",
    icon: ShoppingCart,
  },
  [OrderStatusEnum.DONE]: {
    label: "Entregue",
    color: "bg-green-100 text-green-800 border-green-300",
    icon: CheckCircle,
  },
  [OrderStatusEnum.CANCELED]: {
    label: "Cancelado",
    color: "bg-red-100 text-red-800 border-red-300",
    icon: X,
  },
};

export default function Quotes() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [meta, setMeta] = useState<MetaProps | null>(null);
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [counters, setCounters] = useState<OrderCountersProps | null>(null);

  const [filters, setFilters] = useState({
    searchTerm: "",
    status: "all" as OrderStatusEnum | "all",
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    page: 1,
    perPage: 10,
  });

  const debouncedSearchTerm = useDebounce(filters.searchTerm, 500);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const payload: GetOrdersRequest = {
        page: filters.page,
        perPage: filters.perPage,
        searchTerm: debouncedSearchTerm || undefined,
        status: filters.status === "all" ? undefined : filters.status,
        startDate: filters.startDate?.toISOString(),
        endDate: filters.endDate?.toISOString(),
      };

      console.log(payload);

      const response = await orderApi.findAll(payload);

      setOrders(response.data.orders);
      setTotalRecords(response.data.meta.total);
      setMeta(response.data.meta);
      setCounters(response.data.counters);
    } catch (error) {
      console.error("Erro ao carregar pedidos:", error);
    } finally {
      setLoading(false);
    }
  }, [
    filters.page,
    filters.perPage,
    filters.status,
    filters.startDate,
    filters.endDate,
    debouncedSearchTerm,
  ]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleClearFilters = () => {
    setFilters({
      searchTerm: "",
      status: "all",
      startDate: undefined,
      endDate: undefined,
      page: 1,
      perPage: 10,
    });
  };

  const stats = {
    total: totalRecords,
    valorTotal:
      orders.length > 0
        ? orders.reduce((acc, curr) => acc + Number(curr.finalTotal), 0)
        : 0,
  };

  return (
    <div className="space-y-6">
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Pedidos</p>
              <p className="text-2xl font-bold">{counters?.totalCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-yellow-100 p-2">
              <Box className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orçamentos</p>
              <p className="text-xl font-bold">
                {counters?.totalDraftsCount ?? 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Valor Total Pedidos
              </p>
              <p className="text-xl font-bold">
                {counters?.totalSalesValue?.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-100 p-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Valor total Orçamento
              </p>
              <p className="text-xl font-bold">
                {counters?.totalDraftsValue?.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filtros</span>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="search">Buscar</Label>
            <Input
              id="search"
              placeholder="Nome do cliente ou código..."
              value={filters.searchTerm}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status-filter">Status</Label>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  status: value as OrderStatusEnum | "all",
                }))
              }
            >
              <SelectTrigger id="status-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value={OrderStatusEnum.DRAFT}>Orçamento</SelectItem>
                <SelectItem value={OrderStatusEnum.SHIPMENT}>
                  Pendente
                </SelectItem>
                <SelectItem value={OrderStatusEnum.CONFIRMED}>
                  Confirmado
                </SelectItem>
                <SelectItem value={OrderStatusEnum.DONE}>Entregue</SelectItem>
                <SelectItem value={OrderStatusEnum.CANCELED}>
                  Cancelado
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Data Inicial</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.startDate && "text-muted-foreground",
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {filters.startDate
                    ? format(filters.startDate, "dd/MM/yyyy")
                    : "Selecionar"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={filters.startDate}
                  onSelect={(date) =>
                    setFilters((prev) => ({ ...prev, startDate: date }))
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Data Final</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.endDate && "text-muted-foreground",
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {filters.endDate
                    ? format(filters.endDate, "dd/MM/yyyy")
                    : "Selecionar"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={filters.endDate}
                  onSelect={(date) =>
                    setFilters((prev) => ({ ...prev, endDate: date }))
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {(filters.status !== "all" ||
          filters.startDate ||
          filters.endDate ||
          filters.searchTerm) && (
          <div className="mt-4">
            <Button variant="outline" size="sm" onClick={handleClearFilters}>
              Limpar Filtros
            </Button>
          </div>
        )}
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-center">Itens</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    Carregando pedidos...
                  </TableCell>
                </TableRow>
              ) : orders.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-12 text-muted-foreground"
                  >
                    Nenhum pedido encontrado com os filtros atuais.
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => {
                  const statusConfig = STATUS_CONFIG[order.status] || {
                    label: order.status,
                    color: "bg-gray-100 text-gray-800",
                    icon: FileText,
                  };
                  const StatusIcon = statusConfig.icon;

                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono font-semibold">
                        #{order.code}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {(order as any).client?.name || "Cliente não inf."}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(order.createdAt), "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-mono">
                          {Number(order.totalItems) || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {Number(order.finalTotal).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("gap-1.5", statusConfig.color)}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {statusConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/quotes/${order.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Visualizar Detalhes"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
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

      {meta && orders.length > 0 && (
        <Pagination
          pageIndex={meta.page}
          totalCount={meta.total}
          perPage={meta.perPage}
          meta={meta}
          getData={fetchOrders}
        />
      )}
    </div>
  );
}
