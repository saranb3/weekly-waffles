export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  cadence: number; // 1-7 waffles per week
  windowStart: string; // HH:mm format
  windowEnd: string; // HH:mm format
  createdAt: Date;
}

export interface Prompt {
  id: string;
  category: 'Proud' | 'Challenges' | 'Fun' | 'Sad' | 'Gratitude' | 'DeepThought' | 'Custom';
  text: string;
  preview: string;
  createdAt: Date;
}

export interface Waffle {
  id: string;
  promptId: string;
  prompt?: Prompt;
  senderId: string;
  sender?: User;
  recipientId: string;
  recipient?: User;
  scheduledAt: Date;
  repliesCount: number;
  maxReplies: number;
  status: 'pending' | 'active' | 'closed';
  videoUrl?: string;
  videoUnlocked: boolean;
  replies: WaffleReply[];
  createdAt: Date;
}

export interface WaffleReply {
  id: string;
  waffleId: string;
  userId: string;
  user?: User;
  text: string;
  createdAt: Date;
}

export interface Friend {
  id: string;
  userId: string;
  friendId: string;
  friend?: User;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: Date;
}

export interface NotificationPayload {
  type: 'waffle_received' | 'video_unlocked' | 'friend_request';
  waffleId?: string;
  friendId?: string;
  title: string;
  body: string;
}