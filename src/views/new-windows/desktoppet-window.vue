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
import { AnimationType, LoopAnimationType, AnimationTask } from "@/types/animation";
import {
  createCompleteTodoOnTimeAnimationSequence,
  createCompleteTodoOverdueAnimationSequence,
  createNewTodoAnimationSequence
} from "@/utils/animationSequences";

defineOptions({
  name: "DesktopPetWindow"
});

const desktopPetStore = useDesktopPetStoreHook();

enum AnimationState {
  SUMMON = "summon",
  LOOP = "loop",
  ONE_TIME = "one_time"
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

const animationQueue = ref<AnimationTask[]>([]);
const isQueueProcessing = ref(false);

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

const addToQueue = (task: AnimationTask, clearQueue: boolean = true) => {
  if (clearQueue && animationQueue.value.length > 0) {
    console.log("========== 清空动画队列 ==========", {
      previousQueueLength: animationQueue.value.length
    });
    animationQueue.value = [];
  }
  
  animationQueue.value.push(task);
  if (!isQueueProcessing.value) {
    processQueue();
  }
};

const processQueue = async () => {
  if (isQueueProcessing.value || animationQueue.value.length === 0) {
    return;
  }

  isQueueProcessing.value = true;

  console.log("========== 开始处理动画队列 ==========", {
    queueLength: animationQueue.value.length,
    currentState: animationState.value,
    currentLoopAnimation: currentLoopAnimation.value
  });

  while (animationQueue.value.length > 0) {
    const task = animationQueue.value.shift();
    if (!task) break;

    console.log("========== 执行动画任务 ==========", {
      type: task.type,
      hasMessage: !!task.message,
      loopType: task.loopType,
      duration: task.duration
    });
    
    await playAnimationTask(task);
    
    console.log("========== 动画任务完成 ==========", {
      remainingQueue: animationQueue.value.length,
      currentState: animationState.value
    });
  }

  console.log("========== 动画队列处理完成 ==========", {
    finalState: animationState.value,
    finalLoopAnimation: currentLoopAnimation.value
  });
  
  ensureFinalLoopState();
  isQueueProcessing.value = false;
};

const playAnimationTask = (task: AnimationTask): Promise<void> => {
  return new Promise(resolve => {
    const duration = task.duration || 2000;

    if (task.type === AnimationType.UPGRADE) {
      playUpgradeAnimationInternal(resolve, task.message);
    } else if (task.type === AnimationType.LOOP) {
      if (task.loopType) {
        setCurrentLoopAnimation(task.loopType);
      }
      const loopGif = getLoopAnimationGif(currentLoopAnimation.value);
      playAnimation(loopGif, () => {
        animationState.value = AnimationState.LOOP;
        if (task.message) {
          setTimeout(() => {
            showPopupMessage(task.message, 2000);
          }, 500);
        }
        if (task.callback) task.callback();
        resolve();
      });
    } else {
      playOneTimeAnimationInternal(task.gifPath, duration, () => {
        if (task.callback) task.callback();
        resolve();
      }, task.message);
    }
  });
};

const showPopupMessage = (message: string, duration: number = 3000) => {
  console.log("========== 显示弹窗消息 ==========", {
    message,
    duration,
    timestamp: new Date().toISOString()
  });
  (window as any).ipcRenderer.invoke(
    "open-win",
    "pop-up-window",
    message,
    duration
  );
};

const playOneTimeAnimationInternal = (
  gifPath: string,
  duration: number,
  callback: () => void,
  message?: string
) => {
  isPlayingOneTimeAnimation.value = true;
  animationState.value = AnimationState.ONE_TIME;

  playAnimation(gifPath, () => {
    if (message) {
      setTimeout(() => {
        showPopupMessage(message, duration);
      }, 200);
    }
    setTimeout(() => {
      isPlayingOneTimeAnimation.value = false;
      ensureLoopState();
      returnToLoopAnimation();
      callback();
      ensureFinalLoopState();
    }, duration);
  });
};

const playUpgradeAnimationInternal = (callback: () => void, message?: string) => {
  isUpgrading.value = true;
  animationState.value = AnimationState.ONE_TIME;
  isFading.value = true;
  setTimeout(() => {
    currentGif.value = "";
    setTimeout(() => {
      currentGif.value = upgradeGifPath;
      setTimeout(() => {
        isFading.value = false;
        if (message) {
          setTimeout(() => {
            showPopupMessage(message, 2000);
          }, 500);
        }
        setTimeout(() => {
          isFading.value = true;
          setTimeout(() => {
            const loopGif = getLoopAnimationGif(currentLoopAnimation.value);
            currentGif.value = loopGif;
            setTimeout(() => {
              isFading.value = false;
              isUpgrading.value = false;
              animationState.value = AnimationState.LOOP;
              callback();
              ensureFinalLoopState();
            }, 400);
          }, 400);
        }, 2000);
      }, 400);
    }, 400);
  }, 400);
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

const playOneTimeAnimation = (gifPath: string, duration?: number) => {
  addToQueue({
    gifPath,
    type: AnimationType.ONE_TIME,
    duration
  }, false);
};

const returnToLoopAnimation = () => {
  if (!isPlayingOneTimeAnimation.value && !isUpgrading.value) {
    animationState.value = AnimationState.LOOP;
    const loopGif = getLoopAnimationGif(currentLoopAnimation.value);
    currentGif.value = loopGif;
  }
};

const ensureLoopState = () => {
  if (!isPlayingOneTimeAnimation.value && !isUpgrading.value && animationState.value !== AnimationState.LOOP) {
    animationState.value = AnimationState.LOOP;
    console.log("========== 确保循环状态 ==========", {
      wasState: animationState.value,
      newState: AnimationState.LOOP,
      currentLoopAnimation: currentLoopAnimation.value
    });
  }
};

const ensureFinalLoopState = () => {
  setTimeout(() => {
    if (!isPlayingOneTimeAnimation.value && !isUpgrading.value && !isQueueProcessing.value) {
      animationState.value = AnimationState.LOOP;
      const loopGif = getLoopAnimationGif(currentLoopAnimation.value);
      if (currentGif.value !== loopGif) {
        currentGif.value = loopGif;
        console.log("========== 确保最终循环动画 ==========", {
          wasGif: currentGif.value,
          newGif: loopGif,
          loopType: currentLoopAnimation.value
        });
      }
    }
  }, 100);
};

const getCurrentLoopAnimation = () => {
  return currentLoopAnimation.value;
};

const setCurrentLoopAnimation = (type: LoopAnimationType) => {
  previousLoopAnimation.value = currentLoopAnimation.value;
  currentLoopAnimation.value = type;
};

const switchLoopAnimation = (newType: LoopAnimationType) => {
  if (currentLoopAnimation.value === newType) {
    return;
  }

  setCurrentLoopAnimation(newType);

  addToQueue({
    gifPath: "",
    type: AnimationType.LOOP,
    loopType: newType
  });
};

const playUpgradeAnimation = () => {
  console.log("========== 收到升级动画事件 ==========");
  addToQueue({
    gifPath: upgradeGifPath,
    type: AnimationType.UPGRADE
  });
};

const playClapAnimation = () => {
  console.log("========== 收到鼓掌动画事件 ==========");
  playOneTimeAnimation(clapGifPath);
};

const playGoodAnimation = () => {
  console.log("========== 收到棒棒动画事件 ==========");
  playOneTimeAnimation(goodGifPath);
};

const playAbandonAnimation = (message?: string) => {
  console.log("========== 收到放弃动画事件 ==========");
  addToQueue({
    gifPath: abandonGifPath,
    type: AnimationType.ONE_TIME,
    message
  }, false);
};

const playDeleteAnimation = (message?: string) => {
  console.log("========== 收到删除动画事件 ==========");
  addToQueue({
    gifPath: deleteGifPath,
    type: AnimationType.ONE_TIME,
    message
  });
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

const playCompleteTodoOnTimeAnimation = (
  isEnergetic: boolean,
  isUpgrade: boolean,
  isMoodIncreased: boolean,
  messages: {
    complete: string;
    energetic: string;
    upgrade: string;
    onTimeMore: string;
  }
) => {
  console.log("========== 收到完成待办按时动画事件 ==========", {
    isEnergetic,
    isUpgrade,
    isMoodIncreased,
    messagesPreview: {
      complete: messages.complete.substring(0, 20),
      energetic: messages.energetic.substring(0, 20),
      upgrade: messages.upgrade.substring(0, 20),
      onTimeMore: messages.onTimeMore.substring(0, 20)
    }
  });
  
  const sequence = createCompleteTodoOnTimeAnimationSequence(
    goodGifPath,
    energeticGifPath,
    upgradeGifPath,
    teaGifPath,
    isEnergetic,
    isUpgrade,
    isMoodIncreased,
    messages
  );
  
  sequence.forEach(task => addToQueue(task));
};

const playCompleteTodoOverdueAnimation = (
  isEnergetic: boolean,
  isUpgrade: boolean,
  isMoodDecreased: boolean,
  messages: {
    complete: string;
    energetic: string;
    upgrade: string;
    overdue: string;
  }
) => {
  console.log("========== 收到完成待办逾期动画事件 ==========", {
    isEnergetic,
    isUpgrade,
    isMoodDecreased,
    messagesPreview: {
      complete: messages.complete.substring(0, 20),
      energetic: messages.energetic.substring(0, 20),
      upgrade: messages.upgrade.substring(0, 20),
      overdue: messages.overdue.substring(0, 20)
    }
  });
  
  const sequence = createCompleteTodoOverdueAnimationSequence(
    clapGifPath,
    energeticGifPath,
    upgradeGifPath,
    pointingGifPath,
    isEnergetic,
    isUpgrade,
    isMoodDecreased,
    messages
  );
  
  sequence.forEach(task => addToQueue(task));
};

const playNewTodoAnimation = (
  isEnergetic: boolean,
  isHighMood: boolean,
  messages: {
    newTodo: string;
    energetic: string;
  }
) => {
  console.log("========== 收到新建待办动画事件 ==========", {
    isEnergetic,
    isHighMood,
    messagesPreview: {
      newTodo: messages.newTodo.substring(0, 20),
      energetic: messages.energetic.substring(0, 20)
    }
  });
  
  const sequence = createNewTodoAnimationSequence(
    goodGifPath,
    energeticGifPath,
    isEnergetic,
    isHighMood,
    messages
  );
  
  sequence.forEach(task => addToQueue(task));
};

const handleIntimateClick = () => {
  console.log("========== 左键点击桌宠 ==========");
  addToQueue({
    gifPath: intimateGifPath,
    type: AnimationType.ONE_TIME,
    duration: 2000,
    message: sakikoMessages.intimate
  });
};

const setIntimacyValue = (value: number) => {
  intimacyValue.value = value;
};

const setInitialLoopAnimation = (moodValue: number) => {
  const newLoopType = moodValue >= 60 ? LoopAnimationType.TEA : LoopAnimationType.POINTING;
  setCurrentLoopAnimation(newLoopType);
  console.log("========== 设置初始循环动画 ==========", {
    moodValue,
    loopType: newLoopType,
    animationState: animationState.value
  });
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
    (event, message?: string) => {
      playAbandonAnimation(message);
    }
  );
  (window as any).ipcRenderer.on(
    "play-delete-animation",
    (event, message?: string) => {
      playDeleteAnimation(message);
    }
  );
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
    "play-complete-todo-on-time-animation",
    (
      event,
      isEnergetic: boolean,
      isUpgrade: boolean,
      isMoodIncreased: boolean,
      messages: {
        complete: string;
        energetic: string;
        upgrade: string;
        onTimeMore: string;
      }
    ) => {
      playCompleteTodoOnTimeAnimation(
        isEnergetic,
        isUpgrade,
        isMoodIncreased,
        messages
      );
    }
  );
  (window as any).ipcRenderer.on(
    "play-complete-todo-overdue-animation",
    (
      event,
      isEnergetic: boolean,
      isUpgrade: boolean,
      isMoodDecreased: boolean,
      messages: {
        complete: string;
        energetic: string;
        upgrade: string;
        overdue: string;
      }
    ) => {
      playCompleteTodoOverdueAnimation(
        isEnergetic,
        isUpgrade,
        isMoodDecreased,
        messages
      );
    }
  );
  (window as any).ipcRenderer.on(
    "play-new-todo-animation",
    (
      event,
      isEnergetic: boolean,
      isHighMood: boolean,
      messages: {
        newTodo: string;
        energetic: string;
      }
    ) => {
      playNewTodoAnimation(isEnergetic, isHighMood, messages);
    }
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
  (window as any).ipcRenderer.removeListener(
    "play-complete-todo-on-time-animation",
    playCompleteTodoOnTimeAnimation
  );
  (window as any).ipcRenderer.removeListener(
    "play-complete-todo-overdue-animation",
    playCompleteTodoOverdueAnimation
  );
  (window as any).ipcRenderer.removeListener(
    "play-new-todo-animation",
    playNewTodoAnimation
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
