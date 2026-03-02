import { http } from "@/utils/http";

type Category = {
  id: number;
  name: string;
  path: string;
  title: string;
};

type Result = {
  success: boolean;
  data: Category[];
};

export const getCategories = () => {
  return http.request<Result>("get", "/api/categories");
};

export const getMockCategories = (): Promise<Result> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        success: true,
        data: [
          {
            id: 1,
            name: "fighting",
            path: "/fighting",
            title: "加油"
          },
          {
            id: 2,
            name: "study",
            path: "/study",
            title: "学习"
          },
          {
            id: 3,
            name: "work",
            path: "/work",
            title: "工作"
          },
          {
            id: 4,
            name: "exercise",
            path: "/exercise",
            title: "运动"
          },
          {
            id: 5,
            name: "reading",
            path: "/reading",
            title: "阅读"
          }
        ]
      });
    }, 500);
  });
};
