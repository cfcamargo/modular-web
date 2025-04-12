import { MetaProps } from "@/models/responses/meta-response";
import { UserResponse } from "@/models/responses/user-response";
import { IUserApi } from "./interface/users-api";
import { api } from "@/lib/axios";
import {
  UpdatePasswordRequest,
  UserRequest,
  UserUpdateByCodeRequest,
} from "@/models/requests/user-request";

const baseURL = "/users";
export class UserApi extends IUserApi {
  get(page: number): Promise<{
    data: { users: { meta: MetaProps; data: UserResponse[] } };
  }> {
    return api.get(`${baseURL}?page=${page}`);
  }

  save(request: UserRequest): Promise<{ data: { user: UserResponse } }> {
    return api.post(baseURL, request);
  }

  getDetails(id: number): Promise<{ data: { user: UserResponse } }> {
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
