import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { router } from 'expo-router';

// Update mockFriends with local placeholder image
const mockFriends = [
  {
    id: '1',
    name: 'Team',
    avatarUrl: require('../assets/images/team.png'),
  },
  {
    id: '2',
    name: 'Tun',
    avatarUrl: require('../assets/images/tun.png'),
  },
  {
    id: '3',
    name: 'Kris',
    avatarUrl: require('../assets/images/kris.png'),
  },
];

export default function FriendsHomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>🧇</Text>
          <Text style={styles.title}>Your Waffle Friends</Text>
          <Text style={styles.subtitle}>Send a waffle to brighten someone's day!</Text>
        </View>

        <Button
          title="Order a Waffle"
          onPress={() => router.push('/cafe')}
          style={styles.orderButton}
        />

        <View style={styles.friendsSection}>
          <Text style={styles.sectionTitle}>Friends</Text>
          {mockFriends.map(friend => (
            <View key={friend.id} style={styles.friendCard}>
              <Avatar source={friend.avatarUrl} name={friend.name} size={56} />
              <Text style={styles.friendName}>{friend.name}</Text>
              <TouchableOpacity style={styles.sendButton} onPress={() => router.push({ pathname: '/cafe', params: { friendId: friend.id } })}>
                <Text style={styles.sendButtonText}>Send Waffle</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1', // Beige
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 24,
  },
  logo: {
    fontSize: 56,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A237E', // Dark blue
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFD600', // Yellow
    marginBottom: 24,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  orderButton: {
    backgroundColor: '#FFD600',
    borderRadius: 24,
    paddingVertical: 16,
    marginBottom: 32,
    shadowColor: '#1A237E',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  friendsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDE7',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#FFD600',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  friendName: {
    flex: 1,
    marginLeft: 16,
    fontSize: 18,
    color: '#1A237E',
    fontFamily: 'Inter-SemiBold',
  },
  sendButton: {
    backgroundColor: '#FFD600',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  sendButtonText: {
    color: '#1A237E',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
}); 