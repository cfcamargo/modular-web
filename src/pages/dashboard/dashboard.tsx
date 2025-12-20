import { useEffect, useState } from "react";

import { DashboardHeader } from "./components/dashboard-header";
import { SalesMetrics } from "./components/sales-metrics";
import { SalesChart } from "./components/sales-chart";
import { RecentOrders } from "./components/recent-orders";
import { dashboardApi } from "@/api/dashboard-api";
import { FilterTypeEnum, getDateRange } from "@/utils/utilsDate";
import { DateRange } from "./types";
import { DashboardResponse } from "@/models/responses/dashboard-response";

const range = getDateRange(FilterTypeEnum.DAY);

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(range);
  const [viewType, setViewType] = useState<FilterTypeEnum>(FilterTypeEnum.DAY);

  const [loading, setLoading] = useState<boolean>(true);
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(
    null,
  );

  const getData = async (dateRequest?: any) => {
    const start =
      dateRequest?.startDate ||
      dateRequest?.from ||
      dateRange?.startDate ||
      dateRange?.from;
    const end =
      dateRequest?.endDate ||
      dateRequest?.to ||
      dateRange?.endDate ||
      dateRange?.to;

    if (!start || !end) {
      console.log("Datas incompletas, aguardando seleção...");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      };

      const resp = await dashboardApi.getDashboardData(payload);
      setDashboardData(resp.data);
      console.log(resp);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getData();
  }, [dateRange]);

  const onViewTypeChange = (viewType: FilterTypeEnum) => {
    if (viewType !== FilterTypeEnum.CUSTOM) {
      setDateRange(getDateRange(viewType));
    }
    setViewType(viewType);
  };

  return (
    !loading &&
    dashboardData && (
      <div className="min-h-screen bg-background">
        <DashboardHeader
          dateRange={dateRange}
          onDateRangeChange={(range) => setDateRange(range)}
          onViewTypeChange={(viewType) => {
            onViewTypeChange(viewType);
          }}
          viewType={viewType}
        />
        <div className="mx-auto p-4 space-y-6">
          <SalesMetrics loading={loading} kpi={dashboardData?.kpi} />

          <SalesChart data={dashboardData?.chart} />

          <RecentOrders orders={dashboardData.recentOrders} />
        </div>
      </div>
    )
  );
}
