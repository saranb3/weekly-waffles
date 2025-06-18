import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Waffle } from '@/types';
import { Colors } from '@/constants/Colors';
import { Card } from './ui/Card';
import { Avatar } from './ui/Avatar';
import { Lock, Play, MessageCircle } from 'lucide-react-native';

interface WaffleCardProps {
  waffle: Waffle;
  onPress: (waffle: Waffle) => void;
  showSender?: boolean;
}

export function WaffleCard({ waffle, onPress, showSender = true }: WaffleCardProps) {
  const timeAgo = getTimeAgo(waffle.createdAt);
  const repliesRemaining = waffle.maxReplies - waffle.repliesCount;
  
  return (
    <TouchableOpacity onPress={() => onPress(waffle)} activeOpacity={0.8}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.user}>
            <Avatar 
              source={showSender ? waffle.sender?.avatarUrl : waffle.recipient?.avatarUrl} 
              name={showSender ? waffle.sender?.name : waffle.recipient?.name}
              size={32}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {showSender ? waffle.sender?.name : waffle.recipient?.name}
              </Text>
              <Text style={styles.timeAgo}>{timeAgo}</Text>
            </View>
          </View>
          
          <View style={styles.status}>
            {waffle.videoUnlocked ? (
              <View style={styles.videoBadge}>
                <Play size={14} color={Colors.success} />
              </View>
            ) : (
              <View style={styles.videoBadge}>
                <Lock size={14} color={Colors.text.disabled} />
              </View>
            )}
          </View>
        </View>
        
        <Text style={styles.promptText} numberOfLines={2}>
          {waffle.prompt?.text}
        </Text>
        
        <View style={styles.footer}>
          <View style={styles.replies}>
            <MessageCircle size={16} color={Colors.text.secondary} />
            <Text style={styles.repliesText}>
              {waffle.repliesCount}/{waffle.maxReplies} replies
            </Text>
          </View>
          
          {repliesRemaining > 0 && (
            <Text style={styles.remainingText}>
              {repliesRemaining} remaining
            </Text>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
  },
  timeAgo: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    marginTop: 2,
  },
  status: {
    alignItems: 'center',
  },
  videoBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    color: Colors.text.primary,
    lineHeight: 22,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  replies: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  repliesText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    marginLeft: 6,
  },
  remainingText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.primary,
  },
});