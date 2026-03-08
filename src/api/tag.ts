import { http } from "@/utils/http";

type TagVO = {
  id: number;
  userId: number;
  name: string;
  color: string;
  sortOrder: number;
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
