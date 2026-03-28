<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import summonGifPath from "@/assets/images/丰川祥子-召唤.gif";
import summon2GifPath from "@/assets/images/丰川祥子-召唤2.gif";
import teaGifPath from "@/assets/images/丰川祥子-喝茶.gif";
import pointingGifPath from "@/assets/images/丰川祥子-指指点点.gif";
import upgradeGifPath from "@/assets/images/丰川祥子-升级.gif";
import clapGifPath from "@/assets/images/丰川祥子-鼓掌.gif";
import goodGifPath from "@/assets/images/丰川祥子-棒棒.gif";
import abandonGifPath from "@/assets/images/丰川祥子-放弃.gif";
import deleteGifPath from "@/assets/images/丰川祥子-删除.gif";
import intimateGifPath from "@/assets/images/丰川祥子-亲密.gif";
import energeticGifPath from "@/assets/images/丰川祥子-活力满满.gif";
import workGifPath from "@/assets/images/丰川祥子-工作.gif";
import studyGifPath from "@/assets/images/丰川祥子-学习.gif";
import entertainGifPath from "@/assets/images/丰川祥子-娱乐.gif";
import otherGifPath from "@/assets/images/丰川祥子-其他循环.gif";
import sakikoMessages from "@/constants/sakiko-messages.json";
import handIcon from "@/assets/svg/ooui--hand.svg?url";
import { useDesktopPetStoreHook } from "@/store/modules/desktopPet";

defineOptions({
  name: "DesktopPetWindow"
});

const desktopPetStore = useDesktopPetStoreHook();

enum AnimationState {
  SUMMON = "summon",
  LOOP = "loop",
  ONE_TIME = "one_time"
}

enum LoopAnimationType {
  TEA = "tea",
  POINTING = "pointing",
  WORK = "work",
  STUDY = "study",
  ENTERTAIN = "entertain",
  OTHER = "other"
}

const currentGif = ref("");
const isFading = ref(false);
const isUpgrading = ref(false);
const animationState = ref(AnimationState.SUMMON);
const currentLoopAnimation = ref(LoopAnimationType.TEA);
const previousLoopAnimation = ref(LoopAnimationType.TEA);
const isPlayingOneTimeAnimation = ref(false);
const intimacyValue = ref(60);
const hasInitializedSummon = ref(false);

const setSummonAnimation = () => {
  const summonGif = intimacyValue.value >= 60 ? summonGifPath : summon2GifPath;
  if (currentGif.value !== summonGif) {
    currentGif.value = summonGif;
  }
};

const getLoopAnimationGif = (type: LoopAnimationType): string => {
  switch (type) {
    case LoopAnimationType.TEA:
      return teaGifPath;
    case LoopAnimationType.POINTING:
      return pointingGifPath;
    case LoopAnimationType.WORK:
      return workGifPath;
    case LoopAnimationType.STUDY:
      return studyGifPath;
    case LoopAnimationType.ENTERTAIN:
      return entertainGifPath;
    case LoopAnimationType.OTHER:
      return otherGifPath;
    default:
      return teaGifPath;
  }
};

const playAnimation = (gifPath: string, callback?: () => void) => {
  if (isUpgrading.value) {
    isFading.value = true;
    setTimeout(() => {
      currentGif.value = "";
      setTimeout(() => {
        currentGif.value = gifPath;
        setTimeout(() => {
          isFading.value = false;
          if (callback) {
            callback();
          }
        }, 400);
      }, 400);
    }, 400);
  } else {
    currentGif.value = gifPath;
    if (callback) {
      callback();
    }
  }
};

const playOneTimeAnimation = (gifPath: string, callback?: () => void) => {
  if (isPlayingOneTimeAnimation.value) {
    return;
  }

  isPlayingOneTimeAnimation.value = true;
  animationState.value = AnimationState.ONE_TIME;

  playAnimation(gifPath, () => {
    setTimeout(() => {
      isPlayingOneTimeAnimation.value = false;
      animationState.value = AnimationState.LOOP;
      returnToLoopAnimation();
      if (callback) {
        callback();
      }
    }, 2000);
  });
};

const returnToLoopAnimation = () => {
  if (!isPlayingOneTimeAnimation.value && !isUpgrading.value) {
    const loopGif = getLoopAnimationGif(currentLoopAnimation.value);
    currentGif.value = loopGif;
  }
};

