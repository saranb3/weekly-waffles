import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Waffle, WaffleReply } from '@/types';
import { apiService } from '@/services/api';
import { WaffleCard } from '@/components/WaffleCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { ArrowLeft, Send } from 'lucide-react-native';
import { router } from 'expo-router';

export default function ActiveScreen() {
  const [activeWaffles, setActiveWaffles] = useState<Waffle[]>([]);
  const [selectedWaffle, setSelectedWaffle] = useState<Waffle | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActiveWaffles();
  }, []);

  const loadActiveWaffles = async () => {
    try {
      const data = await apiService.getActiveWaffles();
      setActiveWaffles(data);
    } catch (error) {
      console.error('Failed to load active waffles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWafflePress = (waffle: Waffle) => {
    setSelectedWaffle(waffle);
  };

  const handleBackToList = () => {
    setSelectedWaffle(null);
    setReplyText('');
  };

  const handleSendReply = async () => {
    if (!selectedWaffle || !replyText.trim()) return;

    try {
      const reply = await apiService.addReply(selectedWaffle.id, replyText);
      
      // Update the waffle with the new reply
      const updatedWaffle = {
        ...selectedWaffle,
        replies: [...selectedWaffle.replies, reply],
        repliesCount: selectedWaffle.repliesCount + 1
      };
      
      setSelectedWaffle(updatedWaffle);
      setActiveWaffles(prev => 
        prev.map(w => w.id === selectedWaffle.id ? updatedWaffle : w)
      );
      setReplyText('');
      
      Alert.alert('Reply Sent! 🧇', 'Your reply has been added to the waffle.');
    } catch (error) {
      console.error('Failed to send reply:', error);
      Alert.alert('Error', 'Failed to send reply. Please try again.');
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading active waffles...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (selectedWaffle) {
    const repliesRemaining = selectedWaffle.maxReplies - selectedWaffle.repliesCount;
    const canReply = repliesRemaining > 0;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.threadHeader}>
          <Button
            title=""
            onPress={handleBackToList}
            variant="ghost"
            size="small"
            style={styles.backButton}
          />
          <Text style={styles.threadTitle}>Waffle Thread</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.threadContent}>
          <Card style={styles.promptCard}>
            <Text style={styles.promptLabel}>Prompt</Text>
            <Text style={styles.promptText}>{selectedWaffle.prompt?.text}</Text>
          </Card>

          <View style={styles.repliesSection}>
            <Text style={styles.repliesHeader}>
              Replies ({selectedWaffle.repliesCount}/{selectedWaffle.maxReplies})
            </Text>
            
            {selectedWaffle.replies.map((reply) => (
              <Card key={reply.id} style={styles.replyCard}>
                <View style={styles.replyHeader}>
                  <Avatar 
                    source={reply.user?.avatarUrl} 
                    name={reply.user?.name}
                    size={28}
                  />
                  <View style={styles.replyUserInfo}>
                    <Text style={styles.replyUserName}>{reply.user?.name}</Text>
                    <Text style={styles.replyTime}>{formatTimeAgo(reply.createdAt)}</Text>
                  </View>
                </View>
                <Text style={styles.replyText}>{reply.text}</Text>
              </Card>
            ))}
          </View>
        </ScrollView>

        {canReply && (
          <View style={styles.replyInputContainer}>
            <Input
              value={replyText}
              onChangeText={setReplyText}
              placeholder="Share your thoughts..."
              multiline
              numberOfLines={3}
              style={styles.replyInput}
              containerStyle={styles.replyInputWrapper}
            />
            <Button
              title="Send"
              onPress={handleSendReply}
              disabled={!replyText.trim()}
              size="small"
              style={styles.sendButton}
            />
          </View>
        )}

        {!canReply && (
          <View style={styles.noMoreReplies}>
            <Text style={styles.noMoreRepliesText}>
              No more replies remaining for this waffle
            </Text>
          </View>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Active Waffles</Text>
          <Text style={styles.subtitle}>Your ongoing conversations</Text>
        </View>

        {activeWaffles.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No active waffles</Text>
            <Text style={styles.emptySubtitle}>
              Order some prompts from the Café to start conversations with your friends!
            </Text>
            <Button
              title="Go to Café"
              onPress={() => router.push('/(tabs)/')}
              style={styles.cafeButton}
            />
          </View>
        ) : (
          <View style={styles.wafflesList}>
            {activeWaffles.map((waffle) => (
              <WaffleCard
                key={waffle.id}
                waffle={waffle}
                onPress={handleWafflePress}
                showSender={waffle.senderId !== '1'} // Show sender if not current user
              />
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
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  cafeButton: {
    paddingHorizontal: 32,
  },
  wafflesList: {
    paddingBottom: 24,
  },
  
  // Thread view styles
  threadHeader: {
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
  threadTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  threadContent: {
    flex: 1,
    padding: 16,
  },
  promptCard: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: Colors.surface,
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
  repliesSection: {
    flex: 1,
  },
  repliesHeader: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  replyCard: {
    marginBottom: 16,
    padding: 16,
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  replyUserInfo: {
    marginLeft: 12,
    flex: 1,
  },
  replyUserName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
  },
  replyTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    marginTop: 2,
  },
  replyText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: Colors.text.primary,
    lineHeight: 22,
  },
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    backgroundColor: Colors.background,
  },
  replyInputWrapper: {
    flex: 1,
    marginRight: 12,
    marginBottom: 0,
  },
  replyInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  sendButton: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  noMoreReplies: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    backgroundColor: Colors.surface,
  },
  noMoreRepliesText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.text.secondary,
  },
});