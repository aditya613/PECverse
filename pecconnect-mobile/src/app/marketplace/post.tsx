import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActionSheetIOS,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/theme/colors';
import {
  createMarketplaceItem,
  MarketplaceCategory,
  MarketplaceCondition,
} from '@/utils/marketplaceApi';

const CATEGORIES: { id: MarketplaceCategory; label: string; icon: string }[] = [
  { id: 'cycles', label: '🚲 Cycle', icon: 'bicycle' },
  { id: 'academics', label: '📐 Academics & Drafter', icon: 'book' },
  { id: 'hostel', label: '🛏️ Hostel Essentials', icon: 'bed' },
  { id: 'electronics', label: '💻 Electronics', icon: 'hardware-chip' },
  { id: 'fashion', label: '🥼 Lab Coat & Wear', icon: 'shirt' },
  { id: 'others', label: '🏷️ Others', icon: 'grid' },
];

const CONDITIONS: { id: MarketplaceCondition; label: string; desc: string }[] = [
  { id: 'like_new', label: '✨ Like New', desc: 'Barely used, zero flaws' },
  { id: 'good', label: '👍 Good', desc: 'Minor signs of use, fully functional' },
  { id: 'fair', label: '👌 Fair', desc: 'Well used but works fine' },
];

const QUICK_LOCATIONS = [
  'Aravali Hostel',
  'Shivalik Hostel',
  'Himalaya Hostel',
  'Kurukshetra Hostel',
  'Kalpana Chawla Hostel',
  'Vindhya Hostel',
  'Nescafe / StuC',
  'Day Scholar / Campus',
];

