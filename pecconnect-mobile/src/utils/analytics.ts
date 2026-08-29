import { Platform, AppState, AppStateStatus } from 'react-native';
import Constants from 'expo-constants';
import PostHog from 'posthog-react-native';
import { api } from './api';

export const POSTHOG_API_KEY =
  process.env.EXPO_PUBLIC_POSTHOG_API_KEY ||
  'phc_mJBiZczLyUxUj5HdCN7adPx2CYJA9dPxkNxCEdm5QbuR';
export const POSTHOG_HOST =
  process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com';

// Safely initialize PostHog singleton
let posthogClient: PostHog | null = null;
try {
  posthogClient = new PostHog(POSTHOG_API_KEY, {
    host: POSTHOG_HOST,
    enableSessionReplay: false, // Session replay requires native binaries; kept false for 100% OTA stability
    flushAt: 5,
    flushInterval: 10000,
    captureAppLifecycleEvents: false,
  });
} catch (err) {
  console.log('PostHog init fallback:', err);
}

export const posthog = posthogClient;

export interface TelemetryEvent {
  session_id: string;
  event_name: string;
  screen_name?: string;
  properties?: Record<string, any>;
  platform: string;
  app_version: string;
  created_at: string;
}

// Generate simple unique session ID per app session
function generateSessionId(): string {
  return 'sess_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now().toString(36);
}

const currentSessionId = generateSessionId();
const appVersion = Constants?.expoConfig?.version || '1.0.1';
const currentPlatform = Platform.OS;

let eventQueue: TelemetryEvent[] = [];
let flushTimeout: any = null;
let isFlushing = false;

/**
 * Flush batched events to custom backend
 */
export async function flushAnalytics(): Promise<void> {
  // Flush PostHog queue
  try {
    if (posthog) {
      await posthog.flush();
    }
  } catch (e) {}

  if (eventQueue.length === 0 || isFlushing) return;

  const eventsToSend = [...eventQueue];
  eventQueue = [];
  isFlushing = true;

  try {
    await api.post('/analytics/events', {
      events: eventsToSend,
    });
  } catch (error) {
    // On failure, re-enqueue up to 30 events
    eventQueue = [...eventsToSend.slice(-30), ...eventQueue];
  } finally {
    isFlushing = false;
  }
}

/**
 * Schedule debounced flush
 */
function scheduleFlush(immediate = false) {
  if (immediate || eventQueue.length >= 10) {
    if (flushTimeout) clearTimeout(flushTimeout);
    flushAnalytics().catch(() => {});
    return;
  }

  if (!flushTimeout) {
    flushTimeout = setTimeout(() => {
      flushTimeout = null;
      flushAnalytics().catch(() => {});
    }, 15000); // 15 seconds batch interval
  }
}

/**
 * Identify a user in PostHog upon login
 */
export function identifyUser(user: any) {
  if (!user?.id) return;
  try {
    if (posthog) {
      posthog.identify(user.id.toString(), {
        name: user.name,
        email: user.email,
        roll_no: user.roll_no,
        role: user.role,
        branch: user.courseClass?.branch?.code,
        group: user.courseClass?.group_name,
      });
    }
  } catch (e) {
    // Silent catch
  }
}

/**
 * Reset user tracking upon logout
 */
export function resetAnalyticsUser() {
  try {
    if (posthog) {
      posthog.reset();
    }
  } catch (e) {}
}

/**
 * Track a custom user event (e.g. attendance marked, note downloaded, etc.)
 */
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  // 1. Send to PostHog
  try {
    if (posthog) {
      posthog.capture(eventName, properties);
    }
  } catch (e) {}

  // 2. Send to First-Party Backend database for direct SQL aggregation
  try {
    const event: TelemetryEvent = {
      session_id: currentSessionId,
      event_name: eventName,
      properties,
      platform: currentPlatform,
      app_version: appVersion,
      created_at: new Date().toISOString(),
    };

    eventQueue.push(event);
    scheduleFlush();
  } catch (e) {}
}

/**
 * Track a screen view
 */
export function trackScreen(screenName: string, properties?: Record<string, any>) {
  // 1. Send to PostHog
  try {
    if (posthog) {
      posthog.screen(screenName, properties);
    }
  } catch (e) {}

  // 2. Send to First-Party Backend
  try {
    const event: TelemetryEvent = {
      session_id: currentSessionId,
      event_name: 'screen_view',
      screen_name: screenName,
      properties,
      platform: currentPlatform,
      app_version: appVersion,
      created_at: new Date().toISOString(),
    };

    eventQueue.push(event);
    scheduleFlush();
  } catch (e) {}
}

// Automatically flush when user backgrounds or leaves the app
AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
  if (nextAppState === 'background' || nextAppState === 'inactive') {
    flushAnalytics().catch(() => {});
  }
});
