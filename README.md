# Sound Wave Component

React Native 声波可视化组件，模拟 iPhone 语音备忘录效果。

## 特性

- 🎤 实时音量可视化
- ⏱️ 时间轴显示
- 🎨 完全可定制
- 📱 React Native 原生组件
- 🔄 双向动画效果

## 安装

```bash
npm install sound-wave-component
```

或者使用 yarn：

```bash
yarn add sound-wave-component
```

## 快速开始

```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SoundWave } from 'sound-wave-component';

export default function App() {
  return (
    <View style={styles.container}>
      <SoundWave
        volume={0.5}
        barColor="#FFFFFF"
        minBarHeight={12}
        maxBarHeight={58}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| volume | number | (必填) | 音量值 0.0-1.0 |
| barColor | string | '#FFFFFF' | 条形柱颜色 |
| minBarHeight | number | 12 | 最小高度 (dp) |
| maxBarHeight | number | 58 | 最大高度 (dp) |
| barWidth | number | 4 | 条形柱宽度 (dp) |
| barGap | number | 6 | 条形柱间距 (dp) |
| visibleBarCount | number | 30 | 显示的条形柱数量 |
| animationDuration | number | 100 | 动画时长 (ms) |
| showTimeline | boolean | false | 是否显示时间轴 |
| timelineColor | string | 'rgba(255, 255, 255, 0.7)' | 时间标签颜色 |
| timelineFontSize | number | 10 | 时间标签字体大小 |
| isRecording | boolean | false | 是否正在录音 |
| recordingTime | number | 0 | 录音时长 (毫秒) |

## Hooks

### useSoundWave

管理声波状态和动画，提供更灵活的控制。

```typescript
import { useSoundWave } from 'sound-wave-component';

const { volumes, animatedValues, updateVolume } = useSoundWave({
  visibleBarCount: 30,
  animationDuration: 100,
});

// 更新音量
updateVolume(0.5, '00:01.2'); // 第二个参数为时间标签
```

### useMicrophone

⚠️ 需要原生模块支持（示例实现）

麦克风录音支持，提供实时音量检测。

```typescript
import { useMicrophone } from 'sound-wave-component';

const { volume, isRecording, recordingTime, startRecording, stopRecording } =
  useMicrophone({
    noiseThreshold: 0.05,
    smoothingFactor: 0.3,
  });
```

**注意：** 此 Hook 需要安装以下原生模块之一：
- `react-native-audio-api`
- `@react-native-community/audio-api`

## 示例

### 基础使用

```typescript
import React from 'react';
import { SoundWave } from 'sound-wave-component';

<SoundWave volume={0.5} />;
```

### 带时间轴的录音界面

```typescript
import React, { useState, useEffect } from 'react';
import { SoundWave } from 'sound-wave-component';

function RecordingScreen() {
  const [volume, setVolume] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        // 获取麦克风音量
        setVolume(getMicrophoneVolume());
        setRecordingTime(prev => prev + 100);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  return (
    <SoundWave
      volume={volume}
      showTimeline={true}
      isRecording={isRecording}
      recordingTime={recordingTime}
    />
  );
}
```

### 自定义样式

```typescript
<SoundWave
  volume={volume}
  barColor="#FF6B6B"
  minBarHeight={20}
  maxBarHeight={80}
  barWidth={6}
  barGap={8}
  visibleBarCount={20}
  animationDuration={150}
/>
```

完整的示例应用请参见 [example/App.tsx](example/App.tsx)

## 类型定义

### SoundWaveProps

```typescript
interface SoundWaveProps {
  volume: number;
  barColor?: string;
  minBarHeight?: number;
  maxBarHeight?: number;
  barWidth?: number;
  barGap?: number;
  visibleBarCount?: number;
  animationDuration?: number;
  showTimeline?: boolean;
  timelineColor?: string;
  timelineFontSize?: number;
  isRecording?: boolean;
  recordingTime?: number;
}
```

### VolumeData

```typescript
interface VolumeData {
  value: number;
  time: string | null;
}
```

## 工作原理

### 动画实现

组件使用 React Native 的 `Animated` API 实现流畅的动画效果：

1. **音量历史**: 维护一个固定长度的音量数组
2. **平滑过渡**: 使用 `Animated.timing` 实现平滑的高度变化
3. **双向扩展**: 条形柱从中心向上下两个方向扩展

### 时间轴

当 `showTimeline` 为 `true` 时，组件会：

1. 在录音时记录每个音量值的时间戳
2. 在时间轴上显示时间标签（每隔 5 个显示一个）
3. 时间格式为 `MM:SS.T`（分:秒.十分之一秒）

## 浏览器兼容性

Web 版本（demo.html）支持：
- Chrome 56+
- Firefox 52+
- Safari 11+
- Edge 79+

React Native 版本支持：
- React Native 0.64+
- React 17.0+

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
