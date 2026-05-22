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