export default function PostMarketplaceItemScreen() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isFree, setIsFree] = useState(false);
  const [category, setCategory] = useState<MarketplaceCategory>('cycles');
  const [condition, setCondition] = useState<MarketplaceCondition>('good');
  const [location, setLocation] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [phone, setPhone] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('price', isFree ? '0' : (parseInt(price, 10) || 0).toString());
      formData.append('category', category);
      formData.append('condition', condition);
      if (location.trim()) formData.append('location', location.trim());
      if (whatsapp.trim()) formData.append('contact_whatsapp', whatsapp.trim());
      if (phone.trim()) formData.append('contact_phone', phone.trim());

      if (imageUri) {
        const filename = imageUri.split('/').pop() || 'marketplace.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const typeMatch = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append('image', {
          uri: imageUri,
          name: filename,
          type: typeMatch,
        } as any);
      }

      return createMarketplaceItem(formData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['marketplaceItems'] });
      queryClient.invalidateQueries({ queryKey: ['myMarketplaceListings'] });
      Alert.alert('Success', 'Your item has been listed on PECverse Marketplace!', [
        { text: 'View Listing', onPress: () => router.replace(`/marketplace/${data.item.id}` as any) },
      ]);
    },
    onError: (err: any) => {
      Alert.alert(
        'Submission Failed',
        err.response?.data?.message || 'Could not post item. Please check your connection.'
      );
    },
  });

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (e) {
      Alert.alert('Image Error', 'Could not open image library.');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Camera Permission Required', 'Please enable camera access in settings to take photos.');
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
    } catch (e) {
      Alert.alert('Camera Error', 'Could not access camera.');
    }
  };

  const showImageOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Library'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) takePhoto();
          else if (buttonIndex === 2) pickImage();
        }
      );
    } else {
      Alert.alert('Upload Photo', 'Choose an option', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickImage },
      ]);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Missing Field', 'Please enter a title for your listing.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Missing Field', 'Please write a brief description of the item.');
      return;
    }
    if (!isFree && (!price.trim() || parseInt(price, 10) < 0)) {
      Alert.alert('Missing Field', 'Please enter a valid price, or tap "Free / Donation".');
      return;
    }
    if (!whatsapp.trim() && !phone.trim()) {
      Alert.alert(
        'Contact Info Required',
        'Please provide at least a WhatsApp or Phone number so buyers can reach you.'
      );
      return;
    }

    mutation.mutate();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, { backgroundColor: colors.systemBackground }]}>
        <Stack.Screen
          options={{
            title: 'Sell an Item',
            headerShown: true,
            headerStyle: { backgroundColor: colors.cardBackground },
            headerTintColor: colors.label,
          }}
        />

        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 40 },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Photo Picker */}
          <Text style={[styles.label, { color: colors.label }]}>Item Photo</Text>
          {imageUri ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
              <Pressable style={styles.removeImageBtn} onPress={() => setImageUri(null)}>
                <Ionicons name="close-circle" size={28} color="#EF4444" />
              </Pressable>
            </View>
          ) : (
            <Pressable
              style={[
                styles.uploadPlaceholder,
                { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
              ]}
              onPress={showImageOptions}
            >
              <View style={[styles.uploadIconCircle, { backgroundColor: colors.accent + '20' }]}>
                <Ionicons name="camera-outline" size={28} color={colors.accent} />
              </View>
              <Text style={[styles.uploadText, { color: colors.label }]}>Add Photo (Recommended)</Text>
              <Text style={[styles.uploadSubtext, { color: colors.secondaryLabel }]}>
                Items with photos sell 4x faster on campus
              </Text>
            </Pressable>
          )}

          {/* Title */}
          <Text style={[styles.label, { color: colors.label }]}>Title *</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.cardBackground, color: colors.label, borderColor: colors.cardBorder },
            ]}
            placeholder="e.g. Hero Sprint Pro Cycle (21 Gears)"
            placeholderTextColor={colors.tertiaryLabel}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />

          {/* Category */}
          <Text style={[styles.label, { color: colors.label }]}>Category *</Text>
          <View style={styles.chipsContainer}>
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setCategory(cat.id)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isSelected ? colors.accent : colors.cardBackground,
                      borderColor: isSelected ? colors.accent : colors.cardBorder,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: isSelected ? '#FFFFFF' : colors.label },
                    ]}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Price & Free Toggle */}
          <View style={styles.rowBetween}>
            <Text style={[styles.label, { color: colors.label }]}>Price (₹) *</Text>
            <Pressable
              style={[
                styles.freeToggle,
                {
                  backgroundColor: isFree ? '#10B981' : colors.secondarySystemBackground,
                  borderColor: isFree ? '#10B981' : colors.cardBorder,
                },
              ]}
              onPress={() => {
                setIsFree(!isFree);
                if (!isFree) setPrice('0');
                else setPrice('');
              }}
            >
              <Ionicons name="gift-outline" size={14} color={isFree ? '#FFFFFF' : colors.secondaryLabel} />
              <Text style={[styles.freeToggleText, { color: isFree ? '#FFFFFF' : colors.secondaryLabel }]}>
                🎁 Free / Donation
              </Text>
            </Pressable>
          </View>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isFree ? colors.secondarySystemBackground : colors.cardBackground,
                color: isFree ? colors.tertiaryLabel : colors.label,
                borderColor: colors.cardBorder,
              },
            ]}
            placeholder="e.g. 1500"
            placeholderTextColor={colors.tertiaryLabel}
            value={isFree ? '0 (FREE)' : price}
            onChangeText={setPrice}
            keyboardType="numeric"
            editable={!isFree}
          />

          {/* Condition */}
          <Text style={[styles.label, { color: colors.label }]}>Condition *</Text>
          <View style={styles.conditionGrid}>
            {CONDITIONS.map((cond) => {
              const isSelected = condition === cond.id;
              return (
                <Pressable
                  key={cond.id}
                  onPress={() => setCondition(cond.id)}
                  style={[
                    styles.conditionCard,
                    {
                      backgroundColor: isSelected ? colors.accent + '15' : colors.cardBackground,
                      borderColor: isSelected ? colors.accent : colors.cardBorder,
                    },
                  ]}
                >
                  <Text style={[styles.conditionLabel, { color: isSelected ? colors.accent : colors.label }]}>
                    {cond.label}
                  </Text>
                  <Text style={[styles.conditionDesc, { color: colors.secondaryLabel }]}>
                    {cond.desc}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Pick-up Location */}
          <Text style={[styles.label, { color: colors.label }]}>Pick-up Location</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: colors.cardBackground, color: colors.label, borderColor: colors.cardBorder },
            ]}
            placeholder="e.g. Aravali Hostel Room 214, or Nescafe"
            placeholderTextColor={colors.tertiaryLabel}
            value={location}
            onChangeText={setLocation}
            maxLength={100}
          />

          {/* Quick Location Pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickLocRow}>
            {QUICK_LOCATIONS.map((loc) => (
              <Pressable
                key={loc}
                onPress={() => setLocation(loc)}
                style={[styles.quickLocPill, { backgroundColor: colors.secondarySystemBackground, borderColor: colors.cardBorder }]}
              >
                <Text style={[styles.quickLocText, { color: colors.secondaryLabel }]}>{loc}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Description */}
          <Text style={[styles.label, { color: colors.label }]}>Description *</Text>
          <TextInput
            style={[
              styles.textArea,
              { backgroundColor: colors.cardBackground, color: colors.label, borderColor: colors.cardBorder },
            ]}
            placeholder="Describe condition, reason for selling, any accessories included..."
            placeholderTextColor={colors.tertiaryLabel}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={2000}
            textAlignVertical="top"
          />

          {/* Contact Details */}
          <Text style={[styles.sectionHeading, { color: colors.label }]}>Contact Details</Text>
          <Text style={[styles.sublabel, { color: colors.secondaryLabel }]}>
            At least one contact method is required so interested students can reach you.
          </Text>

          <Text style={[styles.label, { color: colors.label }]}>WhatsApp Number *</Text>
          <View style={styles.inputWithIcon}>
            <Ionicons name="logo-whatsapp" size={18} color="#25D366" style={{ marginLeft: 12 }} />
            <TextInput
              style={[styles.inputInner, { color: colors.label }]}
              placeholder="e.g. 9876543210"
              placeholderTextColor={colors.tertiaryLabel}
              value={whatsapp}
              onChangeText={setWhatsapp}
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>

          <Text style={[styles.label, { color: colors.label }]}>Call Phone (Optional)</Text>
          <View style={styles.inputWithIcon}>
            <Ionicons name="call-outline" size={18} color={colors.secondaryLabel} style={{ marginLeft: 12 }} />
            <TextInput
              style={[styles.inputInner, { color: colors.label }]}
              placeholder="e.g. 9876543210"
              placeholderTextColor={colors.tertiaryLabel}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>

          {/* Submit Button */}
          <Pressable
            style={[
              styles.submitBtn,
              { backgroundColor: colors.accent },
              mutation.isPending && { opacity: 0.7 },
            ]}
            onPress={handleSubmit}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                <Text style={styles.submitBtnText}>Post Listing Now</Text>
              </>
            )}
          </Pressable>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
  },
  sublabel: {
    fontSize: 12,
    lineHeight: 17,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 14,
  },
  input: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  textArea: {
    minHeight: 90,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    fontSize: 14,
  },
  uploadPlaceholder: {
    height: 140,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  uploadIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 13,
    fontWeight: '600',
  },
  uploadSubtext: {
    fontSize: 11,
  },
  imagePreviewContainer: {
    width: '100%',
    height: 200,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 14,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  freeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  freeToggleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  conditionGrid: {
    gap: 8,
  },
  conditionCard: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  conditionLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  conditionDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  quickLocRow: {
    gap: 6,
    paddingVertical: 4,
  },
  quickLocPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  quickLocText: {
    fontSize: 11,
    fontWeight: '500',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  inputInner: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 25,
    marginTop: 20,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
