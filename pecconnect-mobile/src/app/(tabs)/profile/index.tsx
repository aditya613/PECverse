import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform, Alert } from 'react-native';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTheme } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { api } from '@/utils/api';
import { checkAndPromptPushPermissions } from '@/hooks/usePushNotifications';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { themeMode, setThemeMode, colors, isDark } = useTheme();

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Force logout locally
    }
    logout();
  };

  const openAcademicCalendar = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const { Asset } = await import('expo-asset');
      const FileSystem = await import('expo-file-system/legacy');
      const Sharing = await import('expo-sharing');
      const IntentLauncher = await import('expo-intent-launcher');

      const asset = Asset.fromModule(require('../../../../assets/Academic_Calendar_26271.pdf'));
      await asset.downloadAsync();
      
      const localFileUri = FileSystem.cacheDirectory + 'Academic_Calendar_2026.pdf';
      await FileSystem.copyAsync({
        from: asset.localUri || asset.uri,
        to: localFileUri
      });
      
      if (Platform.OS === 'android') {
        const cUri = await FileSystem.getContentUriAsync(localFileUri);
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: cUri,
          flags: 1,
          type: 'application/pdf'
        });
      } else {
        await Sharing.shareAsync(localFileUri, { UTI: 'com.adobe.pdf', mimeType: 'application/pdf' });
      }
    } catch (e) {
      Alert.alert('Academic Calendar', 'Opening college academic calendar.');
    }
  };

  if (!user) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.systemBackground }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Cover Background Banner */}
        <View style={styles.coverBanner}>
          <View style={styles.coverOverlay} />
          <View style={styles.bannerBadge}>
            <Text style={styles.bannerBadgeText}>PUNJAB ENGINEERING COLLEGE</Text>
          </View>
        </View>

        {/* Profile Card Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <View style={[styles.avatarCircle, { backgroundColor: colors.accent, borderColor: colors.systemBackground }]}>
              <Text style={styles.avatarText}>
                {user.name ? user.name.trim().split(/\s+/).map(n => n?.[0] || '').join('').substring(0, 2).toUpperCase() : 'ME'}
              </Text>
            </View>
            <Pressable 
              style={[styles.editBadge, { backgroundColor: colors.cardBackground, borderColor: colors.systemBackground }]}
              onPress={() => router.push('/edit-class')}
            >
              <Ionicons name="pencil" size={14} color={colors.label} />
            </Pressable>
          </View>

          <Text style={[styles.userName, { color: colors.label }]}>{user.name}</Text>
          <Text style={[styles.userSubtitle, { color: colors.secondaryLabel }]}>
            {user.courseClass?.group_name ? `${user.courseClass.group_name}` : 'Student'}, {user.courseClass?.branch?.name || 'Punjab Engineering College'}
          </Text>
          <Text style={[styles.collegeName, { color: colors.tertiaryLabel }]}>
            Punjab Engineering College (Deemed to be University)
          </Text>

        </View>

        {/* Theme Preference Selector */}
        <View style={[styles.cardSection, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <Text style={[styles.sectionHeaderTitle, { color: colors.label }]}>Appearance Theme</Text>
          <View style={styles.themeSelectorRow}>
            {[
              { id: 'system', label: 'System', icon: 'phone-portrait-outline' },
              { id: 'light', label: 'Light', icon: 'sunny-outline' },
              { id: 'dark', label: 'Dark', icon: 'moon-outline' },
            ].map((item) => {
              const isSelected = themeMode === item.id;
              return (
                <Pressable
                  key={item.id}
                  style={[
                    styles.themeOptionBtn,
                    { backgroundColor: isSelected ? colors.accent : colors.secondarySystemBackground },
                  ]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setThemeMode(item.id as any);
                  }}
                >
                  <Ionicons 
                    name={item.icon as any} 
                    size={16} 
                    color={isSelected ? '#FFFFFF' : colors.secondaryLabel} 
                  />
                  <Text style={[styles.themeOptionText, { color: isSelected ? '#FFFFFF' : colors.secondaryLabel }]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Resources & Settings */}
        <View style={[styles.cardSection, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <Text style={[styles.sectionHeaderTitle, { color: colors.label }]}>Resources & Preferences</Text>
          <Pressable 
            style={styles.actionRow}
            onPress={openAcademicCalendar}
          >
            <View style={[styles.actionIconBox, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
              <Ionicons name="calendar-outline" size={20} color="#8B5CF6" />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: colors.label }]}>Academic Calendar</Text>
              <Text style={[styles.actionSub, { color: colors.secondaryLabel }]}>Official 2026-27 Schedule</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.tertiaryLabel} />
          </Pressable>

        </View>

        {/* Settings & Logout */}
        <View style={[styles.cardSection, { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder }]}>
          <Pressable 
            style={styles.actionRow}
            onPress={async () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              const isActive = await checkAndPromptPushPermissions(true);
              if (isActive) Alert.alert('Notifications', 'Push notifications & class reminders are active!');
            }}
          >
            <View style={[styles.actionIconBox, { backgroundColor: colors.secondarySystemBackground }]}>
              <Ionicons name="notifications-outline" size={20} color={colors.label} />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: colors.label }]}>Push Notifications</Text>
              <Text style={[styles.actionSub, { color: colors.secondaryLabel }]}>Class alerts & updates</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.tertiaryLabel} />
          </Pressable>

          <View style={[styles.rowDivider, { backgroundColor: colors.separator }]} />

          <Pressable 
            style={styles.actionRow}
            onPress={() => router.push('/edit-class')}
          >
            <View style={[styles.actionIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
              <Ionicons name="school-outline" size={20} color={colors.accent} />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: colors.label }]}>Edit Class & Branch</Text>
              <Text style={[styles.actionSub, { color: colors.secondaryLabel }]}>{user.courseClass?.group_name || 'Set Group'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.tertiaryLabel} />
          </Pressable>
        </View>

        {/* Logout Button */}
        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutBtnText}>Log Out</Text>
        </Pressable>

        <View style={{ height: 110 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  coverBanner: {
    height: 140,
    backgroundColor: '#1E1B4B',
    position: 'relative',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
  },
  coverOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(9, 9, 11, 0.4)',
  },
  bannerBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  bannerBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1.5,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: -50,
    paddingHorizontal: 20,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  collegeName: {
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'center',
  },
  mottoPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  mottoText: {
    fontSize: 13,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  statBox: {
    alignItems: 'center',
  },
  statNum: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: 24,
  },
  cardSection: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  themeSelectorRow: {
    flexDirection: 'row',
    gap: 8,
  },
  themeOptionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  themeOptionText: {
    fontSize: 13,
    fontWeight: '700',
  },
  aboutText: {
    fontSize: 13,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  actionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 1,
  },
  actionSub: {
    fontSize: 12,
  },
  rowDivider: {
    height: 1,
    marginVertical: 10,
    marginLeft: 52,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    gap: 8,
  },
  logoutBtnText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '700',
  },
});
