import React from 'react';
import { View, Image, Text, StyleSheet, ImageSourcePropType } from 'react-native';
import { Colors } from '@/constants/Colors';

interface AvatarProps {
  source?: ImageSourcePropType;
  name?: string;
  size?: number;
  style?: any;
}

export function Avatar({ source, name, size = 40, style }: AvatarProps) {
  const containerStyle = [
    styles.container,
    { width: size, height: size, borderRadius: size / 2 },
    style
  ];

  const textStyle = [
    styles.text,
    { fontSize: size * 0.4 }
  ];

  if (source) {
    return (
      <Image
        source={source}
        style={containerStyle}
        resizeMode="cover"
      />
    );
  }

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <View style={[containerStyle, styles.placeholder]}>
      <Text style={textStyle}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
  },
  placeholder: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: Colors.text.inverse,
    fontFamily: 'Inter-SemiBold',
  },
});