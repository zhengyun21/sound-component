import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { SoundWave } from '../src';

const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export default function App() {
  const [volume, setVolume] = useState(0.5);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mode, setMode] = useState<'auto' | 'manual'>('auto');

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (mode === 'auto') {
      interval = setInterval(() => {
        const randomVolume = Math.random();
        setVolume(randomVolume);
        if (isRecording) {
          setRecordingTime(prev => prev + 100);
        }
      }, 100);
    } else {
      interval = setInterval(() => {
        if (isRecording) {
          setRecordingTime(prev => prev + 100);
        }
      }, 100);
    }

    return () => clearInterval(interval);
  }, [mode, isRecording]);

  const handleRecordToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      setRecordingTime(0);
    } else {
      setIsRecording(true);
      setRecordingTime(0);
    }
  };

  const handleModeToggle = () => {
    setMode(prev => (prev === 'auto' ? 'manual' : 'auto'));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sound Wave Demo</Text>
        <Text style={styles.subtitle}>
          Mode: {mode === 'auto' ? 'Auto' : 'Manual'}
        </Text>
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
          showTimeline={true}
          timelineColor="rgba(255, 255, 255, 0.7)"
          timelineFontSize={10}
          isRecording={isRecording}
          recordingTime={recordingTime}
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.infoText}>Volume: {volume.toFixed(2)}</Text>
        <Text style={styles.infoText}>Time: {formatTime(recordingTime)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, styles.modeButton]}
          onPress={handleModeToggle}
        >
          <Text style={styles.buttonText}>
            {mode === 'auto' ? 'Switch to Manual' : 'Switch to Auto'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.recordButton,
            isRecording && styles.recordButtonActive,
          ]}
          onPress={handleRecordToggle}
        >
          <Text style={styles.buttonText}>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {mode === 'auto'
            ? 'Auto mode: Random volume generation'
            : 'Manual mode: Use slider to control volume'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  } as ViewStyle,
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  } as ViewStyle,
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  } as ViewStyle,
  subtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  } as ViewStyle,
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  } as ViewStyle,
  info: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    marginVertical: 20,
  } as ViewStyle,
  infoText: {
    color: '#FFFFFF',
    fontSize: 16,
  } as ViewStyle,
  controls: {
    paddingHorizontal: 20,
    gap: 15,
  } as ViewStyle,
  button: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  } as ViewStyle,
  modeButton: {
    backgroundColor: '#333333',
  } as ViewStyle,
  recordButton: {} as ViewStyle,
  recordButtonActive: {
    backgroundColor: '#FF3B30',
  } as ViewStyle,
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  } as ViewStyle,
  footer: {
    padding: 20,
    marginTop: 'auto',
  } as ViewStyle,
  footerText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    textAlign: 'center',
  } as ViewStyle,
});
