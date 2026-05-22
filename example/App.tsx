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
