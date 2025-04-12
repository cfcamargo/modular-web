import {
  UpdatePasswordRequest,
  UserRequest,
  UserUpdateByCodeRequest,
} from "@/models/requests/user-request";
import { MetaProps } from "@/models/responses/meta-response";
import { UserResponse } from "@/models/responses/user-response";

export abstract class IUserApi {
  abstract get(page: number): Promise<{
    data: {
      users: {
        meta: MetaProps;
        data: UserResponse[];
      };
    };
  }>;

  abstract save(
    request: UserRequest
  ): Promise<{ data: { user: UserResponse } }>;

  abstract getDetails(id: number): Promise<{
    data: {
      user: UserResponse;
    };
  }>;

  abstract update(
    request: UserRequest,
    id: number
  ): Promise<{ data: { user: UserResponse } }>;

  abstract finishRegister(
    request: UserUpdateByCodeRequest,
    id: number
  ): Promise<{ data: { user: UserResponse } }>;

  abstract updatePassword(
    request: UpdatePasswordRequest,
    id: number
  ): Promise<{ data: { user: UserResponse } }>;

  abstract destroy(id: number): Promise<void>;
}
