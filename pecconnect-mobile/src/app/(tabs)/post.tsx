import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/useAuthStore';

export default function PostScreen() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const isAuthorized = user?.role === 'cr' || user?.role === 'superadmin';

  useEffect(() => {
    if (isAuthorized) {
      router.replace('/post-announcement');
    } else {
      router.replace('/(tabs)/notes');
    }
  }, [isAuthorized, router]);

  return null;
}
