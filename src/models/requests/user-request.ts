export interface UserRequest {
  fullName?: string;
  email: string;
  role: number;
}

export interface UserGridRequst {
  page: number;
  perPage: number;
  searchTerm: string;
}

export interface UpdateRequest {
  fullName?: string;
  email: string;
  document: string;
  role: string;
}

export interface UpdatePasswordRequest {
  password: string;
  oldPassword: string;
}

export interface UserUpdateByCodeRequest {
  fullName?: string;
  email: string;
  document: string;
  password: string;
}
