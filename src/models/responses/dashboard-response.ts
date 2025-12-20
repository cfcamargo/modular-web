import { OrderStatusEnum } from "@/utils/enums/OrderStatusEnum";

export interface DashboardKPI {
  totalRevenue: number;
  totalOrders: number;
  totalQuotes: number;
}

export interface DashboardChartItem {
  name: string;
  value: number;
}

export interface RecentOrder {
  id: number;
  code: string;
  clientName: string;
  total: number;
  status: OrderStatusEnum;
  date: string;
}

export interface DashboardResponse {
  kpi: DashboardKPI;
  chart: DashboardChartItem[];
  recentOrders: RecentOrder[];
}