const switchLoopAnimation = (newType: LoopAnimationType) => {
  if (currentLoopAnimation.value === newType) {
    return;
  }

  previousLoopAnimation.value = currentLoopAnimation.value;
  currentLoopAnimation.value = newType;

  if (!isPlayingOneTimeAnimation.value && !isUpgrading.value) {
    const loopGif = getLoopAnimationGif(newType);
    playAnimation(loopGif);
  }
};

const playUpgradeAnimation = () => {
  console.log("========== 收到升级动画事件 ==========");
  isUpgrading.value = true;
  isFading.value = true;
  setTimeout(() => {
    currentGif.value = "";
    setTimeout(() => {
      currentGif.value = upgradeGifPath;
      setTimeout(() => {
        isFading.value = false;
        setTimeout(() => {
          isFading.value = true;
          setTimeout(() => {
            const loopGif = getLoopAnimationGif(currentLoopAnimation.value);
            currentGif.value = loopGif;
            setTimeout(() => {
              isFading.value = false;
              isUpgrading.value = false;
            }, 400);
          }, 400);
        }, 2000);
      }, 400);
    }, 400);
  }, 400);
};

const playClapAnimation = () => {
  console.log("========== 收到鼓掌动画事件 ==========");
  playOneTimeAnimation(clapGifPath);
};

const playGoodAnimation = () => {
  console.log("========== 收到棒棒动画事件 ==========");
  playOneTimeAnimation(goodGifPath);
};

const playAbandonAnimation = () => {
  console.log("========== 收到放弃动画事件 ==========");
  playOneTimeAnimation(abandonGifPath);
};

const playDeleteAnimation = () => {
  console.log("========== 收到删除动画事件 ==========");
  playOneTimeAnimation(deleteGifPath);
};

const playIntimateAnimation = () => {
  console.log("========== 收到亲密动画事件 ==========");
  playOneTimeAnimation(intimateGifPath);
};

const playEnergeticAnimation = () => {
  console.log("========== 收到活力满满动画事件 ==========");
  playOneTimeAnimation(energeticGifPath);
};

const playWorkAnimation = () => {
  console.log("========== 收到工作动画事件 ==========");
  switchLoopAnimation(LoopAnimationType.WORK);
};

const playStudyAnimation = () => {
  console.log("========== 收到学习动画事件 ==========");
  switchLoopAnimation(LoopAnimationType.STUDY);
};

const playEntertainAnimation = () => {
  console.log("========== 收到娱乐动画事件 ==========");
  switchLoopAnimation(LoopAnimationType.ENTERTAIN);
};

const playOtherAnimation = () => {
  console.log("========== 收到其他动画事件 ==========");
  switchLoopAnimation(LoopAnimationType.OTHER);
};

const playTeaAnimation = () => {
  console.log("========== 收到喝茶动画事件 ==========");
  switchLoopAnimation(LoopAnimationType.TEA);
};

const playPointingAnimation = () => {
  console.log("========== 收到指指点点动画事件 ==========");
  switchLoopAnimation(LoopAnimationType.POINTING);
};

const handleIntimateClick = () => {
  console.log("========== 左键点击桌宠 ==========");
  playOneTimeAnimation(intimateGifPath);
  (window as any).ipcRenderer.invoke(
    "open-win",
    "pop-up-window",
    sakikoMessages.intimate
  );
};

const setIntimacyValue = (value: number) => {
  intimacyValue.value = value;
};

const setInitialLoopAnimation = (moodValue: number) => {
  currentLoopAnimation.value =
    moodValue >= 60 ? LoopAnimationType.TEA : LoopAnimationType.POINTING;
};

