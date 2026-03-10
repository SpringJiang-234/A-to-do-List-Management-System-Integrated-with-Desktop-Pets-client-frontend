import { http } from "@/utils/http";

type CategoryVO = {
  id: number;
  userId: number;
  name: string;
  isDefault: string;
  sortOrder: number;
};

type CategoryDTO = {
  id?: number;
  userId?: number;
  name: string;
  isDefault?: number;
  sortOrder?: number;
};

type Result<T> = {
  code: number;
  msg: string;
  data: T;
};

type CategoryQuery = {
  userId: number;
};

export const getCategoryList = (userId: number) => {
  return http.request<Result<CategoryVO[]>>("post", "/api/category/list", { data: { userId } });
};

export const insertCategory = (categoryDTO: CategoryDTO) => {
  return http.request<Result<void>>("post", "/api/category/insert", { data: categoryDTO });
};

export const updateCategory = (categoryDTO: CategoryDTO) => {
  return http.request<Result<void>>("post", "/api/category/update", { data: categoryDTO });
};

export const deleteCategory = (id: number) => {
  return http.request<Result<void>>("get", `/api/category/delete/${id}`);
};
