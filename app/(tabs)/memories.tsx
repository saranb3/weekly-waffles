import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Waffle } from '@/types';
import { apiService } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Play, Download, ArrowLeft, Heart } from 'lucide-react-native';

export default function MemoriesScreen() {
  const [memories, setMemories] = useState<Waffle[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<Waffle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMemories();
  }, []);

  const loadMemories = async () => {
    try {
      const data = await apiService.getMemories();
      setMemories(data);
    } catch (error) {
      console.error('Failed to load memories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMemoryPress = (memory: Waffle) => {
    setSelectedMemory(memory);
  };

  const handleBackToList = () => {
    setSelectedMemory(null);
  };

  const handlePlayVideo = () => {
    if (!selectedMemory?.videoUrl) return;
    
    Alert.alert(
      'Play Video',
      'This would open the video player with the unlocked video.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Play', onPress: () => {
          // In a real app, this would open the video player
          console.log('Playing video:', selectedMemory.videoUrl);
        }}
      ]
    );
  };

  const handleExportMemory = () => {
    if (!selectedMemory) return;
    
    Alert.alert(
      'Export Memory',
      'Export this waffle conversation as a PDF or text summary?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'PDF', onPress: () => console.log('Export as PDF') },
        { text: 'Text', onPress: () => console.log('Export as text') }
      ]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading memories...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (selectedMemory) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.memoryHeader}>
          <Button
            title=""
            onPress={handleBackToList}
            variant="ghost"
            size="small"
            style={styles.backButton}
          />
          <Text style={styles.memoryTitle}>Memory</Text>
          <Button
            title=""
            onPress={handleExportMemory}
            variant="ghost"
            size="small"
            style={styles.exportButton}
          />
        </View>

        <ScrollView style={styles.memoryContent}>
          <Card style={styles.memoryCard}>
            <View style={styles.memoryMeta}>
              <View style={styles.participants}>
                <Avatar 
                  source={selectedMemory.sender?.avatarUrl} 
                  name={selectedMemory.sender?.name}
                  size={36}
                />
                <Avatar 
                  source={selectedMemory.recipient?.avatarUrl} 
                  name={selectedMemory.recipient?.name}
                  size={36}
                  style={styles.recipientAvatar}
                />
              </View>
              <Text style={styles.memoryDate}>
                {formatDate(selectedMemory.createdAt)}
              </Text>
            </View>

            <View style={styles.promptSection}>
              <Text style={styles.promptLabel}>Prompt</Text>
              <Text style={styles.promptText}>{selectedMemory.prompt?.text}</Text>
            </View>

            {selectedMemory.videoUnlocked && selectedMemory.videoUrl && (
              <View style={styles.videoSection}>
                <Text style={styles.videoLabel}>Video Response</Text>
                <TouchableOpacity 
                  style={styles.videoThumbnail}
                  onPress={handlePlayVideo}
                >
                  <View style={styles.playButton}>
                    <Play size={32} color={Colors.text.inverse} />
                  </View>
                  <Text style={styles.videoText}>Tap to play video response</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.repliesSection}>
              <Text style={styles.repliesLabel}>
                Conversation ({selectedMemory.replies.length} replies)
              </Text>
              
              {selectedMemory.replies.map((reply, index) => (
                <View key={reply.id} style={styles.replyItem}>
                  <View style={styles.replyHeader}>
                    <Avatar 
                      source={reply.user?.avatarUrl} 
                      name={reply.user?.name}
                      size={24}
                    />
                    <Text style={styles.replyUserName}>{reply.user?.name}</Text>
                  </View>
                  <Text style={styles.replyText}>{reply.text}</Text>
                </View>
              ))}
            </View>
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Memories</Text>
          <Text style={styles.subtitle}>Your completed waffle conversations</Text>
        </View>

        {memories.length === 0 ? (
          <View style={styles.emptyState}>
            <Heart size={48} color={Colors.text.disabled} />
            <Text style={styles.emptyTitle}>No memories yet</Text>
            <Text style={styles.emptySubtitle}>
              Complete some waffle conversations to build your memory collection!
            </Text>
          </View>
        ) : (
          <View style={styles.memoriesList}>
            {memories.map((memory) => (
              <TouchableOpacity 
                key={memory.id}
                onPress={() => handleMemoryPress(memory)}
                activeOpacity={0.8}
              >
                <Card style={styles.memoryPreviewCard}>
                  <View style={styles.previewHeader}>
                    <View style={styles.previewParticipants}>
                      <Avatar 
                        source={memory.sender?.avatarUrl} 
                        name={memory.sender?.name}
                        size={28}
                      />
                      <Avatar 
                        source={memory.recipient?.avatarUrl} 
                        name={memory.recipient?.name}
                        size={28}
                        style={styles.previewRecipientAvatar}
                      />
                    </View>
                    <View style={styles.previewMeta}>
                      <Text style={styles.previewDate}>
                        {formatDate(memory.createdAt)}
                      </Text>
                      {memory.videoUnlocked && (
                        <View style={styles.videoIndicator}>
                          <Play size={12} color={Colors.success} />
                        </View>
                      )}
                    </View>
                  </View>
                  
                  <Text style={styles.previewPrompt} numberOfLines={2}>
                    {memory.prompt?.text}
                  </Text>
                  
                  <View style={styles.previewFooter}>
                    <Text style={styles.previewReplies}>
                      {memory.replies.length} replies
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
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
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  memoriesList: {
    paddingBottom: 24,
  },
  
  // Memory preview styles
  memoryPreviewCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewParticipants: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewRecipientAvatar: {
    marginLeft: -8,
  },
  previewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    marginRight: 8,
  },
  videoIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewPrompt: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: Colors.text.primary,
    lineHeight: 22,
    marginBottom: 12,
  },
  previewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewReplies: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
  },

  // Memory detail styles
  memoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  backButton: {
    width: 40,
  },
  memoryTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
  },
  exportButton: {
    width: 40,
  },
  memoryContent: {
    flex: 1,
    padding: 16,
  },
  memoryCard: {
    padding: 24,
  },
  memoryMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  participants: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipientAvatar: {
    marginLeft: -12,
  },
  memoryDate: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.text.secondary,
  },
  promptSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  promptLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.text.secondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  promptText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text.primary,
    lineHeight: 24,
  },
  videoSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  videoLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.text.secondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  videoThumbnail: {
    height: 120,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.success,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  videoText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.text.secondary,
  },
  repliesSection: {
    flex: 1,
  },
  repliesLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.text.secondary,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  replyItem: {
    marginBottom: 20,
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  replyUserName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
    marginLeft: 8,
  },
  replyText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: Colors.text.primary,
    lineHeight: 22,
    marginLeft: 32,
  },
});