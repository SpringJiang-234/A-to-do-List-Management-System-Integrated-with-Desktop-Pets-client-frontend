import { http } from "@/utils/http";

type CategoryVO = {
  id: number;
  userId: number;
  name: string;
  isDefault: string;
  sortOrder: number;
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
