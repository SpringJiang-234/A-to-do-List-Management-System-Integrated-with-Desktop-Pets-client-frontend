import { http } from "@/utils/http";

export type AnnouncementListResult = {
  code: number;
  msg: string;
  data: Array<{
    id: number;
    title: string;
    content: string;
    updateTime: string;
    isTop: string;
  }>;
};

export type AnnouncementDetailResult = {
  code: number;
  msg: string;
  data: {
    id: number;
    title: string;
    content: string;
    isTop: number;
    createTime: string;
    updateTime: string;
  };
};

/** 获取公告列表 */
export const getAnnouncementList = () => {
  return http.request<AnnouncementListResult>("get", "/api/announcement/list");
};

/** 获取公告详情 */
export const getAnnouncementDetail = (id: number) => {
  return http.request<AnnouncementDetailResult>("get", `/api/announcement/details/${id}`);
};
