import { api } from "@/lib/axios";

export interface SignInBody {
  email: string;
  password: string;
}

export interface SigninResponse {
  user: {
    createdAt: string;
    email: string;
    fullName: string;
    id: number;
    role: "ADMIN" | "DEFAULT";
    updatedAt: string;
  };
  token: {
    abilities: string[];
    expiresAt: string;
    lastUsedAt: string | null;
    name: string | null;
    token: string;
    type: string;
  };
}

export async function signIn({
  email,
  password,
}: SignInBody): Promise<{ data: SigninResponse }> {
  return await api.post("/login", { email, password });
}

export async function loggout(): Promise<void> {
  return await api.delete("/logout");
}
