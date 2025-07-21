export interface PaginatedResponse<T> {
  data: T[];
  lastPage: number;
  page: number;
  perPage: number;
  total: number;
}
