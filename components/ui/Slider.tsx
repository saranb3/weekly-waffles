import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Colors } from '@/constants/Colors';

interface SliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  formatValue?: (value: number) => string;
  style?: any;
}

export function Slider({
  min,
  max,
  value,
  onChange,
  label,
  formatValue = (v) => v.toString(),
  style
}: SliderProps) {
  const position = useSharedValue(((value - min) / (max - min)) * 280); // 280 is track width
  const sliderWidth = 280;
  const thumbSize = 24;

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      const newPosition = Math.max(0, Math.min(sliderWidth, event.translationX + position.value));
      position.value = newPosition;
      
      const newValue = Math.round(interpolate(
        newPosition,
        [0, sliderWidth],
        [min, max],
        Extrapolate.CLAMP
      ));
      
      runOnJS(onChange)(newValue);
    })
    .onEnd(() => {
      // Update position to match the actual value after rounding
      const actualPosition = ((value - min) / (max - min)) * sliderWidth;
      position.value = actualPosition;
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
  }));

  const trackFillStyle = useAnimatedStyle(() => ({
    width: position.value + thumbSize / 2,
  }));

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.header}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{formatValue(value)}</Text>
        </View>
      )}
      
      <View style={styles.sliderContainer}>
        <View style={styles.track} />
        <Animated.View style={[styles.trackFill, trackFillStyle]} />
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.thumb, thumbStyle]} />
        </GestureDetector>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.text.primary,
  },
  value: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
  },
  sliderContainer: {
    height: 24,
    justifyContent: 'center',
    width: 280,
  },
  track: {
    height: 4,
    backgroundColor: Colors.border.light,
    borderRadius: 2,
    width: 280,
  },
  trackFill: {
    position: 'absolute',
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.background,
    shadowColor: Colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
});