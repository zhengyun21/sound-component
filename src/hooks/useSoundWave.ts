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
