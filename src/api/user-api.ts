import { UserResponse } from "@/models/responses/user-response";
import { api } from "@/lib/axios";
import {
  UpdatePasswordRequest,
  UserRequest,
  UserUpdateByCodeRequest,
} from "@/models/requests/user-request";
import { PaginatedResponse } from "@/models/requests/paginated-response";
import { GridRequest } from "@/models/requests/grid-request";

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

  finishRegister(
    request: UserUpdateByCodeRequest,
    id: number
  ): Promise<{ data: { user: UserResponse } }> {
    return api.patch(`${baseURL}/register/${id}`, request);
  }

  update(
    request: UserRequest,
    id: number
  ): Promise<{ data: { user: UserResponse } }> {
    return api.patch(`${baseURL}/${id}`, request);
  }

  updatePassword(
    request: UpdatePasswordRequest,
    id: number
  ): Promise<{ data: { user: UserResponse } }> {
    return api.patch(`${baseURL}/update-password`, request);
  }
}
