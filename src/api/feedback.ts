import { http } from "@/utils/http";

export type FeedbackListResult = {
  code: number;
  msg: string;
  data: Array<{
    id: number;
    userId: number;
    title: string;
    content: string;
    status: string;
    createTime: string;
    updateTime: string;
  }>;
};

export type FeedbackDetailResult = {
  code: number;
  msg: string;
  data: {
    id: number;
    userId: number;
    title: string;
    content: string;
    status: number;
    replyContent: string;
    createTime: string;
    updateTime: string;
  };
};

export type SubmitFeedbackResult = {
  code: number;
  msg: string;
  data: null;
};

/** 获取我的反馈列表 */
export const getMyFeedbacks = () => {
  return http.request<FeedbackListResult>("post", "/api/feedback/myFeedbacks");
};

/** 获取反馈详情 */
export const getFeedbackDetail = (id: number) => {
  return http.request<FeedbackDetailResult>("get", `/api/feedback/details/${id}`);
};

/** 提交反馈 */
export const submitFeedback = (data: { title: string; content: string }) => {
  return http.request<SubmitFeedbackResult>("post", "/api/feedback/submit", { data });
};
