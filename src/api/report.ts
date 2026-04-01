import { http } from "@/utils/http";

type Result<T> = {
  code: number;
  msg: string;
  data: T;
};

type CategoryCount = {
  categoryId: number;
  categoryName: string;
  sum: number;
};

type CategoryDateCount = {
  categoryId: number;
  categoryName: string;
  date: string;
  sum: number;
};

type ReportQuery = {
  startDate: string;
  endDate: string;
  categoryIdList: number[];
};

export const getTodoCountByCategory = (params: ReportQuery) => {
  return http.request<Result<CategoryCount[]>>("post", "/client/statistics/todo-count-by-category", {
    data: params
  });
};

export const getTodoCountByCategoryAndDate = (params: ReportQuery) => {
  return http.request<Result<CategoryDateCount[]>>("post", "/client/statistics/todo-count-by-category-and-date", {
    data: params
  });
};
