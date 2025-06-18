import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Prompt, Waffle } from '@/types';
import { apiService } from '@/services/api';
import { PromptCard } from '@/components/PromptCard';
import { CategoryFilter } from '@/components/CategoryFilter';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Calendar, X } from 'lucide-react-native';

const categories = ['All', 'Proud', 'Challenges', 'Fun', 'Sad', 'Gratitude', 'DeepThought', 'Custom'];

export default function HomeScreen() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [upcomingWaffles, setUpcomingWaffles] = useState<Waffle[]>([]);
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);
  const [customPromptText, setCustomPromptText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadPrompts();
  }, [selectedCategory]);

  const loadData = async () => {
    try {
      const [promptsData, upcomingData] = await Promise.all([
        apiService.getPrompts(selectedCategory),
        apiService.getUpcomingWaffles()
      ]);
      setPrompts(promptsData);
      setUpcomingWaffles(upcomingData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPrompts = async () => {
    try {
      const data = await apiService.getPrompts(selectedCategory === 'All' ? undefined : selectedCategory);
      setPrompts(data);
    } catch (error) {
      console.error('Failed to load prompts:', error);
    }
  };

  const handleOrderPrompt = async (prompt: Prompt) => {
    try {
      // In a real app, you'd select a recipient
      const friends = await apiService.getFriends();
      if (friends.length === 0) {
        Alert.alert('No Friends', 'Please add friends in Settings to send waffles.');
        return;
      }

      const recipientId = friends[0].friendId;
      const waffle = await apiService.createWaffle(prompt.id, recipientId);
      
      Alert.alert(
        'Waffle Ordered! 🧇',
        `Your waffle will be delivered on ${waffle.scheduledAt.toLocaleDateString()} at ${waffle.scheduledAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      );
      
      loadData(); // Refresh upcoming waffles
    } catch (error) {
      console.error('Failed to order waffle:', error);
      Alert.alert('Error', 'Failed to order waffle. Please try again.');
    }
  };

  const handleCreateCustomPrompt = async () => {
    if (!customPromptText.trim()) return;

    try {
      const customPrompt = await apiService.createCustomPrompt(customPromptText);
      setCustomPromptText('');
      setShowCustomPrompt(false);
      
      // Add to prompts list if showing custom category
      if (selectedCategory === 'All' || selectedCategory === 'Custom') {
        setPrompts(prev => [customPrompt, ...prev]);
      }
    } catch (error) {
      console.error('Failed to create custom prompt:', error);
      Alert.alert('Error', 'Failed to create custom prompt. Please try again.');
    }
  };

  const formatScheduledTime = (date: Date) => {
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading waffles...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Prompt Café</Text>
          <Text style={styles.subtitle}>Choose your next waffle adventure</Text>
        </View>

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {/* Custom Prompt Creation */}
        <View style={styles.section}>
          {showCustomPrompt ? (
            <Card style={styles.customPromptCard}>
              <View style={styles.customPromptHeader}>
                <Text style={styles.customPromptTitle}>Create Custom Prompt</Text>
                <TouchableOpacity onPress={() => setShowCustomPrompt(false)}>
                  <X size={24} color={Colors.text.secondary} />
                </TouchableOpacity>
              </View>
              <Input
                value={customPromptText}
                onChangeText={setCustomPromptText}
                placeholder="What would you like to ask your friends?"
                multiline
                numberOfLines={3}
                style={styles.customPromptInput}
              />
              <Button
                title="Create & Order"
                onPress={handleCreateCustomPrompt}
                disabled={!customPromptText.trim()}
              />
            </Card>
          ) : (
            <TouchableOpacity onPress={() => setShowCustomPrompt(true)}>
              <Card style={styles.createCard}>
                <View style={styles.createContent}>
                  <Plus size={24} color={Colors.primary} />
                  <Text style={styles.createText}>Create Custom Prompt</Text>
                </View>
              </Card>
            </TouchableOpacity>
          )}
        </View>

        {/* Prompts List */}
        <View style={styles.section}>
          {prompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onOrder={handleOrderPrompt}
            />
          ))}
        </View>

        {/* Upcoming Waffles */}
        {upcomingWaffles.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Calendar size={20} color={Colors.text.primary} />
              <Text style={styles.sectionTitle}>Upcoming Waffles</Text>
            </View>
            
            {upcomingWaffles.map((waffle) => (
              <Card key={waffle.id} style={styles.upcomingCard}>
                <View style={styles.upcomingContent}>
                  <View style={styles.upcomingInfo}>
                    <Text style={styles.upcomingTime}>
                      {formatScheduledTime(waffle.scheduledAt)}
                    </Text>
                    <Text style={styles.upcomingPrompt} numberOfLines={2}>
                      {waffle.prompt?.text}
                    </Text>
                  </View>
                  <Button
                    title="Cancel"
                    onPress={() => {/* Handle cancel */}}
                    variant="ghost"
                    size="small"
                  />
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
    marginLeft: 8,
  },
  createCard: {
    marginHorizontal: 16,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: 'transparent',
  },
  createContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  createText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
    marginLeft: 8,
  },
  customPromptCard: {
    marginHorizontal: 16,
  },
  customPromptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  customPromptTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
  },
  customPromptInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  upcomingCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  upcomingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  upcomingInfo: {
    flex: 1,
    marginRight: 16,
  },
  upcomingTime: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
    marginBottom: 4,
  },
  upcomingPrompt: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    lineHeight: 20,
  },
});