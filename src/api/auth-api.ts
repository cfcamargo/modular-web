import { api } from "@/lib/axios";
import { UserLoggedResponse } from "@/models/responses/user-logged-response";

interface LoginFormProps {
  email: string;
  password: string;
}

interface LoginResponseProps {
  user: UserLoggedResponse;
  acessToken: string;
}

const baseRoute = "/auth";
export class AuthApi {
  async login({
    email,
    password,
  }: LoginFormProps): Promise<{ data: LoginResponseProps }> {
    return await api.post(`${baseRoute}/login`, { email, password });
  }

  async me(): Promise<{ data: { user: UserLoggedResponse } }> {
    return await api.get(`${baseRoute}/me`);
  }

  async loggout(): Promise<{ message: string }> {
    return await api.post(`${baseRoute}/logout`);
  }
}
