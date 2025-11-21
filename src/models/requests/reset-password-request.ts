export interface UpdateUserByCodeRequest {
  fullName: string;
  email: string;
  document: string;
  password: string;
  resetCode: string;
}
