import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Prompt } from '@/types';
import { Colors } from '@/constants/Colors';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface PromptCardProps {
  prompt: Prompt;
  onOrder: (prompt: Prompt) => void;
}

const categoryColors: Record<string, string> = {
  Proud: Colors.success,
  Challenges: Colors.error,
  Fun: Colors.accent,
  Sad: Colors.secondary,
  Gratitude: '#F59E0B',
  DeepThought: '#8B5CF6',
  Custom: Colors.primary,
};

export function PromptCard({ prompt, onOrder }: PromptCardProps) {
  const categoryColor = categoryColors[prompt.category] || Colors.primary;

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.categoryBadge, { backgroundColor: categoryColor }]}>
          <Text style={styles.categoryText}>{prompt.category}</Text>
        </View>
      </View>
      
      <Text style={styles.preview}>{prompt.preview}</Text>
      <Text style={styles.text} numberOfLines={3}>{prompt.text}</Text>
      
      <Button
        title="Order"
        onPress={() => onOrder(prompt)}
        size="small"
        style={styles.orderButton}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.text.inverse,
  },
  preview: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  orderButton: {
    alignSelf: 'flex-start',
  },
});