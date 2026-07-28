import { View, Text, StyleSheet, Pressable, ScrollView, Platform, Linking } from 'react-native';
import { useAuthStore } from '@/stores/useAuthStore';
import { colors } from '@/theme/colors';
import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import * as Haptics from 'expo-haptics';
import { api } from '@/utils/api';
import { checkAndPromptPushPermissions } from '@/hooks/usePushNotifications';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore errors and force logout locally
    }
    logout();
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Header Avatar Section */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            {user.profile_photo ? (
              <Image 
                source={user.profile_photo} 
                style={styles.avatar} 
                contentFit="cover" 
              />
            ) : (
              <SymbolView name="person.crop.circle.fill" style={styles.avatar} tintColor={colors.secondaryLabel} />
            )}
            <View style={styles.avatarBadge}>
              <Text style={styles.badgeText}>B.Tech</Text>
            </View>
          </View>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.roleText}>{user.role.toUpperCase()}</Text>
        </View>

        {/* Info Data Panels */}
        <View style={styles.panelSection}>
          <Text style={styles.sectionTitle}>ACADEMIC INFO</Text>
          
          <View style={styles.dataGroup}>
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Roll Number</Text>
              <Text style={styles.dataValue}>{user.roll_no}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Course</Text>
              <Text style={styles.dataValue}>B.Tech</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Branch</Text>
              <Text style={styles.dataValue}>{user.courseClass?.branch?.name || 'N/A'}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.dataRow}>
              <Text style={styles.dataLabel}>Class Group</Text>
              <Text style={styles.dataValue}>{user.courseClass?.group_name || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Resources */}
        <View style={styles.panelSection}>
          <Text style={styles.sectionTitle}>RESOURCES</Text>
          <View style={styles.dataGroup}>
            <Pressable 
              style={({ pressed }) => [styles.actionRow, pressed && { opacity: 0.7 }]}
              onPress={async () => {
                const { Asset } = await import('expo-asset');
                const FileSystem = await import('expo-file-system/legacy');
                const Sharing = await import('expo-sharing');
                const IntentLauncher = await import('expo-intent-launcher');
                const { Platform } = await import('react-native');

                try {
                  const asset = Asset.fromModule(require('../../../../assets/Academic_Calendar_26271.pdf'));
                  await asset.downloadAsync();
                  
                  // Copy to cache to guarantee a valid file:// URI for Android Content Provider
                  const localFileUri = FileSystem.cacheDirectory + 'Academic_Calendar_2026.pdf';
                  await FileSystem.copyAsync({
                    from: asset.localUri || asset.uri,
                    to: localFileUri
                  });
                  
                  if (Platform.OS === 'android') {
                    // Launch native PDF viewer instantly
                    const cUri = await FileSystem.getContentUriAsync(localFileUri);
                    await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
                      data: cUri,
                      flags: 1, // FLAG_GRANT_READ_URI_PERMISSION
                      type: 'application/pdf'
                    });
                  } else {
                    // iOS Quick Look preview
                    await Sharing.shareAsync(localFileUri, { UTI: 'com.adobe.pdf', mimeType: 'application/pdf' });
                  }
                } catch (e) {
                  console.error('Failed to open PDF:', e);
                  alert('Could not open PDF viewer on your device.');
                }
              }}
            >
              <Text style={styles.dataLabel}>Academic Calendar</Text>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          </View>
        </View>

        {/* Settings & Preferences */}
        <View style={styles.panelSection}>
          <Text style={styles.sectionTitle}>SETTINGS & PREFERENCES</Text>
          <View style={styles.dataGroup}>
            <Pressable 
              style={({ pressed }) => [styles.actionRow, pressed && { opacity: 0.7 }]}
              onPress={async () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                const isActive = await checkAndPromptPushPermissions(true);
                if (isActive) {
                  alert("✅ Push notifications and class reminders are active!");
                }
              }}
            >
              <Text style={styles.dataLabel}>Push Notifications & Reminders</Text>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.panelSection}>
          <Pressable 
            style={({ pressed }) => [styles.logoutGroup, pressed && { opacity: 0.7 }]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.systemBackground,
  },
  content: {
    paddingTop: Platform.OS === 'ios' ? 80 : 60,
    paddingHorizontal: 16,
    paddingBottom: 120,
    gap: 32,
  },
  avatarContainer: {
    alignItems: 'center',
    gap: 8,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.secondarySystemBackground,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 8,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  name: {
    color: colors.label,
    fontSize: 24,
    fontWeight: '700',
  },
  roleText: {
    color: colors.secondaryLabel,
    fontWeight: '500',
    fontSize: 15,
  },
  panelSection: {
    gap: 8,
  },
  sectionTitle: {
    color: colors.secondaryLabel,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginLeft: 16,
  },
  dataGroup: {
    backgroundColor: colors.secondarySystemBackground,
    borderRadius: 12,
    overflow: 'hidden',
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: colors.secondarySystemBackground,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.separator,
    marginLeft: 16,
  },
  dataLabel: {
    color: colors.label,
    fontSize: 16,
  },
  dataValue: {
    color: colors.secondaryLabel,
    fontSize: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: colors.secondarySystemBackground,
  },
  chevron: {
    color: colors.secondaryLabel,
    fontSize: 20,
    fontWeight: '300',
  },
  logoutGroup: {
    backgroundColor: colors.secondarySystemBackground,
    borderRadius: 12,
    overflow: 'hidden',
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: colors.destructive,
    fontSize: 16,
    fontWeight: '600',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -4,
    backgroundColor: colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  }
});
