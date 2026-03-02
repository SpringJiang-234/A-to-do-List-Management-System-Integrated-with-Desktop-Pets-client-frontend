import { http } from "@/utils/http";

type Tag = {
  id: number;
  name: string;
  path: string;
  title: string;
};

type Result = {
  success: boolean;
  data: Tag[];
};

export const getTags = () => {
  return http.request<Result>("get", "/api/tags");
};

export const getMockTags = (): Promise<Result> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
          {
            id: 1,
            name: "important",
            path: "/important",
            title: "重要"
          },
          {
            id: 2,
            name: "urgent",
            path: "/urgent",
            title: "紧急"
          },
          {
            id: 3,
            name: "work",
            path: "/work",
            title: "工作"
          },
          {
            id: 4,
            name: "life",
            path: "/life",
            title: "生活"
          },
          {
            id: 5,
            name: "study",
            path: "/study",
            title: "学习"
          }
        ]
      });
    }, 500);
  });
};
