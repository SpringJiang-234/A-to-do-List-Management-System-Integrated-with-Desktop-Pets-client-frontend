import { http } from "@/utils/http";

type ClientTodoVO = {
  id: number;
  userId: number;
  title: string;
  content: string;
  startTime: string;
  endTime: string;
  status: number;
  isTop: number;
};

type TagDetails = {
  id: number;
  userId: number;
  name: string;
  color: string;
  sortOrder: number;
};

type ClientTodoDetails = {
  id: number;
  userId: number;
  title: string;
  content: string;
  startTime: string;
  endTime: string;
  status: string;
  isTop: string;
  categoryName: string;
  tags: TagDetails[];
};

type PageBean<T> = {
  pageNum: number;
  pageSize: number;
  pages: number;
  total: number;
  records: T[];
};

type ClientTodoQuery = {
  pageNum?: number;
  pageSize?: number;
  userId?: number;
  title?: string;
  categoryId?: number;
  priority?: number;
  status?: number;
  isTop?: number;
  tagIdList?: number[];
};

type ClientTodoDTO = {
  id?: number;
  userId: number;
  title: string;
  content?: string;
  categoryId?: number;
  priority?: number;
  startTime?: string;
  endTime?: string;
  status?: number;
  finishTime?: string;
  isDelete?: number;
  isTop?: number;
  tagIdList?: number[];
};

type Result<T> = {
  code: number;
  msg: string;
  data: T;
};

export const getTodoList = (params: ClientTodoQuery) => {
  return http.request<Result<ClientTodoVO[]>>("post", "/api/todo/list", { data: params });
};

export const getTodoDetails = (id: number) => {
  return http.request<Result<ClientTodoDetails>>("get", `/api/todo/details/${id}`);
};

export const insertTodo = (data: ClientTodoDTO) => {
  return http.request<Result<void>>("post", "/api/todo/insert", { data });
};