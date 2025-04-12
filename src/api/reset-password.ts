import { IResetPasswordApi } from "./interface/reset-password";
import { api } from "@/lib/axios";
import { UpdateUserByCodeRequest } from "@/models/requests/reset-password-request";
import { UserResponse } from "@/models/responses/user-response";

const baseURL = "/reset-password";
export class ResetPasswordApi extends IResetPasswordApi {
  getUserDetailByCode(code: string): Promise<{ data: { user: UserResponse } }> {
    return api.get(`${baseURL}/${code}`);
  }

  updateUserByCode(
    request: UpdateUserByCodeRequest,
    code: string
  ): Promise<{ data: { user: UserResponse } }> {
    return api.patch(`${baseURL}/${code}`, request);
  }
}
