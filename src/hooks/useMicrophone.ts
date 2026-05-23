/**
 * 注意：此 Hook 需要以下原生模块之一：
 * - react-native-audio-api
 * - @react-native-community/audio-api
 *
 * 示例实现仅供参考，实际使用请根据选择的库调整
 */

import { useState, useCallback, useRef, useEffect } from 'react';

interface UseMicrophoneOptions {
  noiseThreshold?: number;
  smoothingFactor?: number;
}

interface UseMicrophoneReturn {
  volume: number;
  isRecording: boolean;
  recordingTime: number;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
}

export const useMicrophone = (
  options?: UseMicrophoneOptions
): UseMicrophoneReturn => {
  const noiseThreshold = options?.noiseThreshold ?? 0.05;
  const smoothingFactor = options?.smoothingFactor ?? 0.3;

  const [volume, setVolume] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const smoothedVolumeRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const calculateVolume = useCallback(
    (audioData: Float32Array): number => {
      let sum = 0;
      for (let i = 0; i < audioData.length; i++) {
        sum += audioData[i] * audioData[i];
      }

      const rms = Math.sqrt(sum / audioData.length);
      const normalizedVolume = Math.min(rms * 3, 1);

      if (normalizedVolume < noiseThreshold) {
        return 0;
      }

      smoothedVolumeRef.current =
        smoothedVolumeRef.current * smoothingFactor +
        normalizedVolume * (1 - smoothingFactor);

      return smoothedVolumeRef.current;
    },
    [noiseThreshold, smoothingFactor]
  );

  const startRecording = useCallback(async () => {
    try {
      // TODO: 实现实际的麦克风录音
      // 使用 react-native-audio-api 或其他库
      //
      // 示例代码：
      // const audioContext = new AudioContext();
      // const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // const source = audioContext.createMediaStreamSource(stream);
      // const analyser = audioContext.createAnalyser();
      // analyser.fftSize = 256;
      // source.connect(analyser);
      //
      // const dataArray = new Float32Array(analyser.fftSize);
      //
      // const updateVolume = () => {
      //   analyser.getFloatTimeDomainData(dataArray);
      //   const vol = calculateVolume(dataArray);
      //   setVolume(vol);
      //   requestAnimationFrame(updateVolume);
      // };
      //
      // updateVolume();

      setIsRecording(true);
      startTimeRef.current = Date.now();

      intervalRef.current = setInterval(() => {
        setRecordingTime(Date.now() - startTimeRef.current);
      }, 100);
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }, [calculateVolume]);

  const stopRecording = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setIsRecording(false);
    setVolume(0);
    smoothedVolumeRef.current = 0;
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    volume,
    isRecording,
    recordingTime,
    startRecording,
    stopRecording,
  };
};
