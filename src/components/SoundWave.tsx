
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
  } as ViewStyle,
});

