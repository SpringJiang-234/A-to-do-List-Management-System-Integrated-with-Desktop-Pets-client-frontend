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
    message: messages.complete
  });

  if (isEnergetic) {
    sequence.push({
      gifPath: energeticGifPath,
      type: AnimationType.ONE_TIME,
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

  if (isMoodIncreased) {
    sequence.push({
      gifPath: "",
      type: AnimationType.LOOP,
      loopType: LoopAnimationType.TEA,
      message: messages.onTimeMore
    });
  }

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
    message: messages.complete
  });

  if (isEnergetic) {
    sequence.push({
      gifPath: energeticGifPath,
      type: AnimationType.ONE_TIME,
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

  if (isMoodDecreased) {
    sequence.push({
      gifPath: "",
      type: AnimationType.LOOP,
      loopType: LoopAnimationType.POINTING,
      message: messages.overdue
    });
  }

  return sequence;
};

export const createNewTodoAnimationSequence = (
  goodGifPath: string,
  energeticGifPath: string,
  isEnergetic: boolean,
  messages: {
    newTodo: string;
    energetic: string;
  }
): AnimationTask[] => {
  const sequence: AnimationTask[] = [];

  sequence.push({
    gifPath: goodGifPath,
    type: AnimationType.ONE_TIME,
    message: messages.newTodo
  });

  if (isEnergetic) {
    sequence.push({
      gifPath: energeticGifPath,
      type: AnimationType.ONE_TIME,
      message: messages.energetic
    });
  }

  return sequence;
};
