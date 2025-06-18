import { Prompt } from '@/types';

export const DEFAULT_PROMPTS: Omit<Prompt, 'id' | 'createdAt'>[] = [
  // Proud
  {
    category: 'Proud',
    text: 'What\'s something you accomplished this week that you\'re genuinely proud of?',
    preview: 'Share a recent achievement'
  },
  {
    category: 'Proud',
    text: 'Tell me about a moment when you surprised yourself with your own strength.',
    preview: 'A moment of unexpected strength'
  },
  {
    category: 'Proud',
    text: 'What\'s a skill you\'ve been developing that\'s starting to pay off?',
    preview: 'Growing skills and progress'
  },

  // Challenges
  {
    category: 'Challenges',
    text: 'What\'s been weighing on your mind lately, and how are you dealing with it?',
    preview: 'Current struggles and coping'
  },
  {
    category: 'Challenges',
    text: 'Describe a situation where you had to step way outside your comfort zone.',
    preview: 'Comfort zone challenges'
  },
  {
    category: 'Challenges',
    text: 'What\'s something you\'re struggling to understand about yourself right now?',
    preview: 'Personal puzzles and growth'
  },

  // Fun
  {
    category: 'Fun',
    text: 'If you could master any completely useless skill, what would it be?',
    preview: 'Hilariously useless talents'
  },
  {
    category: 'Fun',
    text: 'What\'s the weirdest thing that made you laugh this week?',
    preview: 'Recent comedy gold'
  },
  {
    category: 'Fun',
    text: 'Design your dream Saturday morning routine with unlimited budget.',
    preview: 'Perfect weekend fantasy'
  },

  // Sad
  {
    category: 'Sad',
    text: 'What\'s something you miss that you know you can\'t get back?',
    preview: 'Processing loss and nostalgia'
  },
  {
    category: 'Sad',
    text: 'Tell me about a time when you felt completely misunderstood.',
    preview: 'Feeling unseen or unheard'
  },
  {
    category: 'Sad',
    text: 'What would you want to say to your younger self during their hardest moment?',
    preview: 'Wisdom for past pain'
  },

  // Gratitude
  {
    category: 'Gratitude',
    text: 'Who\'s someone that made your life better just by being in it?',
    preview: 'Celebrating important people'
  },
  {
    category: 'Gratitude',
    text: 'What\'s something ordinary that you\'re secretly grateful for?',
    preview: 'Hidden everyday blessings'
  },
  {
    category: 'Gratitude',
    text: 'Describe a moment when a stranger\'s kindness caught you off guard.',
    preview: 'Unexpected human goodness'
  },

  // Deep 
  {
    category: 'Deep Thought',
    text: 'What belief about life have you completely changed your mind about?',
    preview: 'Evolving life philosophy'
  },
  {
    category: 'Deep Thought',
    text: 'If you could know the absolute truth about one thing, what would you choose?',
    preview: 'Ultimate truth seeking'
  },
  {
    category: 'Deep Thought',
    text: 'What do you think your purpose is, and how has that evolved?',
    preview: 'Life purpose and meaning'
  }
];