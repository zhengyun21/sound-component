import { useState, useRef, useEffect, useCallback } from 'react';
import { Animated } from 'react-native';

export interface VolumeData {
  value: number;
  time: string | null;
}

interface UseSoundWaveOptions {
  visibleBarCount: number;
  animationDuration: number;
}

export const useSoundWave = (options: UseSoundWaveOptions) => {
  const { visibleBarCount, animationDuration } = options;
  const [volumes, setVolumes] = useState<VolumeData[]>(
    Array(visibleBarCount).fill(null).map(() => ({ value: 0, time: null }))
  );
  const animatedValues = useRef<Animated.Value[]>(
    Array(visibleBarCount).fill(0).map(() => new Animated.Value(0))
  ).current;

  const updateVolume = useCallback((newVolume: number, timeLabel?: string) => {
    setVolumes(prev => {
      const next = [...prev.slice(1), { value: newVolume, time: timeLabel || null }];
      return next;
    });
  }, []);

  useEffect(() => {
    volumes.forEach((vol, index) => {
      Animated.timing(animatedValues[index], {
        toValue: vol.value,
        duration: animationDuration,
        useNativeDriver: false,
      }).start();
    });
  }, [volumes, animationDuration, animatedValues]);

  return {
    volumes,
    animatedValues,
    updateVolume,
  };
};
