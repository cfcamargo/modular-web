import { ClientApi } from "./client-api";
import { ProductApi } from "./product-api";
import { ResetPasswordApi } from "./reset-password";
import { UserApi } from "./user-api";
import { AuthApi } from "./auth-api";

export const clientApi = new ClientApi();
export const productApi = new ProductApi();
export const userApi = new UserApi();
export const resetPasswordApi = new ResetPasswordApi();
export const authApi = new AuthApi();
