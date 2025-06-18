import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Colors } from '@/constants/Colors';
import { User, Friend } from '@/types';
import { apiService } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Slider } from '@/components/ui/Slider';
import { Avatar } from '@/components/ui/Avatar';
import { Users, Clock, Bell, LogOut, Plus, X } from 'lucide-react-native';

export default function SettingsScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [cadence, setCadence] = useState(3);
  const [windowStart, setWindowStart] = useState('09:00');
  const [windowEnd, setWindowEnd] = useState('17:00');
  const [newFriendEmail, setNewFriendEmail] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const [userData, friendsData] = await Promise.all([
        apiService.getCurrentUser(),
        apiService.getFriends()
      ]);
      
      setUser(userData);
      setFriends(friendsData);
      setCadence(userData.cadence);
      setWindowStart(userData.windowStart);
      setWindowEnd(userData.windowEnd);
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async () => {
    if (!user) return;

    try {
      const updatedUser = await apiService.updateUser({
        ...user,
        cadence,
        windowStart,
        windowEnd
      });
      
      setUser(updatedUser);
      Alert.alert('Settings Updated', 'Your waffle preferences have been saved.');
    } catch (error) {
      console.error('Failed to update settings:', error);
      Alert.alert('Error', 'Failed to update settings. Please try again.');
    }
  };

  const handleInviteFriend = async () => {
    if (!newFriendEmail.trim()) return;

    try {
      const newFriend = await apiService.inviteFriend(newFriendEmail);
      setFriends(prev => [...prev, newFriend]);
      setNewFriendEmail('');
      setShowAddFriend(false);
      Alert.alert('Invitation Sent', `An invitation has been sent to ${newFriendEmail}`);
    } catch (error) {
      console.error('Failed to invite friend:', error);
      Alert.alert('Error', 'Failed to send invitation. Please try again.');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: () => {
          // In a real app, this would clear auth tokens and navigate to login
          console.log('Logging out...');
        }}
      ]
    );
  };

  const formatCadence = (value: number) => {
    return value === 1 ? '1 waffle/week' : `${value} waffles/week`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return Colors.success;
      case 'pending': return Colors.warning;
      case 'declined': return Colors.error;
      default: return Colors.text.secondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return 'Connected';
      case 'pending': return 'Pending';
      case 'declined': return 'Declined';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load user data</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Manage your waffle preferences</Text>
        </View>

        {/* Profile Section */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Profile</Text>
          </View>
          <View style={styles.profileInfo}>
            <Avatar 
              source={user.avatarUrl} 
              name={user.name}
              size={56}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </View>
        </Card>

        {/* Waffle Settings */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bell size={20} color={Colors.text.primary} />
            <Text style={styles.sectionTitle}>Waffle Frequency</Text>
          </View>
          <Slider
            min={1}
            max={7}
            value={cadence}
            onChange={setCadence}
            formatValue={formatCadence}
            style={styles.sliderContainer}
          />
        </Card>

        {/* Time Window Settings */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={20} color={Colors.text.primary} />
            <Text style={styles.sectionTitle}>Delivery Window</Text>
          </View>
          <View style={styles.timeSettings}>
            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>Start time</Text>
              <Input
                value={windowStart}
                onChangeText={setWindowStart}
                placeholder="09:00"
                style={styles.timeInput}
                containerStyle={styles.timeInputContainer}
              />
            </View>
            <View style={styles.timeRow}>
              <Text style={styles.timeLabel}>End time</Text>
              <Input
                value={windowEnd}
                onChangeText={setWindowEnd}
                placeholder="17:00"
                style={styles.timeInput}
                containerStyle={styles.timeInputContainer}
              />
            </View>
          </View>
          <Button
            title="Save Changes"
            onPress={handleUpdateSettings}
            style={styles.saveButton}
          />
        </Card>

        {/* Friends Management */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={20} color={Colors.text.primary} />
            <Text style={styles.sectionTitle}>Friends ({friends.length}/20)</Text>
            <Button
              title=""
              onPress={() => setShowAddFriend(!showAddFriend)}
              variant="ghost"
              size="small"
              style={styles.addFriendButton}
            />
          </View>

          {showAddFriend && (
            <View style={styles.addFriendSection}>
              <Input
                value={newFriendEmail}
                onChangeText={setNewFriendEmail}
                placeholder="friend@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                containerStyle={styles.friendEmailInput}
              />
              <View style={styles.addFriendActions}>
                <Button
                  title="Cancel"
                  onPress={() => {
                    setShowAddFriend(false);
                    setNewFriendEmail('');
                  }}
                  variant="ghost"
                  size="small"
                  style={styles.cancelButton}
                />
                <Button
                  title="Send Invite"
                  onPress={handleInviteFriend}
                  disabled={!newFriendEmail.trim()}
                  size="small"
                  style={styles.inviteButton}
                />
              </View>
            </View>
          )}

          <View style={styles.friendsList}>
            {friends.length === 0 ? (
              <Text style={styles.emptyFriends}>
                No friends added yet. Tap + to invite your first friend!
              </Text>
            ) : (
              friends.map((friend) => (
                <View key={friend.id} style={styles.friendItem}>
                  <Avatar 
                    source={friend.friend?.avatarUrl} 
                    name={friend.friend?.name}
                    size={40}
                  />
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName}>{friend.friend?.name}</Text>
                    <Text style={styles.friendEmail}>{friend.friend?.email}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(friend.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(friend.status)}</Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </Card>

        {/* Logout */}
        <Card style={styles.section}>
          <Button
            title="Log Out"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
            textStyle={styles.logoutText}
          />
        </Card>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.error,
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
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  
  // Profile styles
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
  },
  
  // Slider styles
  sliderContainer: {
    alignItems: 'center',
  },
  
  // Time settings styles
  timeSettings: {
    marginBottom: 16,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timeLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.text.primary,
    flex: 1,
  },
  timeInput: {
    textAlign: 'center',
  },
  timeInputContainer: {
    flex: 1,
    marginLeft: 16,
    marginBottom: 0,
  },
  saveButton: {
    alignSelf: 'center',
    paddingHorizontal: 32,
  },
  
  // Friends styles
  addFriendButton: {
    width: 32,
    height: 32,
  },
  addFriendSection: {
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  friendEmailInput: {
    marginBottom: 12,
  },
  addFriendActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    marginRight: 12,
  },
  inviteButton: {
    paddingHorizontal: 20,
  },
  friendsList: {
    flex: 1,
  },
  emptyFriends: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  friendInfo: {
    marginLeft: 12,
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  friendEmail: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: Colors.text.inverse,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // Logout styles
  logoutButton: {
    borderColor: Colors.error,
  },
  logoutText: {
    color: Colors.error,
  },
});