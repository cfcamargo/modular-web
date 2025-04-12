import { ClientApi } from "./client-api";
import { ProductApi } from "./product-api";
import { ResetPasswordApi } from "./reset-password";
import { UserApi } from "./user-api";

export const clientApi = new ClientApi();
export const productApi = new ProductApi();
export const userApi = new UserApi();
export const resetPasswordApi = new ResetPasswordApi();
