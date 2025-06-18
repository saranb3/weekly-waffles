import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
// import { Camera } from 'expo-camera';
// import { useCameraPermissions } from 'expo-camera';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { ArrowLeft } from 'lucide-react-native';

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

const MAX_DURATION = 30; // seconds

export default function RecordScreen() {
  const params = useLocalSearchParams();
  const promptText = params.promptText as string;
  const [isRecording, setIsRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [selectedFriends, setSelectedFriends] = useState<string[]>(params.friendId ? [params.friendId as string] : []);
  const [timer, setTimer] = useState(0);
  const cameraRef = useRef<any>(null);
  // const [permission, requestPermission] = useCameraPermissions();
  // const hasPermission = permission?.granted;

  useEffect(() => {
    // if (!hasPermission) {
    //   requestPermission();
    // }
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer((t) => {
          if (t >= MAX_DURATION) {
            handleStopRecording();
            return t;
          }
          return t + 1;
        });
      }, 1000);
    } else if (!isRecording && timer !== 0) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const handleStartRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(true);
      setTimer(0);
      setRecorded(false);
      try {
        const video = await cameraRef.current.recordAsync({ maxDuration: MAX_DURATION, quality: "480p" });
        setVideoUri(video.uri);
        setRecorded(true);
      } catch (e) {
        // handle error
      }
      setIsRecording(false);
    }
  };

  const handleStopRecording = async () => {
    if (cameraRef.current && isRecording) {
      await cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  const handleToggleFriend = (id: string) => {
    setSelectedFriends(f => f.includes(id) ? f.filter(fid => fid !== id) : [...f, id]);
  };

  const handleSend = () => {
    // Mock send action
    alert(`Waffle sent to: ${selectedFriends.map(id => mockFriends.find(f => f.id === id)?.name).join(', ')}`);
    router.replace('/friends');
  };

  if (/* hasPermission === null */ false) {
    return <View style={styles.permissionContainer}><Text>Requesting camera permission...</Text></View>;
  }
  if (/* hasPermission === false */ false) {
    return <View style={styles.permissionContainer}><Text>No access to camera</Text></View>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={28} color={'#1A237E'} />
        </TouchableOpacity>
      </View>
      <View style={styles.cameraContainer}>
        {/* Camera feature is only available in a custom dev build. */}
        <View style={[styles.camera, {alignItems: 'center', justifyContent: 'center'}]}>
          <Text style={{ color: '#1A237E', textAlign: 'center' }}>
            Camera feature is only available in a custom dev build.\nPlease use Expo Go for other features.
          </Text>
        </View>
        {recorded && videoUri && (
          <View style={styles.videoPreview}><Text style={{ color: '#1A237E', textAlign: 'center' }}>Video recorded! (Preview not implemented)</Text></View>
        )}
      </View>
      <View style={styles.promptSection}>
        <Text style={styles.promptLabel}>Prompt</Text>
        <Text style={styles.promptText}>{promptText}</Text>
      </View>
      <View style={styles.recorderSection}>
        {!recorded ? (
          <>
            <TouchableOpacity
              style={[styles.recordButton, isRecording && styles.recording]}
              onPress={isRecording ? handleStopRecording : handleStartRecording}
              disabled={isRecording && timer >= MAX_DURATION}
            >
              <Text style={styles.recordButtonText}>{isRecording ? 'Stop' : 'Record'}</Text>
            </TouchableOpacity>
            <Text style={styles.timerText}>
              {isRecording ? `Time left: ${MAX_DURATION - timer}s` : `Max: ${MAX_DURATION}s`}
            </Text>
          </>
        ) : null}
      </View>
      {recorded && (
        <View style={styles.friendsSection}>
          <Text style={styles.sectionTitle}>Send to Friends</Text>
          <FlatList
            data={mockFriends}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.friendRow} onPress={() => handleToggleFriend(item.id)}>
                <Avatar source={item.avatarUrl} name={item.name} size={40} />
                <Text style={styles.friendName}>{item.name}</Text>
                <View style={[styles.checkbox, selectedFriends.includes(item.id) && styles.checkboxChecked]}>
                  {selectedFriends.includes(item.id) && <Text style={styles.checkboxTick}>✓</Text>}
                </View>
              </TouchableOpacity>
            )}
          />
          <Button
            title="Send Waffle"
            onPress={handleSend}
            disabled={selectedFriends.length === 0}
            style={styles.sendButton}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF8E1',
  },
  header: {
    position: 'relative',
    height: 60,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 10,
    padding: 12,
    zIndex: 10,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 16,
    minHeight: 200,
    maxHeight: 260,
  },
  camera: {
    width: '100%',
    height: 220,
    borderRadius: 18,
    overflow: 'hidden',
  },
  videoPreview: {
    width: '100%',
    height: 220,
    borderRadius: 18,
    backgroundColor: '#FFFDE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  promptSection: {
    marginTop: 24,
    marginBottom: 12,
    backgroundColor: '#FFFDE7',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
  },
  promptLabel: {
    fontSize: 14,
    color: '#FFD600',
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  promptText: {
    fontSize: 18,
    color: '#1A237E',
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  recorderSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  recordButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFD600',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#1A237E',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  recording: {
    backgroundColor: '#FF7043',
  },
  recordButtonText: {
    color: '#1A237E',
    fontWeight: 'bold',
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  timerText: {
    fontSize: 16,
    color: '#1A237E',
    fontFamily: 'Inter-Medium',
    marginTop: 4,
  },
  friendsSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A237E',
    marginBottom: 12,
    fontFamily: 'Inter-Bold',
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFDE7',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  friendName: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: '#1A237E',
    fontFamily: 'Inter-SemiBold',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFD600',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF8E1',
  },
  checkboxChecked: {
    backgroundColor: '#FFD600',
  },
  checkboxTick: {
    color: '#1A237E',
    fontWeight: 'bold',
    fontSize: 18,
  },
  sendButton: {
    backgroundColor: '#FFD600',
    borderRadius: 24,
    paddingVertical: 16,
    marginTop: 16,
    shadowColor: '#1A237E',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
}); 