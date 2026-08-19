import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Pressable, Image, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFresherStore } from '@/stores/useFresherStore';

interface EicRegistrationModalProps {
  visible: boolean;
  onClose: () => void;
}

const mapBranchToEIC = (branch: string) => {
  switch (branch) {
    case 'CSE': return 'Computer Science & Engineering (CSE)';
    case 'AI': 
    case 'DS': return 'Artificial Intelligence & Data Science (AI & DS)';
    case 'ECE': 
    case 'VLSI': return 'Electronics & Communication Engineering (ECE)';
    case 'Electrical': return 'Electrical Engineering (EE)';
    case 'Mechanical': return 'Mechanical Engineering (ME)';
    case 'Civil': return 'Civil Engineering (CE)';
    case 'AERO': return 'Aerospace Engineering (Aero)';
    case 'Metallurgy': return 'Metallurgical & Materials Engineering (Meta)';
    case 'Production': return 'Production & Industrial Engineering (Prod)';
    case 'B.Design': return 'Design & Innovation';
    default: return 'Other / PG / PhD';
  }
};

export const EicRegistrationModal: React.FC<EicRegistrationModalProps> = ({ visible, onClose }) => {
  const { fresher } = useFresherStore();
  const [sid, setSid] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!sid.trim()) return Alert.alert('Missing Field', 'Please enter your SID / Roll Number.');
    if (!email.trim() || !email.includes('@')) return Alert.alert('Invalid Email', 'Please enter a valid email address.');
    if (!phone.trim() || phone.replace(/\D/g, '').length !== 10) return Alert.alert('Invalid Phone', 'Please enter a valid 10-digit WhatsApp number.');
    
    if (!fresher?.name || !fresher?.branch) {
        return Alert.alert('Error', 'Your profile details are missing. Please re-login.');
    }

    setIsSubmitting(true);

    try {
      const payload = {
        fullName: fresher.name,
        sid: sid.trim(),
        email: email.trim().toLowerCase(),
        phoneNumber: phone.replace(/\D/g, ''),
        branch: mapBranchToEIC(fresher.branch)
      };

      const res = await fetch('https://eic-website-alpha.vercel.app/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        if (res.status === 409) {
          // Already registered, that's fine, mark as done
          await AsyncStorage.setItem('eic_registered', 'true');
          Alert.alert('Already Registered!', 'You have already registered for EIC. Good luck!', [{ text: 'OK', onPress: onClose }]);
          return;
        }
        throw new Error(json.error || 'Registration failed');
      }

      await AsyncStorage.setItem('eic_registered', 'true');
      Alert.alert('Registration Successful! 🎉', `Welcome to EIC! Your Application Number is ${json.data.applicationNumber}`, [{ text: 'Awesome!', onPress: onClose }]);
      
    } catch (err: any) {
      Alert.alert('Submission Error', err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <KeyboardAvoidingView 
        style={styles.modalOverlay} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            {/* Retro Banner */}
            <View style={styles.bannerContainer}>
              <Image 
                source={require('@/assets/images/eic_banner.png')} 
                style={styles.bannerImage}
                resizeMode="cover"
              />
              <Pressable style={styles.closeButton} onPress={onClose} hitSlop={15}>
                <Text style={styles.closeText}>X</Text>
              </Pressable>
            </View>

            <View style={styles.formContainer}>
              <Text style={styles.retroTitle}>LEVEL UP YOUR FUTURE</Text>
              <Text style={styles.retroSubtitle}>Enter your details below to register for the EIC Induction.</Text>

              {/* Pre-filled read-only fields */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>PLAYER NAME</Text>
                <View style={styles.readOnlyInput}>
                  <Text style={styles.readOnlyText}>{fresher?.name || 'N/A'}</Text>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>FACTION (BRANCH)</Text>
                <View style={styles.readOnlyInput}>
                  <Text style={styles.readOnlyText}>{fresher?.branch ? mapBranchToEIC(fresher.branch) : 'N/A'}</Text>
                </View>
              </View>

              {/* Editable fields */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>SID / ROLL NO.</Text>
                <TextInput
                  style={styles.retroInput}
                  value={sid}
                  onChangeText={setSid}
                  placeholder="e.g. 24103045"
                  placeholderTextColor="#777"
                  keyboardType="numeric"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>EMAIL ADDRESS</Text>
                <TextInput
                  style={styles.retroInput}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="name.branch24@pec.edu.in"
                  placeholderTextColor="#777"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>WHATSAPP NO.</Text>
                <TextInput
                  style={styles.retroInput}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="10-digit number"
                  placeholderTextColor="#777"
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>

              <Pressable 
                style={({ pressed }) => [styles.submitButton, pressed && styles.submitButtonPressed]} 
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.submitText}>PRESS START ▶</Text>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 450,
    backgroundColor: '#1B1E1C', // Dark retro background
    borderWidth: 4,
    borderColor: '#4A5043',
    maxHeight: '90%',
  },
  bannerContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
    borderBottomWidth: 4,
    borderBottomColor: '#4A5043',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    backgroundColor: '#E63946',
    borderWidth: 2,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 10,
  },
  closeText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 16,
  },
  formContainer: {
    padding: 20,
  },
  retroTitle: {
    color: '#E66E19', // Orange accent
    fontSize: 22,
    fontWeight: '900',
    fontFamily: Platform.OS === 'ios' ? 'Courier-Bold' : 'monospace',
    textAlign: 'center',
    marginBottom: 5,
  },
  retroSubtitle: {
    color: '#A8B09F',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    color: '#E66E19',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier-Bold' : 'monospace',
    marginBottom: 5,
  },
  readOnlyInput: {
    backgroundColor: '#2A2E2C',
    borderWidth: 2,
    borderColor: '#4A5043',
    padding: 12,
  },
  readOnlyText: {
    color: '#777',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  retroInput: {
    backgroundColor: '#121413',
    borderWidth: 2,
    borderColor: '#E66E19',
    padding: 12,
    color: '#FFF',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#E66E19',
    padding: 15,
    borderWidth: 3,
    borderColor: '#FFF',
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonPressed: {
    backgroundColor: '#C55A12',
    transform: [{ translateY: 2 }],
  },
  submitText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier-Bold' : 'monospace',
  }
});
