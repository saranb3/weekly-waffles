import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react-native';

const mockCategories = [
  'All',
  'Happy',
  'Sad',
  'Proud',
  'Challenging',
  'Fun',
  'Gratitude',
  'DeepThought',
];

const mockPrompts = [
  { id: '1', category: 'Happy', text: 'What made you smile today?' },
  { id: '2', category: 'Sad', text: 'What has been weighing on your heart?' },
  { id: '3', category: 'Proud', text: 'Share something you accomplished recently.' },
  { id: '4', category: 'Challenging', text: 'What challenge are you facing right now?' },
  { id: '5', category: 'Fun', text: 'What is the funniest thing that happened to you this week?' },
  { id: '6', category: 'Gratitude', text: 'What are you grateful for today?' },
  { id: '7', category: 'DeepThought', text: 'What is something you have been reflecting on deeply?' },
];

export default function CafeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const params = useLocalSearchParams();
  const friendId = params.friendId as string | undefined;

  const filteredPrompts = selectedCategory === 'All'
    ? mockPrompts
    : mockPrompts.filter(p => p.category === selectedCategory);

  const handlePromptSelect = (prompt: typeof mockPrompts[0]) => {
    router.push({ pathname: '/record', params: { promptId: prompt.id, promptText: prompt.text, friendId } });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={28} color={'#1A237E'} />
        </TouchableOpacity>
        <Text style={styles.logo}>🧇</Text>
        <Text style={styles.title}>Pick a prompt</Text>
        <Text style={styles.subtitle}>Choose a category and prompt to send a waffle</Text>
      </View>
      <View style={styles.categoryFilter}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {mockCategories.map(category => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonActive]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextActive]}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={filteredPrompts}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.promptList}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.promptCard} onPress={() => handlePromptSelect(item)}>
            <Text style={styles.promptText}>{item.text}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 16,
  },
  logo: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 4,
    fontFamily: 'Inter-Bold',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFD600',
    marginBottom: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  categoryFilter: {
    flexDirection: 'row',
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  categoryButton: {
    backgroundColor: '#FFFDE7',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryButtonActive: {
    backgroundColor: '#FFD600',
    borderColor: '#FFD600',
  },
  categoryText: {
    color: '#1A237E',
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
  },
  categoryTextActive: {
    color: '#FFF8E1',
  },
  promptList: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  promptCard: {
    backgroundColor: '#FFFDE7',
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#FFD600',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  promptText: {
    fontSize: 18,
    color: '#1A237E',
    fontFamily: 'Inter-Medium',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 40,
    padding: 12,
    zIndex: 10,
  },
}); 