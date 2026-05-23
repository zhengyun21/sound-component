# Sound Wave Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a React Native component that visualizes audio volume data with a sound wave effect like iPhone Voice Memos.

**Architecture:** Component-based architecture with SoundWave (main), SoundBar (individual bar), and useSoundWave (custom hook for state/animations).

**Tech Stack:** React Native, TypeScript, React Native Animated API

---

## File Structure

Files to be created:
- `package.json` - Project dependencies
- `tsconfig.json` - TypeScript configuration
- `src/index.ts` - Exports
- `src/hooks/useSoundWave.ts` - Custom hook for state management
- `src/components/SoundBar.tsx` - Individual bar component
- `src/components/SoundWave.tsx` - Main sound wave component
- `example/App.tsx` - Example usage

---

### Task 1: Initialize Project Structure

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "sound-wave-component",
  "version": "0.1.0",
  "description": "React Native sound wave visualization component",
  "main": "src/index.ts",
  "scripts": {
    "start": "react-native start"
  },
  "peerDependencies": {
    "react": ">=17.0.0",
    "react-native": ">=0.64.0"
  },
  "devDependencies": {
    "@types/react": "^18.0.0",
    "@types/react-native": "^0.72.0",
    "typescript": "^5.0.0"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "lib": ["es2019"],
    "allowJs": true,
    "jsx": "react-native",
    "noEmit": true,
    "isolatedModules": true,
    "strict": true,
    "moduleResolution": "node",
    "baseUrl": "./",
    "paths": {
      "*": ["src/*"]
    },
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "exclude": [
    "node_modules",
    "babel.config.js",
    "metro.config.js",
    "jest.config.js"
  ]
}
```

- [ ] **Step 3: Create src/index.ts**

```typescript
export { SoundWave } from './components/SoundWave';
export type { SoundWaveProps } from './components/SoundWave';
```

- [ ] **Step 4: Commit**

```bash
git add package.json tsconfig.json src/index.ts
git commit -m "chore: initialize project structure"
```

---

### Task 2: Create useSoundWave Hook

**Files:**
- Create: `src/hooks/useSoundWave.ts`

- [ ] **Step 1: Create useSoundWave.ts**

```typescript
import { useState, useRef, useEffect } from 'react';
import { Animated } from 'react-native';

interface UseSoundWaveOptions {
  visibleBarCount: number;
  animationDuration: number;
}

export const useSoundWave = (options: UseSoundWaveOptions) => {
  const { visibleBarCount, animationDuration } = options;
  const [volumeHistory, setVolumeHistory] = useState<number[]>(
    Array(visibleBarCount).fill(0)
  );
  const animatedValues = useRef<Animated.Value[]>(
    Array(visibleBarCount).fill(0).map(() => new Animated.Value(0))
  ).current;

  const updateVolume = (newVolume: number) => {
    setVolumeHistory(prev => {
      const next = [...prev.slice(1), newVolume];
      return next;
    });
  };

  useEffect(() => {
    volumeHistory.forEach((volume, index) => {
      Animated.timing(animatedValues[index], {
        toValue: volume,
        duration: animationDuration,
        useNativeDriver: false,
      }).start();
    });
  }, [volumeHistory, animationDuration, animatedValues]);

  return {
    animatedValues,
    updateVolume,
  };
};
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useSoundWave.ts
git commit -m "feat: add useSoundWave hook"
```

---

### Task 3: Create SoundBar Component

**Files:**
- Create: `src/components/SoundBar.tsx`

- [ ] **Step 1: Create SoundBar.tsx**

```typescript
import React from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';

interface SoundBarProps {
  animatedHeight: Animated.Value;
  barWidth: number;
  minBarHeight: number;
  maxBarHeight: number;
  barColor: string;
}

