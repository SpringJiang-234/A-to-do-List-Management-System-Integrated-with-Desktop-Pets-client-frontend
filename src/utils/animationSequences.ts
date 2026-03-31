import { AnimationTask, AnimationType, LoopAnimationType } from "../types/animation";

export const createCompleteTodoOnTimeAnimationSequence = (
  goodGifPath: string,
  energeticGifPath: string,
  upgradeGifPath: string,
  teaGifPath: string,
  isEnergetic: boolean,
  isUpgrade: boolean,
  isMoodIncreased: boolean,
  messages: {
    complete: string;
    energetic: string;
    upgrade: string;
    onTimeMore: string;
  }
): AnimationTask[] => {
  const sequence: AnimationTask[] = [];

  sequence.push({
    gifPath: goodGifPath,
    type: AnimationType.ONE_TIME,
    duration: 2000,
    message: messages.complete
  });

  if (isEnergetic) {
    sequence.push({
      gifPath: energeticGifPath,
      type: AnimationType.ONE_TIME,
      duration: 2500,
      message: messages.energetic
    });
  }

  if (isUpgrade) {
    sequence.push({
      gifPath: upgradeGifPath,
      type: AnimationType.UPGRADE,
      message: messages.upgrade
    });
  }

  sequence.push({
    gifPath: "",
    type: AnimationType.LOOP,
    loopType: LoopAnimationType.TEA,
    message: isMoodIncreased ? messages.onTimeMore : undefined
  });

  return sequence;
};

export const createCompleteTodoOverdueAnimationSequence = (
  clapGifPath: string,
  energeticGifPath: string,
  upgradeGifPath: string,
  pointingGifPath: string,
  isEnergetic: boolean,
  isUpgrade: boolean,
  isMoodDecreased: boolean,
  messages: {
    complete: string;
    energetic: string;
    upgrade: string;
    overdue: string;
  }
): AnimationTask[] => {
  const sequence: AnimationTask[] = [];

  sequence.push({
    gifPath: clapGifPath,
    type: AnimationType.ONE_TIME,
    duration: 2000,
    message: messages.complete
  });

  if (isEnergetic) {
    sequence.push({
      gifPath: energeticGifPath,
      type: AnimationType.ONE_TIME,
      duration: 2500,
      message: messages.energetic
    });
  }

  if (isUpgrade) {
    sequence.push({
      gifPath: upgradeGifPath,
      type: AnimationType.UPGRADE,
      message: messages.upgrade
    });
  }

  sequence.push({
    gifPath: "",
    type: AnimationType.LOOP,
    loopType: LoopAnimationType.POINTING,
    message: isMoodDecreased ? messages.overdue : undefined
  });

  return sequence;
};

export const createNewTodoAnimationSequence = (
  goodGifPath: string,
  energeticGifPath: string,
  isEnergetic: boolean,
  isHighMood: boolean,
  messages: {
    newTodo: string;
    energetic: string;
  }
): AnimationTask[] => {
  const sequence: AnimationTask[] = [];

  sequence.push({
    gifPath: goodGifPath,
    type: AnimationType.ONE_TIME,
    duration: 2000,
    message: messages.newTodo
  });

  if (isEnergetic) {
    sequence.push({
      gifPath: energeticGifPath,
      type: AnimationType.ONE_TIME,
      duration: 2500,
      message: messages.energetic
    });
  }

  sequence.push({
    gifPath: "",
    type: AnimationType.LOOP,
    loopType: isHighMood ? LoopAnimationType.TEA : LoopAnimationType.POINTING,
    message: undefined
  });

  return sequence;
};
