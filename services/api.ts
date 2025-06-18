import { User, Prompt, Waffle, WaffleReply, Friend } from '@/types';

// Mock API service - In production, replace with actual API calls
class ApiService {
  private baseUrl = 'https://api.waffle.app'; // Replace with actual API URL

  // User endpoints
  async getCurrentUser(): Promise<User> {
    // Mock current user
    return {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatarUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      cadence: 3,
      windowStart: '09:00',
      windowEnd: '17:00',
      createdAt: new Date()
    };
  }

  async updateUser(user: Partial<User>): Promise<User> {
    // Mock update
    return this.getCurrentUser();
  }

  // Prompt endpoints
  async getPrompts(category?: string): Promise<Prompt[]> {
    const { DEFAULT_PROMPTS } = await import('@/constants/Prompts');
    const prompts = DEFAULT_PROMPTS.map((prompt, index) => ({
      ...prompt,
      id: `prompt_${index + 1}`,
      createdAt: new Date()
    }));

    if (category && category !== 'All') {
      return prompts.filter(p => p.category === category);
    }
    return prompts;
  }

  async createCustomPrompt(text: string): Promise<Prompt> {
    return {
      id: `custom_${Date.now()}`,
      category: 'Custom',
      text,
      preview: text.slice(0, 50) + (text.length > 50 ? '...' : ''),
      createdAt: new Date()
    };
  }

  // Waffle endpoints
  async createWaffle(promptId: string, recipientId: string): Promise<Waffle> {
    const user = await this.getCurrentUser();
    const prompts = await this.getPrompts();
    const prompt = prompts.find(p => p.id === promptId);
    
    const waffle: Waffle = {
      id: `waffle_${Date.now()}`,
      promptId,
      prompt,
      senderId: user.id,
      sender: user,
      recipientId,
      scheduledAt: this.calculateNextSlot(user.cadence, user.windowStart),
      repliesCount: 0,
      maxReplies: 2,
      status: 'pending',
      videoUnlocked: false,
      replies: [],
      createdAt: new Date()
    };

    return waffle;
  }

  async getUpcomingWaffles(): Promise<Waffle[]> {
    // Mock upcoming waffles
    return [];
  }

  async getActiveWaffles(): Promise<Waffle[]> {
    // Mock active waffles
    const user = await this.getCurrentUser();
    const prompts = await this.getPrompts();
    
    return [
      {
        id: 'waffle_1',
        promptId: 'prompt_1',
        prompt: prompts[0],
        senderId: 'friend_1',
        sender: {
          id: 'friend_1',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          avatarUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          cadence: 2,
          windowStart: '10:00',
          windowEnd: '18:00',
          createdAt: new Date()
        },
        recipientId: user.id,
        recipient: user,
        scheduledAt: new Date(),
        repliesCount: 1,
        maxReplies: 2,
        status: 'active' as const,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        videoUnlocked: true,
        replies: [
          {
            id: 'reply_1',
            waffleId: 'waffle_1',
            userId: user.id,
            user,
            text: 'This week I finally finished my first 10K run! It took me months of training but crossing that finish line felt incredible.',
            createdAt: new Date(Date.now() - 3600000) // 1 hour ago
          }
        ],
        createdAt: new Date(Date.now() - 7200000) // 2 hours ago
      }
    ];
  }

  async getMemories(): Promise<Waffle[]> {
    // Mock memories
    return [];
  }

  async addReply(waffleId: string, text: string): Promise<WaffleReply> {
    const user = await this.getCurrentUser();
    return {
      id: `reply_${Date.now()}`,
      waffleId,
      userId: user.id,
      user,
      text,
      createdAt: new Date()
    };
  }

  // Friend endpoints
  async getFriends(): Promise<Friend[]> {
    // Mock friends
    return [
      {
        id: 'friend_1',
        userId: '1',
        friendId: 'user_2',
        friend: {
          id: 'user_2',
          name: 'Alice Johnson',
          email: 'alice@example.com',
          avatarUrl: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
          cadence: 2,
          windowStart: '10:00',
          windowEnd: '18:00',
          createdAt: new Date()
        },
        status: 'accepted',
        createdAt: new Date()
      }
    ];
  }

  async inviteFriend(email: string): Promise<Friend> {
    const user = await this.getCurrentUser();
    return {
      id: `friend_${Date.now()}`,
      userId: user.id,
      friendId: `user_${Date.now()}`,
      friend: {
        id: `user_${Date.now()}`,
        name: email.split('@')[0],
        email,
        cadence: 3,
        windowStart: '09:00',
        windowEnd: '17:00',
        createdAt: new Date()
      },
      status: 'pending',
      createdAt: new Date()
    };
  }

  // Helper methods
  private calculateNextSlot(cadence: number, windowStart: string): Date {
    const now = new Date();
    const [hours, minutes] = windowStart.split(':').map(Number);
    const nextSlot = new Date(now);
    nextSlot.setHours(hours, minutes, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (nextSlot <= now) {
      nextSlot.setDate(nextSlot.getDate() + 1);
    }
    
    return nextSlot;
  }
}

export const apiService = new ApiService();