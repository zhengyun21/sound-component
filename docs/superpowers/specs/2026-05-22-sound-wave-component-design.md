# Sound Wave 组件设计文档

## 概述

这是一个 React Native 组件，用于可视化音频音量数据，模拟 iPhone 语音备忘录的声波效果。

## 技术栈

- React Native
- TypeScript
- React Native Animated API（内置）

## 组件架构

### SoundWave 组件
主组件，负责：
- 接收音量数据
- 管理条形柱数组状态
- 处理从右向左的滚动动画

### SoundBar 组件
单个条形柱子组件，负责：
- 渲染圆角矩形
- 处理高度变化的平滑动画

### useSoundWave Hook
自定义 Hook，负责：
- 管理音量数据数组
- 处理动画逻辑

## Props 接口

```typescript
interface SoundWaveProps {
  // 当前音量值 (0.0 - 1.0)
  volume: number;
  
  // 条形柱颜色，默认白色
  barColor?: string;
  
  // 最小高度 (dp)，默认 12
  minBarHeight?: number;
  
  // 最大高度 (dp)，默认 58
  maxBarHeight?: number;
  
  // 条形柱宽度 (dp)，默认 4
  barWidth?: number;
  
  // 条形柱之间的间距 (dp)，默认 6
  barGap?: number;
  
  // 屏幕上显示的条形柱数量，默认 30
  visibleBarCount?: number;
  
  // 动画持续时间 (ms)，默认 100
  animationDuration?: number;
}
```

## 数据流

1. 父组件以 60 FPS 的频率调用 `SoundWave` 组件，传入新的音量值 (0.0-1.0)
2. `SoundWave` 将新值添加到数组末尾，移除数组开头的旧值（保持约 30 个）
3. 每个条形柱的高度根据音量值计算：`height = minHeight + volume * (maxHeight - minHeight)`
4. 使用 `Animated.timing` 实现高度平滑过渡
5. 使用水平滚动或偏移量实现从右向左的流动效果

## 文件结构

```
sound-conponent/
├── src/
│   ├── components/
│   │   ├── SoundWave.tsx        # 主组件
│   │   └── SoundBar.tsx         # 单个条形柱子组件
│   ├── hooks/
│   │   └── useSoundWave.ts      # 自定义 Hook 管理状态和动画
│   └── index.ts                 # 导出文件
├── example/                     # 示例项目
│   └── App.tsx
├── package.json
└── tsconfig.json
```

## 视觉规格

- 条形柱样式：圆角矩形
- 条形柱颜色：白色
- 高度范围：12dp - 58dp
- 条形柱间距：6dp
- 同时显示约 30 个条形柱
- 更新频率：60 FPS

## 动画细节

- 高度变化：使用 `Animated.timing` 平滑过渡
- 滚动效果：从右向左连续流动
- 性能优化：使用 `useNativeDriver: true`
