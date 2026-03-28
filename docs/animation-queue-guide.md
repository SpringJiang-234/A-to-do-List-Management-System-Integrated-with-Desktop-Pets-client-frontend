# 桌宠动画队列系统使用指南

## 概述

桌宠动画队列系统解决了多个动画同时播放时的冲突问题，确保动画按顺序依次播放。同时，系统支持对话与动画的同步显示，确保每个动画播放时都会显示对应的对话内容。

## 核心功能

### 1. 动画队列管理器

动画队列系统会自动管理动画的播放顺序，当多个动画被触发时，它们会被添加到队列中并依次播放。

### 2. 动画与对话同步

系统支持在动画播放时同步显示对话内容，每个动画任务可以携带对应的对话消息，确保动画和对话完美匹配。

### 3. 动画类型

- **ONE_TIME**: 一次性动画，播放完成后自动返回循环动画
- **LOOP**: 循环动画，持续播放直到被新的循环动画替换
- **UPGRADE**: 升级动画，带有特殊的淡入淡出效果

### 4. 预定义动画序列

系统提供了预定义的动画序列，用于常见的操作场景：

#### 完成待办按时动画序列
```
1. 棒棒动画 + 对话 (必须)
2. 活力满满动画 + 对话 (如果活力值达到100)
3. 升级动画 + 对话 (如果成长值满)
4. 切换到喝茶循环动画 + 对话 (如果心情值从<60变为>=60)
```

#### 完成待办逾期动画序列
```
1. 鼓掌动画 + 对话 (必须)
2. 活力满满动画 + 对话 (如果活力值达到100)
3. 升级动画 + 对话 (如果成长值满)
4. 切换到指指点点循环动画 + 对话 (如果心情值从>=60变为<60)
```

#### 新建待办动画序列
```
1. 棒棒动画 + 对话 (必须)
2. 活力满满动画 + 对话 (如果活力值达到100)
```

## 使用方法

### 基础使用

#### 播放单个动画（带对话）

```typescript
// 播放一次性动画，带对话
playOneTimeAnimation(intimateGifPath, "对话内容");

// 播放循环动画
switchLoopAnimation(LoopAnimationType.TEA);

// 播放升级动画
playUpgradeAnimation();
```

#### 播放动画序列（带对话）

```typescript
// 完成待办按时：棒棒 → 活力满满(可选) → 升级(可选) → 切换循环动画(可选)
playCompleteTodoOnTimeAnimation(
  isEnergetic: boolean,    // 活力值是否达到100
  isUpgrade: boolean,      // 是否升级
  isMoodIncreased: boolean, // 心情值是否从<60变为>=60
  {
    complete: "完成待办的对话",
    energetic: "活力满满的对话",
    upgrade: "升级的对话",
    onTimeMore: "按时完成更多的对话"
  }
);

// 完成待办逾期：鼓掌 → 活力满满(可选) → 升级(可选) → 切换循环动画(可选)
playCompleteTodoOverdueAnimation(
  isEnergetic: boolean,     // 活力值是否达到100
  isUpgrade: boolean,       // 是否升级
  isMoodDecreased: boolean, // 心情值是否从>=60变为<60
  {
    complete: "完成待办的对话",
    energetic: "活力满满的对话",
    upgrade: "升级的对话",
    overdue: "逾期的对话"
  }
);

// 新建待办：棒棒 → 活力满满(可选)
playNewTodoAnimation(
  isEnergetic: boolean,      // 活力值是否达到100
  {
    newTodo: "新建待办的对话",
    energetic: "活力满满的对话"
  }
);
```

### IPC 事件调用

在 Electron 主进程中，可以通过 IPC 事件触发动画：

```typescript
// 播放单个动画（带对话）
ipcRenderer.send('play-abandon-animation', "放弃待办的对话");
ipcRenderer.send('play-delete-animation', "删除待办的对话");

// 播放动画序列（带对话）
ipcRenderer.send('play-complete-todo-on-time-animation', true, false, true, {
  complete: "完成待办的对话",
  energetic: "活力满满的对话",
  upgrade: "升级的对话",
  onTimeMore: "按时完成更多的对话"
});
ipcRenderer.send('play-complete-todo-overdue-animation', true, true, false, {
  complete: "完成待办的对话",
  energetic: "活力满满的对话",
  upgrade: "升级的对话",
  overdue: "逾期的对话"
});
ipcRenderer.send('play-new-todo-animation', false, {
  newTodo: "新建待办的对话",
  energetic: "活力满满的对话"
});
```

## 工作原理

### 动画队列流程

