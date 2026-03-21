import { defineStore } from "pinia";
import { store } from "../utils";
import { getDesktopPetInfo } from "@/api/deskpet";

export interface DesktopPetState {
  growthValue: number;
  vitalityValue: number;
  moodValue: number;
  intimacyValue: number;
  levelValue: number;
  nickname: string;
  previousGrowthValue: number;
}

export const useDesktopPetStore = defineStore("pure-desktop-pet", {
  state: () => ({
    growthValue: 0,
    vitalityValue: 0,
    moodValue: 0,
    intimacyValue: 0,
    levelValue: 1,
    nickname: "",
    previousGrowthValue: 0
  } as DesktopPetState),
  actions: {
    async loadDesktopPetInfo() {
      try {
        const result = await getDesktopPetInfo();
        if (result.code === 200 && result.data) {
          this.growthValue = result.data.exp || 0;
          this.vitalityValue = result.data.energy || 0;
          this.moodValue = result.data.mood || 0;
          this.intimacyValue = result.data.intimacy || 0;
          this.levelValue = result.data.level || 1;
          this.nickname = result.data.nickname || "";
        }
      } catch (error) {
        console.error("获取桌宠信息失败:", error);
      }
    },
    checkUpgrade() {
      if (this.growthValue >= 100 && this.previousGrowthValue < 100) {
        this.previousGrowthValue = this.growthValue;
        return true;
      }
      return false;
    }
  },
  getters: {
    shouldPlayUpgradeAnimation: (state) => {
      return state.growthValue >= 100 && state.previousGrowthValue < 100;
    }
  }
});

export function useDesktopPetStoreHook() {
  return useDesktopPetStore(store);
}
