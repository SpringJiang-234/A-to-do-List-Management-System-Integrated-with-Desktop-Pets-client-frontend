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

type DateCount = {
  date: string;
  sum: number;
};

type ReportQuery = {
  startDate: string;
  endDate: string;
  categoryIdList: number[];
};

export const getTodoCountByCategory = (params: ReportQuery) => {
  return http.request<Result<CategoryCount[]>>("post", "/api/statistics/todo-count-by-category", {
    data: params
  });
};

export const getTodoCountByCategoryAndDate = (params: ReportQuery) => {
  return http.request<Result<CategoryDateCount[]>>("post", "/api/statistics/todo-count-by-category-and-date", {
    data: params
  });
};

export const getTodoCountByDate = (params: ReportQuery) => {
  return http.request<Result<DateCount[]>>("post", "/api/statistics/todo-count-by-date", {
    data: params
  });
};