1. **添加动画到队列**: 当动画被触发时，会被添加到队列中
2. **处理队列**: 如果队列正在处理，新动画会等待；如果队列空闲，立即开始处理
3. **播放动画**: 按照队列顺序依次播放每个动画
4. **显示对话**: 在播放动画时，同步显示对应的对话内容
5. **完成回调**: 每个动画播放完成后，执行回调函数（如果有）
6. **继续下一个**: 继续播放队列中的下一个动画，直到队列为空

### 对话同步机制

- 每个动画任务可以携带一个 `message` 属性
- 当动画开始播放时，系统会自动显示对应的对话
- 对话窗口会在3秒后自动关闭
- 对话显示与动画播放完全同步，确保用户体验一致

### 状态管理

- `isQueueProcessing`: 标记队列是否正在处理
- `animationQueue`: 存储待播放的动画任务
- `isPlayingOneTimeAnimation`: 标记是否正在播放一次性动画
- `isUpgrading`: 标记是否正在播放升级动画

## 自定义动画序列

如果需要创建自定义的动画序列，可以使用 `addToQueue` 方法：

```typescript
const customSequence = [
  {
    gifPath: goodGifPath,
    type: AnimationType.ONE_TIME,
    message: "第一个动画的对话"
  },
  {
    gifPath: energeticGifPath,
    type: AnimationType.ONE_TIME,
    duration: 3000,
    message: "第二个动画的对话"
  },
  {
    gifPath: "",
    type: AnimationType.LOOP,
    loopType: LoopAnimationType.TEA,
    message: "切换循环动画的对话"
  }
];

customSequence.forEach(task => addToQueue(task));
```

## 注意事项

1. **动画顺序**: 动画严格按照队列顺序播放，后触发的动画会等待前面的动画完成
2. **循环动画**: 循环动画会持续播放，直到被新的循环动画替换
3. **回调函数**: 可以为动画添加回调函数，在动画完成后执行
4. **状态变量**: 系统会自动管理状态变量，无需手动设置
5. **对话同步**: 对话会在动画开始播放时自动显示，无需手动调用 IPC
6. **对话时长**: 对话窗口默认显示3秒后自动关闭

## 示例场景

### 场景1: 完成待办并触发多个动画和对话

```typescript
// 用户完成待办，触发以下动画序列：
// 1. 棒棒动画 (2秒) + "做得不错"
// 2. 活力满满动画 (2秒) + "今天状态很好" - 因为活力值达到100
// 3. 升级动画 (3秒) + "恭喜升级" - 因为成长值满
// 4. 切换到喝茶循环动画 + "继续保持" - 因为心情值从50变为70

playCompleteTodoOnTimeAnimation(true, true, true, {
  complete: "做得不错",
  energetic: "今天状态很好",
  upgrade: "恭喜升级",
  onTimeMore: "继续保持"
});
```

### 场景2: 快速连续操作

```typescript
// 用户快速完成多个待办，每个待办都会触发动画序列
// 动画会按顺序依次播放，不会冲突
// 对话也会同步显示，不会错乱

playCompleteTodoOnTimeAnimation(false, false, false, {
  complete: "做得不错",
  energetic: "今天状态很好",
  upgrade: "恭喜升级",
  onTimeMore: "继续保持"
});
playCompleteTodoOnTimeAnimation(true, false, true, {
  complete: "按时完成",
  energetic: "充满活力",
  upgrade: "又升级了",
  onTimeMore: "再接再厉"
});
playNewTodoAnimation(false, {
  newTodo: "新任务",
  energetic: "活力满满"
});
```

## 技术实现

动画队列系统使用以下技术：

- **Vue 3 Composition API**: 使用 ref 和响应式状态管理
- **TypeScript**: 类型安全的动画任务定义
- **Promise**: 异步动画播放控制
- **IPC**: Electron 进程间通信
- **队列管理**: 确保动画按顺序播放
- **消息同步**: 自动处理对话显示时机

## 文件结构

```
client-frontend/
├── src/
│   ├── types/
│   │   └── animation.ts              # 动画类型定义
│   ├── utils/
│   │   └── animationSequences.ts     # 动画序列工具函数
│   ├── views/
│   │   ├── new-windows/
│   │   │   ├── desktoppet-window.vue # 桌宠窗口组件
│   │   │   └── pop-up-window.vue   # 对话弹窗组件
│   │   └── todo/
│   │       ├── add.vue              # 新建待办页面
│   │       └── components/
│   │           ├── dayview.vue       # 日视图
│   │           ├── weekview.vue      # 周视图
│   │           └── monthview.vue     # 月视图
│   └── constants/
│       └── sakiko-messages.json     # 对话内容配置
```

## 总结

动画队列系统通过队列管理和异步处理，确保了多个动画能够按顺序播放，解决了动画冲突问题。系统支持对话与动画的完美同步，每个动画播放时都会显示对应的对话内容，提供了更好的用户体验。系统提供了预定义的动画序列，也支持自定义动画序列，使用简单灵活。
