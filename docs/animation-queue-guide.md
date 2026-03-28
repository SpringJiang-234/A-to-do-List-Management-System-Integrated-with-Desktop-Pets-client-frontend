# 桌宠动画队列系统使用指南

## 概述

桌宠动画队列系统解决了多个动画同时播放时的冲突问题，确保动画按顺序依次播放。

## 核心功能

### 1. 动画队列管理器

动画队列系统会自动管理动画的播放顺序，当多个动画被触发时，它们会被添加到队列中并依次播放。

### 2. 动画类型

- **ONE_TIME**: 一次性动画，播放完成后自动返回循环动画
- **LOOP**: 循环动画，持续播放直到被新的循环动画替换
- **UPGRADE**: 升级动画，带有特殊的淡入淡出效果

### 3. 预定义动画序列

系统提供了预定义的动画序列，用于常见的操作场景：

#### 完成待办按时动画序列
```
1. 棒棒动画 (必须)
2. 活力满满动画 (如果活力值达到100)
3. 升级动画 (如果成长值满)
4. 切换到喝茶循环动画 (如果心情值从<60变为>=60)
```

#### 完成待办逾期动画序列
```
1. 鼓掌动画 (必须)
2. 活力满满动画 (如果活力值达到100)
3. 升级动画 (如果成长值满)
4. 切换到指指点点循环动画 (如果心情值从>=60变为<60)
```

#### 新建待办动画序列
```
1. 棒棒动画 (必须)
2. 活力满满动画 (如果活力值达到100)
```

## 使用方法

### 基础使用

#### 播放单个动画

```typescript
// 播放一次性动画
playOneTimeAnimation(intimateGifPath);

// 播放循环动画
switchLoopAnimation(LoopAnimationType.TEA);

// 播放升级动画
playUpgradeAnimation();
```

#### 播放动画序列

```typescript
// 完成待办按时动画
playCompleteTodoOnTimeAnimation(
  isEnergetic: boolean,    // 活力值是否达到100
  isUpgrade: boolean,      // 是否升级
  isMoodIncreased: boolean // 心情值是否从<60变为>=60
);

// 完成待办逾期动画
playCompleteTodoOverdueAnimation(
  isEnergetic: boolean,     // 活力值是否达到100
  isUpgrade: boolean,       // 是否升级
  isMoodDecreased: boolean  // 心情值是否从>=60变为<60
);

// 新建待办动画
playNewTodoAnimation(
  isEnergetic: boolean      // 活力值是否达到100
);
```

### IPC 事件调用

在 Electron 主进程中，可以通过 IPC 事件触发动画：

```typescript
// 播放单个动画
ipcRenderer.send('play-good-animation');
ipcRenderer.send('play-upgrade-animation');
ipcRenderer.send('play-tea-animation');

// 播放动画序列
ipcRenderer.send('play-complete-todo-on-time-animation', true, false, true);
ipcRenderer.send('play-complete-todo-overdue-animation', true, true, false);
ipcRenderer.send('play-new-todo-animation', false);
```

## 工作原理

### 动画队列流程

1. **添加动画到队列**: 当动画被触发时，会被添加到队列中
2. **处理队列**: 如果队列正在处理，新动画会等待；如果队列空闲，立即开始处理
3. **播放动画**: 按照队列顺序依次播放每个动画
4. **完成回调**: 每个动画播放完成后，执行回调函数（如果有）
5. **继续下一个**: 继续播放队列中的下一个动画，直到队列为空

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
    type: AnimationType.ONE_TIME
  },
  {
    gifPath: energeticGifPath,
    type: AnimationType.ONE_TIME,
    duration: 3000
  },
  {
    gifPath: "",
    type: AnimationType.LOOP,
    loopType: LoopAnimationType.TEA
  }
];

customSequence.forEach(task => addToQueue(task));
```

## 注意事项

1. **动画顺序**: 动画严格按照队列顺序播放，后触发的动画会等待前面的动画完成
2. **循环动画**: 循环动画会持续播放，直到被新的循环动画替换
3. **回调函数**: 可以为动画添加回调函数，在动画完成后执行
4. **状态变量**: 系统会自动管理状态变量，无需手动设置

## 示例场景

### 场景1: 完成待办并触发多个动画

```typescript
// 用户完成待办，触发以下动画序列：
// 1. 棒棒动画 (2秒)
// 2. 活力满满动画 (2秒) - 因为活力值达到100
// 3. 升级动画 (3秒) - 因为成长值满
// 4. 切换到喝茶循环动画 - 因为心情值从50变为70

playCompleteTodoOnTimeAnimation(true, true, true);
```

### 场景2: 快速连续操作

```typescript
// 用户快速完成多个待办，每个待办都会触发动画序列
// 动画会按顺序依次播放，不会冲突

playCompleteTodoOnTimeAnimation(false, false, false);
playCompleteTodoOnTimeAnimation(true, false, true);
playNewTodoAnimation(false);
```

## 技术实现

动画队列系统使用以下技术：

- **Vue 3 Composition API**: 使用 ref 和响应式状态管理
- **TypeScript**: 类型安全的动画任务定义
- **Promise**: 异步动画播放控制
- **IPC**: Electron 进程间通信

## 文件结构

```
client-frontend/
├── src/
│   ├── types/
│   │   └── animation.ts              # 动画类型定义
│   ├── utils/
│   │   └── animationSequences.ts     # 动画序列工具函数
│   └── views/
│       └── new-windows/
│           └── desktoppet-window.vue # 桌宠窗口组件
```

## 总结

动画队列系统通过队列管理和异步处理，确保了多个动画能够按顺序播放，解决了动画冲突问题。系统提供了预定义的动画序列，也支持自定义动画序列，使用简单灵活。
