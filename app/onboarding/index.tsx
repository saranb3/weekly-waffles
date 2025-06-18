import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function OnboardingScreen() {
  const [step, setStep] = useState(1);
  const [cadence, setCadence] = useState(3);
  const [windowStart, setWindowStart] = useState('09:00');
  const [windowEnd, setWindowEnd] = useState('17:00');
  const [inviteEmails, setInviteEmails] = useState(['']);

  const formatCadence = (value: number) => {
    return value === 1 ? '1 waffle/week' : `${value} waffles/week`;
  };

  const addEmailField = () => {
    if (inviteEmails.length < 20) {
      setInviteEmails([...inviteEmails, '']);
    }
  };

  const updateEmail = (index: number, email: string) => {
    const updated = [...inviteEmails];
    updated[index] = email;
    setInviteEmails(updated);
  };

  const removeEmail = (index: number) => {
    if (inviteEmails.length > 1) {
      const updated = inviteEmails.filter((_, i) => i !== index);
      setInviteEmails(updated);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      router.replace('/(tabs)');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.title}>How often do you want to waffle?</Text>
            <Text style={styles.subtitle}>
              Choose how many prompts you'd like to receive each week
            </Text>
            
            <Card style={styles.sliderCard}>
              <Slider
                min={1}
                max={7}
                value={cadence}
                onChange={setCadence}
                formatValue={formatCadence}
              />
            </Card>
            
            <Text style={styles.description}>
              We'll spread your waffles evenly throughout the week during your preferred time window.
            </Text>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.title}>When should we deliver?</Text>
            <Text style={styles.subtitle}>
              Set your daily time window for receiving waffles
            </Text>
            
            <Card style={styles.timeCard}>
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>Start time</Text>
                <Input
                  value={windowStart}
                  onChangeText={setWindowStart}
                  placeholder="09:00"
                  style={styles.timeInput}
                />
              </View>
              
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>End time</Text>
                <Input
                  value={windowEnd}
                  onChangeText={setWindowEnd}
                  placeholder="17:00"
                  style={styles.timeInput}
                />
              </View>
            </Card>
            
            <Text style={styles.description}>
              Your waffles will only be delivered during these hours on scheduled days.
            </Text>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.title}>Invite your inner circle</Text>
            <Text style={styles.subtitle}>
              Add up to 20 friends to share waffles with
            </Text>
            
            <Card style={styles.inviteCard}>
              <ScrollView style={styles.emailList}>
                {inviteEmails.map((email, index) => (
                  <View key={index} style={styles.emailRow}>
                    <Input
                      value={email}
                      onChangeText={(text) => updateEmail(index, text)}
                      placeholder="friend@example.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      containerStyle={styles.emailInput}
                    />
                    {inviteEmails.length > 1 && (
                      <Button
                        title="Remove"
                        onPress={() => removeEmail(index)}
                        variant="ghost"
                        size="small"
                      />
                    )}
                  </View>
                ))}
              </ScrollView>
              
              {inviteEmails.length < 20 && (
                <Button
                  title="Add another friend"
                  onPress={addEmailField}
                  variant="outline"
                  size="small"
                  style={styles.addButton}
                />
              )}
            </Card>
            
            <Text style={styles.description}>
              Don't worry, you can always add more friends later in settings.
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>🧇</Text>
          <Text style={styles.appName}>Waffle</Text>
          <Text style={styles.stepIndicator}>Step {step} of 3</Text>
        </View>

        {renderStep()}

        <View style={styles.footer}>
          {step > 1 && (
            <Button
              title="Back"
              onPress={() => setStep(step - 1)}
              variant="ghost"
              style={styles.backButton}
            />
          )}
          <Button
            title={step === 3 ? "Let's Waffle!" : "Next"}
            onPress={handleNext}
            style={styles.nextButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
  },
  logo: {
    fontSize: 48,
    marginBottom: 8,
  },
  appName: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: Colors.text.primary,
    marginBottom: 16,
  },
  stepIndicator: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.text.secondary,
  },
  stepContent: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 20,
  },
  sliderCard: {
    padding: 24,
    alignItems: 'center',
  },
  timeCard: {
    padding: 24,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: Colors.text.primary,
    flex: 1,
  },
  timeInput: {
    flex: 1,
    marginLeft: 16,
  },
  inviteCard: {
    padding: 24,
  },
  emailList: {
    maxHeight: 300,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emailInput: {
    flex: 1,
    marginRight: 8,
    marginBottom: 0,
  },
  addButton: {
    marginTop: 16,
    alignSelf: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 32,
  },
  backButton: {
    flex: 1,
    marginRight: 16,
  },
  nextButton: {
    flex: 2,
  },
});