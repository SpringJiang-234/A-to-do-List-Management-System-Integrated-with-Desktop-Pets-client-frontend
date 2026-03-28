import { AnimationTask, AnimationType, LoopAnimationType } from "../types/animation";

export const createCompleteTodoOnTimeAnimationSequence = (
  goodGifPath: string,
  energeticGifPath: string,
  upgradeGifPath: string,
  teaGifPath: string,
  isEnergetic: boolean,
  isUpgrade: boolean,
  isMoodIncreased: boolean
): AnimationTask[] => {
  const sequence: AnimationTask[] = [];

  sequence.push({
    gifPath: goodGifPath,
    type: AnimationType.ONE_TIME
  });

  if (isEnergetic) {
    sequence.push({
      gifPath: energeticGifPath,
      type: AnimationType.ONE_TIME
    });
  }

  if (isUpgrade) {
    sequence.push({
      gifPath: upgradeGifPath,
      type: AnimationType.UPGRADE
    });
  }

  if (isMoodIncreased) {
    sequence.push({
      gifPath: "",
      type: AnimationType.LOOP,
      loopType: LoopAnimationType.TEA
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
  isMoodDecreased: boolean
): AnimationTask[] => {
  const sequence: AnimationTask[] = [];

  sequence.push({
    gifPath: clapGifPath,
    type: AnimationType.ONE_TIME
  });

  if (isEnergetic) {
    sequence.push({
      gifPath: energeticGifPath,
      type: AnimationType.ONE_TIME
    });
  }

  if (isUpgrade) {
    sequence.push({
      gifPath: upgradeGifPath,
      type: AnimationType.UPGRADE
    });
  }

  if (isMoodDecreased) {
    sequence.push({
      gifPath: "",
      type: AnimationType.LOOP,
      loopType: LoopAnimationType.POINTING
    });
  }

  return sequence;
};

export const createNewTodoAnimationSequence = (
  goodGifPath: string,
  energeticGifPath: string,
  isEnergetic: boolean
): AnimationTask[] => {
  const sequence: AnimationTask[] = [];

  sequence.push({
    gifPath: goodGifPath,
    type: AnimationType.ONE_TIME
  });

  if (isEnergetic) {
    sequence.push({
      gifPath: energeticGifPath,
      type: AnimationType.ONE_TIME
    });
  }

  return sequence;
};
