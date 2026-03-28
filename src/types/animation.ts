export enum AnimationType {
  ONE_TIME = "one_time",
  LOOP = "loop",
  UPGRADE = "upgrade"
}

export enum LoopAnimationType {
  TEA = "tea",
  POINTING = "pointing",
  WORK = "work",
  STUDY = "study",
  ENTERTAIN = "entertain",
  OTHER = "other"
}

export interface AnimationTask {
  gifPath: string;
  type: AnimationType;
  loopType?: LoopAnimationType;
  duration?: number;
  callback?: () => void;
  message?: string;
}
