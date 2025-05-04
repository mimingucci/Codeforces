// Base response wrapper
export interface BaseResponse<T> {
  code: string;
  message: string;
  data: T;
}

export interface PageableResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  pageSize: number;
  pageNumber: number;
  isLast: boolean;
  isFirst: boolean;
}
