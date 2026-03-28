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
  previousVitalityValue: number;
  previousMoodValue: number;
  previousLevelValue: number;
}

export const useDesktopPetStore = defineStore("pure-desktop-pet", {
  state: () =>
    ({
      growthValue: 0,
      vitalityValue: 0,
      moodValue: 0,
      intimacyValue: 0,
      levelValue: 1,
      nickname: "",
      previousGrowthValue: 0,
      previousVitalityValue: 0,
      previousMoodValue: 60,
      previousLevelValue: 1
    }) as DesktopPetState,
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
      if (this.levelValue > this.previousLevelValue) {
        this.previousLevelValue = this.levelValue;
        return true;
      }
      return false;
    },
    checkEnergetic() {
      if (this.vitalityValue === 100 && this.previousVitalityValue < 100) {
        this.previousVitalityValue = this.vitalityValue;
        return true;
      }
      return false;
    },
    checkMoodChange() {
      const moodChanged = this.moodValue >= 60 && this.previousMoodValue < 60;
      const moodDecreased = this.moodValue < 60 && this.previousMoodValue >= 60;

      this.previousMoodValue = this.moodValue;

      if (moodChanged) {
        return "increased";
      } else if (moodDecreased) {
        return "decreased";
      }
      return "none";
    },
    checkMoodChangeWithoutUpdate() {
      const moodChanged = this.moodValue >= 60 && this.previousMoodValue < 60;
      const moodDecreased = this.moodValue < 60 && this.previousMoodValue >= 60;

      if (moodChanged) {
        return "increased";
      } else if (moodDecreased) {
        return "decreased";
      }
      return "none";
    },
    getSummonAnimation() {
      return this.intimacyValue >= 60 ? "summon" : "summon2";
    },
    getLoopAnimation() {
      return this.moodValue >= 60 ? "tea" : "pointing";
    },
    updatePreviousValues() {
      this.previousGrowthValue = this.growthValue;
      this.previousVitalityValue = this.vitalityValue;
      this.previousMoodValue = this.moodValue;
      this.previousLevelValue = this.levelValue;
    }
  },
  getters: {
    shouldPlayUpgradeAnimation: state => {
      return state.growthValue >= 100 && state.previousGrowthValue < 100;
    },
    shouldPlayEnergeticAnimation: state => {
      return state.vitalityValue === 100 && state.previousVitalityValue < 100;
    },
    isHighMood: state => {
      return state.moodValue >= 60;
    },
    isHighIntimacy: state => {
      return state.intimacyValue >= 60;
    }
  }
});

export function useDesktopPetStoreHook() {
  return useDesktopPetStore(store);
}
