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
  const halfMinHeight = minBarHeight / 2;
  const halfMaxHeight = maxBarHeight / 2;
  const maxAmplitude = halfMaxHeight - halfMinHeight;

  const topHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [halfMinHeight, halfMinHeight + maxAmplitude],
  });

  const bottomHeight = animatedHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [halfMinHeight, halfMinHeight + maxAmplitude],
  });

  return (
    <>
      <Animated.View
        style={[
          styles.barTop,
          {
            width: barWidth,
            height: topHeight,
            backgroundColor: barColor,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.barBottom,
          {
            width: barWidth,
            height: bottomHeight,
            backgroundColor: barColor,
          },
        ]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  barTop: {
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  } as ViewStyle,
  barBottom: {
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  } as ViewStyle,
});