onMounted(() => {
  console.log("========== 桌宠窗口已挂载，注册动画监听器 ==========");
  (window as any).ipcRenderer.on(
    "play-upgrade-animation",
    playUpgradeAnimation
  );
  (window as any).ipcRenderer.on("play-clap-animation", playClapAnimation);
  (window as any).ipcRenderer.on("play-good-animation", playGoodAnimation);
  (window as any).ipcRenderer.on(
    "play-abandon-animation",
    playAbandonAnimation
  );
  (window as any).ipcRenderer.on("play-delete-animation", playDeleteAnimation);
  (window as any).ipcRenderer.on(
    "play-intimate-animation",
    playIntimateAnimation
  );
  (window as any).ipcRenderer.on(
    "play-energetic-animation",
    playEnergeticAnimation
  );
  (window as any).ipcRenderer.on("play-work-animation", playWorkAnimation);
  (window as any).ipcRenderer.on("play-study-animation", playStudyAnimation);
  (window as any).ipcRenderer.on(
    "play-entertain-animation",
    playEntertainAnimation
  );
  (window as any).ipcRenderer.on("play-other-animation", playOtherAnimation);
  (window as any).ipcRenderer.on("play-tea-animation", playTeaAnimation);
  (window as any).ipcRenderer.on(
    "play-pointing-animation",
    playPointingAnimation
  );
  (window as any).ipcRenderer.on(
    "set-upgrading",
    (event, upgrading: boolean) => {
      console.log("========== 设置升级状态 ==========", upgrading);
      isUpgrading.value = upgrading;
    }
  );
  (window as any).ipcRenderer.on(
    "set-intimacy-value",
    (event, value: number) => {
      console.log("========== 设置亲密度值 ==========", value);
      setIntimacyValue(value);
      setSummonAnimation();
    }
  );
  (window as any).ipcRenderer.on(
    "set-initial-loop-animation",
    (event, moodValue: number) => {
      console.log("========== 设置初始循环动画 ==========", moodValue);
      setInitialLoopAnimation(moodValue);
    }
  );

  setTimeout(() => {
    animationState.value = AnimationState.LOOP;
    const loopGif = getLoopAnimationGif(currentLoopAnimation.value);
    currentGif.value = loopGif;
  }, 2000);
});

onUnmounted(() => {
  (window as any).ipcRenderer.removeListener(
    "play-upgrade-animation",
    playUpgradeAnimation
  );
  (window as any).ipcRenderer.removeListener(
    "play-clap-animation",
    playClapAnimation
  );
  (window as any).ipcRenderer.removeListener(
    "play-good-animation",
    playGoodAnimation
  );
  (window as any).ipcRenderer.removeListener(
    "play-abandon-animation",
    playAbandonAnimation
  );
  (window as any).ipcRenderer.removeListener(
    "play-delete-animation",
    playDeleteAnimation
  );
  (window as any).ipcRenderer.removeListener(
    "play-intimate-animation",
    playIntimateAnimation
  );
  (window as any).ipcRenderer.removeListener(
    "play-energetic-animation",
    playEnergeticAnimation
  );
  (window as any).ipcRenderer.removeListener(
    "play-work-animation",
    playWorkAnimation
  );
  (window as any).ipcRenderer.removeListener(
    "play-study-animation",
    playStudyAnimation
  );
  (window as any).ipcRenderer.removeListener(
    "play-entertain-animation",
    playEntertainAnimation
  );
  (window as any).ipcRenderer.removeListener(
    "play-other-animation",
    playOtherAnimation
  );
  (window as any).ipcRenderer.removeListener(
    "play-tea-animation",
    playTeaAnimation
  );
  (window as any).ipcRenderer.removeListener(
    "play-pointing-animation",
    playPointingAnimation
  );
});
</script>

<template>
  <div class="pet-container">
    <div class="gif-container">
      <img
        v-if="currentGif"
        :class="{ fading: isFading }"
        :src="currentGif"
        alt="动画"
        draggable="false"
      />
      <div class="hand-icon" @click="handleIntimateClick">
        <img :src="handIcon" alt="亲密互动" draggable="false" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.pet-container {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  background-color: transparent;
  overflow: hidden;
}

.gif-container {
  position: relative;
  -webkit-app-region: drag;
  user-select: none;
}

.gif-container img {
  width: 100px;
  height: 100px;
  display: block;
  transition: opacity 0.4s ease;
}

.gif-container img.fading {
  opacity: 0;
}

.hand-icon {
  position: absolute;
  bottom: -5px;
  right: -5px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  z-index: 10;
  -webkit-app-region: no-drag;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  padding: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.hand-icon img {
  width: 100%;
  height: 100%;
  display: block;
  filter: brightness(0.5);
}

.hand-icon:hover {
  opacity: 0.9;
  background-color: rgba(255, 255, 255, 1);
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
  border: 0;
  box-sizing: border-box;
}

body,
html {
  margin: 0;
  padding: 0;
  border: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
</style>
