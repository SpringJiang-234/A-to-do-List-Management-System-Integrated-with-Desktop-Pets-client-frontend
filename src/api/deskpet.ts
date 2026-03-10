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
  return http.request<UpdateDesktopPetResult>("post", "/api/desktopPet/update", { data });
};
