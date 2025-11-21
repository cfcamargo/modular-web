import { api } from "@/lib/axios";
import type { GridRequest } from "@/models/requests/grid-request";
import type { PaginatedResponse } from "@/models/requests/paginated-response";
import type { UpdateUserByCodeRequest } from "@/models/requests/reset-password-request";
import type {
  UpdatePasswordRequest,
  UserRequest,
  UserUpdateByCodeRequest,
} from "@/models/requests/user-request";
import type { UserResponse } from "@/models/responses/user-response";

const baseURL = "/users";
export class UserApi {
  get(
    request: GridRequest
  ): Promise<{ data: PaginatedResponse<UserResponse> }> {
    return api.get(`${baseURL}`, {
      params: request,
    });
  }

  save(request: UserRequest): Promise<{ data: { user: UserResponse } }> {
    return api.post(baseURL, request);
  }

  getDetails(id: string): Promise<{ data: { user: UserResponse } }> {
    return api.get(`${baseURL}/${id}`);
  }

  destroy(id: number): Promise<void> {
    return api.delete(`${baseURL}/${id}`);
  }

  update(
    request: UserRequest,
    id: number
  ): Promise<{ data: { user: UserResponse } }> {
    return api.patch(`${baseURL}/${id}`, request);
  }

  updatePassword(
    request: UpdatePasswordRequest
  ): Promise<{ data: { user: UserResponse } }> {
    return api.patch(`${baseURL}/update-password`, request);
  }

  getUserDetailByCode(code: string): Promise<{ data: { user: UserResponse } }> {
    return api.get(`${baseURL}/reset-password/${code}`);
  }

  updateUserByCode(
    request: UpdateUserByCodeRequest
  ): Promise<{ data: { user: UserResponse } }> {
    return api.patch(`${baseURL}/reset-password`, request);
  }
}