export const SoundBar: React.FC<SoundBarProps> = ({
  animatedHeight,
  barWidth,
  minBarHeight,
  maxBarHeight,
  barColor,
}) => {
  const height = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [minBarHeight, maxBarHeight],
  });

  return (
    <Animated.View
      style={[
        styles.bar,
        {
          width: barWidth,
          height,
          backgroundColor: barColor,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  bar: {
    borderRadius: 2,
  } as ViewStyle,
});
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SoundBar.tsx
git commit -m "feat: add SoundBar component"
```

---

### Task 4: Create SoundWave Component

**Files:**
- Create: `src/components/SoundWave.tsx`

- [ ] **Step 1: Create SoundWave.tsx**

```typescript
import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SoundBar } from './SoundBar';
import { useSoundWave } from '../hooks/useSoundWave';

export interface SoundWaveProps {
  volume: number;
  barColor?: string;
  minBarHeight?: number;
  maxBarHeight?: number;
  barWidth?: number;
  barGap?: number;
  visibleBarCount?: number;
  animationDuration?: number;
}

export const SoundWave: React.FC<SoundWaveProps> = ({
  volume,
  barColor = '#FFFFFF',
  minBarHeight = 12,
  maxBarHeight = 58,
  barWidth = 4,
  barGap = 6,
  visibleBarCount = 30,
  animationDuration = 100,
}) => {
  const { animatedValues, updateVolume } = useSoundWave({
    visibleBarCount,
    animationDuration,
  });

  useEffect(() => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    updateVolume(clampedVolume);
  }, [volume, updateVolume]);

  return (
    <View style={styles.container}>
      <View style={styles.barsContainer}>
        {animatedValues.map((animatedValue, index) => (
          <SoundBar
            key={index}
            animatedHeight={animatedValue}
            barWidth={barWidth}
            minBarHeight={minBarHeight}
            maxBarHeight={maxBarHeight}
            barColor={barColor}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  } as ViewStyle,
});
```

- [ ] **Step 2: Fix barGap in styles**

Update the barsContainer to use the barGap prop correctly:

```typescript
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
});
```

And update the component to use a wrapper for gaps:

```typescript
return (
  <View style={styles.container}>
    <View style={styles.barsContainer}>
      {animatedValues.map((animatedValue, index) => (
        <View key={index} style={{ marginRight: index < visibleBarCount - 1 ? barGap : 0 }}>
          <SoundBar
            animatedHeight={animatedValue}
            barWidth={barWidth}
            minBarHeight={minBarHeight}
            maxBarHeight={maxBarHeight}
            barColor={barColor}
          />
        </View>
      ))}
    </View>
  </View>
);
```

- [ ] **Step 3: Commit**

```bash
git add src/components/SoundWave.tsx
git commit -m "feat: add SoundWave component"
```

---

### Task 5: Create Example App

**Files:**
- Create: `example/App.tsx`

- [ ] **Step 1: Create example/App.tsx**

```typescript
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SoundWave } from '../src';

export default function App() {
  const [volume, setVolume] = useState(0);

  // Simulate random volume changes for demo
  useEffect(() => {
    const interval = setInterval(() => {
      const randomVolume = Math.random();
      setVolume(randomVolume);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sound Wave Demo</Text>
      </View>
      <View style={styles.content}>
        <SoundWave
          volume={volume}
          barColor="#FFFFFF"
          minBarHeight={12}
          maxBarHeight={58}
          barWidth={4}
          barGap={6}
          visibleBarCount={30}
          animationDuration={100}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add example/App.tsx
git commit -m "feat: add example app"
```

---

## Self-Review

**1. Spec coverage:**
- ✓ React Native + TypeScript - Yes
- ✓ Animated API - Yes
- ✓ Bar height 12-58dp - Yes
- ✓ Bar gap 6dp - Yes
- ✓ White rounded bars - Yes
- ✓ 0.0-1.0 volume input - Yes
- ✓ 60 FPS update - Yes (via parent component)
- ✓ ~30 visible bars - Yes
- ✓ Props interface complete - Yes

**2. Placeholder scan:** No placeholders found.

**3. Type consistency:** All types match between files.
