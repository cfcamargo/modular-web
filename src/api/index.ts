import { AuthApi } from "./auth-api";
import { ClientApi } from "./client-api";
import { ProductApi } from "./product-api";
import { ProductionApi } from "./production-api";
import { SupplierApi } from "./supplierApi";
import { UserApi } from "./user-api";

export const clientApi = new ClientApi();
export const productApi = new ProductApi();
export const userApi = new UserApi();
export const authApi = new AuthApi();
export const supplierApi = new SupplierApi();
export const productionApi = new ProductionApi();
