import { useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useUserStore } from './useStore';
import socketService from '@/SocketService';

export const useAppStateSocketSync = () => {
  const { user, token } = useUserStore();
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
    if (!user?._id || !token) return;

    const wasBackground = appStateRef.current.match(/inactive|background/);
    const isNowActive = nextAppState === 'active';

    const wasActive = appStateRef.current === 'active';
    const isNowBackground = nextAppState.match(/inactive|background/);

    if (wasBackground && isNowActive) {
      console.log('App came to foreground');
      if (socketService.isSocketConnected()) {
        socketService.setUserOnline(user._id);
      }
    } else if (wasActive && isNowBackground) {
      console.log('App went to background');
      if (socketService.isSocketConnected()) {
        socketService.setUserOffline(user._id);
      }
    }

    appStateRef.current = nextAppState;
  }, [user?._id, token]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [handleAppStateChange]);
};
