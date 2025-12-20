import { api } from "@/lib/axios";
import { GetDashboardRequest } from "@/models/requests/dashboard-request";
import { DashboardResponse } from "@/models/responses/dashboard-response";

export const dashboardApi = {
  getDashboardData(
    params: GetDashboardRequest,
  ): Promise<{ data: DashboardResponse }> {
    return api.get("/dashboard", {
      params,
    });
  },
};
