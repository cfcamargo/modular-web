import { UpdateUserByCodeRequest } from "@/models/requests/reset-password-request";
import { UserResponse } from "@/models/responses/user-response";

export abstract class IResetPasswordApi {
  abstract getUserDetailByCode(
    code: string
  ): Promise<{ data: { user: UserResponse } }>;

  abstract updateUserByCode(
    request: UpdateUserByCodeRequest,
    code: string
  ): Promise<{ data: { user: UserResponse } }>;
}
