import { http } from "@/utils/http";

export type DesktopPetResult = {
  code: number;
  msg: string;
  data: {
    id: number;
    userId: number;
    nickname: string;
    energy: number;
    mood: number;
    intimacy: number;
    exp: number;
    level: number;
    createTime: string;
    updateTime: string;
  } | null;
};

export type UpdateDesktopPetResult = {
  code: number;
  msg: string;
  data: null;
};

export type DesktopPetDTO = {
  nickname?: string;
  energy?: number;
  mood?: number;
  intimacy?: number;
  exp?: number;
  level?: number;
};

export const getDesktopPetInfo = () => {
  return http.request<DesktopPetResult>("get", "/api/desktopPet/info");
};

export const updateDesktopPet = (data?: DesktopPetDTO) => {
  return http.request<UpdateDesktopPetResult>(
    "post",
    "/api/desktopPet/update",
    { data }
  );
};

export type ClientTodoVO = {
  id: number;
  userId: number;
  title: string;
  content: string;
  startDate: string;
  endDate: string;
  status: number;
  isTop: number;
  priority: number;
};

export type ClientTodoQuery = {
  pageNum?: number;
  pageSize?: number;
  userId?: number;
  title?: string;
  categoryId?: number;
  priority?: number;
  status?: number;
  isTop?: number;
  tagIdList?: number[];
  tagId?: number;
};

export type Result<T> = {
  code: number;
  msg: string;
  data: T;
};

export const getTodoListTodayEnd = (params: ClientTodoQuery) => {
  return http.request<Result<ClientTodoVO[]>>("post", "/api/todo/list-today-end", {
    data: params
  });
};
