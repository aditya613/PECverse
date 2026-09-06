import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Image, ScrollView, Platform, ActivityIndicator, KeyboardAvoidingView, Alert, ActionSheetIOS } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTheme } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { createLostAndFoundItem } from '@/utils/lostAndFoundApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function PostLostFoundScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [type, setType] = useState<'lost' | 'found'>('lost');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('type', type);
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      if (location.trim()) formData.append('location', location.trim());
      formData.append('date_lost_or_found', date.toISOString().split('T')[0]);

      if (imageUri) {
        const filename = imageUri.split('/').pop() || 'item.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const typeMatch = match ? `image/${match[1]}` : `image/jpeg`;
        
        formData.append('image', {
          uri: imageUri,
          name: filename,
          type: typeMatch,
        } as any);
      }

      return createLostAndFoundItem(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lostAndFound'] });
      router.back();
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to post item. Please check your connection.');
    }
  });

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Camera Permission', 'Camera access was not granted. You can still post without a photo!');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (e: any) {
      console.log('Camera error:', e);
      Alert.alert('Camera', 'Unable to open camera. You can choose from gallery or continue without a photo.');
    }
  };

  const pickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Photo Access', 'Photo library access was not granted. You can still post without a photo!');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (e: any) {
      console.log('Gallery error:', e);
      Alert.alert('Photo Library', 'Unable to open photos. You can still post your item without a photo.');
    }
  };

  const handleImageOptions = () => {
    if (Platform.OS === 'ios') {
      const options = ['Cancel', '📷 Take Photo', '🖼️ Choose from Library'];
      if (imageUri) options.push('🗑️ Remove Photo');

      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: 0,
          destructiveButtonIndex: imageUri ? 3 : undefined,
          tintColor: colors.accent,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) takePhoto();
          if (buttonIndex === 2) pickFromGallery();
          if (buttonIndex === 3 && imageUri) setImageUri(null);
        }
      );
    } else {
      const buttons: any[] = [
        { text: '📷 Take Photo', onPress: takePhoto },
        { text: '🖼️ Choose from Gallery', onPress: pickFromGallery },
      ];
      if (imageUri) {
        buttons.push({ text: '🗑️ Remove Photo', onPress: () => setImageUri(null), style: 'destructive' });
      }
      buttons.push({ text: 'Cancel', style: 'cancel' });

      Alert.alert('Attach Photo (Optional)', 'Select photo source:', buttons);
    }
  };

  const handlePost = () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Required Fields', 'Please enter a title and description.');
      return;
    }
    mutation.mutate();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.systemBackground }]}>
      <Stack.Screen 
        options={{ 
          title: 'Report Item',
          headerShown: true,
          headerStyle: { backgroundColor: colors.cardBackground },
          headerTintColor: colors.label,
          headerRight: () => (
            <Pressable onPress={handlePost} disabled={mutation.isPending}>
              {mutation.isPending ? (
                <ActivityIndicator color={colors.accent} />
              ) : (
                <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 16 }}>Post</Text>
              )}
            </Pressable>
          ),
          headerLeft: () => (
            <Pressable onPress={() => router.back()}>
              <Text style={{ color: colors.label, fontSize: 16 }}>Cancel</Text>
            </Pressable>
          ),
        }} 
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.typeSelector}>
            <Pressable 
              style={[styles.typeBtn, type === 'lost' ? { backgroundColor: '#EF4444' } : { backgroundColor: colors.secondarySystemBackground }]}
              onPress={() => setType('lost')}
            >
              <Text style={[styles.typeText, type === 'lost' ? { color: '#FFF' } : { color: colors.label }]}>Lost</Text>
            </Pressable>
            <Pressable 
              style={[styles.typeBtn, type === 'found' ? { backgroundColor: '#10B981' } : { backgroundColor: colors.secondarySystemBackground }]}
              onPress={() => setType('found')}
            >
              <Text style={[styles.typeText, type === 'found' ? { color: '#FFF' } : { color: colors.label }]}>Found</Text>
            </Pressable>
          </View>

          <Pressable 
            style={[styles.imagePicker, { backgroundColor: colors.secondarySystemBackground, borderColor: colors.cardBorder }]} 
            onPress={handleImageOptions}
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera-outline" size={32} color={colors.secondaryLabel} />
                <Text style={[styles.imagePlaceholderText, { color: colors.secondaryLabel }]}>Add a Photo (Optional)</Text>
              </View>
            )}
          </Pressable>

          <View style={[styles.inputGroup, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            <TextInput
              style={[styles.titleInput, { color: colors.label, borderBottomColor: colors.separator }]}
              placeholder={`What did you ${type}?`}
              placeholderTextColor={colors.tertiaryLabel}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
            <TextInput
              style={[styles.descriptionInput, { color: colors.label }]}
              placeholder="Add a detailed description..."
              placeholderTextColor={colors.tertiaryLabel}
              value={description}
              onChangeText={setDescription}
              multiline
              maxLength={1000}
              textAlignVertical="top"
            />
          </View>

          <View style={[styles.inputGroup, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
            <View style={[styles.rowInput, { borderBottomColor: colors.separator }]}>
              <Ionicons name="location-outline" size={20} color={colors.secondaryLabel} style={styles.rowIcon} />
              <TextInput
                style={[styles.rowTextInput, { color: colors.label }]}
                placeholder="Location (e.g., L-29, Nescafe)"
                placeholderTextColor={colors.tertiaryLabel}
                value={location}
                onChangeText={setLocation}
                maxLength={100}
              />
            </View>
            
            <Pressable style={styles.rowInput} onPress={() => setShowDatePicker(true)}>
              <Ionicons name="calendar-outline" size={20} color={colors.secondaryLabel} style={styles.rowIcon} />
              <Text style={[styles.rowTextInput, { color: colors.label }]}>
                {date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </Text>
            </Pressable>
          </View>

          {showDatePicker && (
            <View style={Platform.OS === 'ios' ? { backgroundColor: colors.cardBackground, borderRadius: 12, padding: 8, marginTop: 8 } : undefined}>
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                maximumDate={new Date()}
                onChange={(event, selectedDate) => {
                  if (Platform.OS === 'android') {
                    setShowDatePicker(false);
                  }
                  if (selectedDate) setDate(selectedDate);
                }}
              />
              {Platform.OS === 'ios' && (
                <Pressable 
                  style={{ alignSelf: 'flex-end', padding: 8 }}
                  onPress={() => setShowDatePicker(false)}
                >
                  <Text style={{ color: colors.accent, fontWeight: '700' }}>Done</Text>
                </Pressable>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  typeText: {
    fontSize: 16,
    fontWeight: '700',
  },
  imagePicker: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  imagePlaceholderText: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputGroup: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '600',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  descriptionInput: {
    fontSize: 15,
    padding: 16,
    height: 120,
  },
  rowInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowIcon: {
    marginRight: 12,
  },
  rowTextInput: {
    flex: 1,
    fontSize: 15,
  },
});
