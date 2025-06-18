import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NotificationPayload } from '@/types';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  async initialize() {
    if (Platform.OS === 'web') {
      console.log('Push notifications not available on web');
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Push token:', token);
    return token;
  }

  async scheduleWaffleNotification(scheduledAt: Date, payload: NotificationPayload) {
    if (Platform.OS === 'web') {
      console.log('Scheduled notification (web fallback):', payload);
      return;
    }

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: payload.title,
        body: payload.body,
        data: payload,
      },
      trigger: {
        date: scheduledAt,
      },
    });

    return identifier;
  }

  async sendImmediateNotification(payload: NotificationPayload) {
    if (Platform.OS === 'web') {
      console.log('Immediate notification (web fallback):', payload);
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: payload.title,
        body: payload.body,
        data: payload,
      },
      trigger: null,
    });
  }

  async cancelScheduledNotification(identifier: string) {
    if (Platform.OS === 'web') return;
    await Notifications.cancelScheduledNotificationAsync(identifier);
  }

  setupNotificationListener(onNotificationReceived: (notification: any) => void) {
    const subscription = Notifications.addNotificationReceivedListener(onNotificationReceived);
    return subscription;
  }

  setupNotificationResponseListener(onNotificationResponse: (response: any) => void) {
    const subscription = Notifications.addNotificationResponseReceivedListener(onNotificationResponse);
    return subscription;
  }
}

export const notificationService = new NotificationService();