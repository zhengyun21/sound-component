
import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle, Text } from 'react-native';
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
  showTimeline?: boolean;
  timelineColor?: string;
  timelineFontSize?: number;
  isRecording?: boolean;
  recordingTime?: number;
}

const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((ms % 1000) / 100);
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${tenths}`;
};

const formatTimeForDisplay = (ms: number): string => {
  return formatTime(ms).slice(0, 5);
};

export const SoundWave: React.FC<SoundWaveProps> = ({
  volume,
  barColor = '#FFFFFF',
  minBarHeight = 12,
  maxBarHeight = 58,
  barWidth = 4,
  barGap = 6,
  visibleBarCount = 30,
  animationDuration = 100,
  showTimeline = false,
  timelineColor = 'rgba(255, 255, 255, 0.7)',
  timelineFontSize = 10,
  isRecording = false,
  recordingTime = 0,
}) => {
  const { volumes, animatedValues, updateVolume } = useSoundWave({
    visibleBarCount,
    animationDuration,
  });

  useEffect(() => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    const timeLabel = isRecording ? formatTime(recordingTime) : null;
    updateVolume(clampedVolume, timeLabel);
  }, [volume, updateVolume, isRecording, recordingTime]);

  return (
    <View style={styles.container}>
      <View style={styles.barsContainer}>
        {animatedValues.map((animatedValue, index) => (
          <View
            key={index}
            style={{
              marginRight: index < visibleBarCount - 1 ? barGap : 0,
              width: barWidth,
            }}
          >
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
      {showTimeline && (
        <View style={styles.timelineContainer}>
          {volumes.map((vol, index) => (
            <View
              key={index}
              style={{
                width: barWidth,
                marginRight: index < visibleBarCount - 1 ? barGap : 0,
                alignItems: 'center',
              }}
            >
              {vol.time && index % 5 === 0 ? (
                <Text
                  style={[
                    styles.timelineLabel,
                    {
                      color: timelineColor,
                      fontSize: timelineFontSize,
                    },
                  ]}
                >
                  {vol.time}
                </Text>
              ) : (
                <View style={{ height: timelineFontSize }} />
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
  } as ViewStyle,
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 120,
  } as ViewStyle,
  timelineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    marginTop: 8,
  } as ViewStyle,
  timelineLabel: {
    textAlign: 'center',
  } as ViewStyle,
});
