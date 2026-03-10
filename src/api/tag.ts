import { http } from "@/utils/http";

type TagVO = {
  id: number;
  userId: number;
  name: string;
  color: string;
  sortOrder: number;
};

type TagDTO = {
  id?: number;
  userId?: number;
  name: string;
  color?: string;
  sortOrder?: number;
};

type Result<T> = {
  code: number;
  msg: string;
  data: T;
};

type TagQuery = {
  userId: number;
};

export const getTagList = (userId: number) => {
  return http.request<Result<TagVO[]>>("post", "/api/tag/list", { data: { userId } });
};

export const insertTag = (tagDTO: TagDTO) => {
  return http.request<Result<void>>("post", "/api/tag/insert", { data: tagDTO });
};

export const updateTag = (tagDTO: TagDTO) => {
  return http.request<Result<void>>("post", "/api/tag/update", { data: tagDTO });
};

export const deleteTag = (id: number) => {
  return http.request<Result<void>>("get", `/api/tag/delete/${id}`);
};
