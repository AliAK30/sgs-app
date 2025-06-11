import { useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import socketService from '@/SocketService';
import { Events, EventData, SocketEventListener } from '@/SocketService'; // Assuming these types are exported from your SocketService file

export const useSocket = (userId: string | null, authToken: string | null) => {

  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const isInitialized = useRef(false);

  // Initialize socket connection
  const initializeSocket = useCallback(async () => {
    if (!userId || !authToken || isInitialized.current) return;

    try {
      await socketService.initialize(userId, authToken);
      isInitialized.current = true;
      console.log('Socket initialized successfully');
    } catch (error) {
      console.error('Failed to initialize socket:', error);
    }
  }, [userId, authToken]);

  // Handle app state changes
  const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
    if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
      // App came to foreground
      console.log('App came to foreground');
      if (userId && socketService.isSocketConnected()) {
        socketService.setUserOnline(userId);
      }
    } else if (appStateRef.current === 'active' && nextAppState.match(/inactive|background/)) {
      // App went to background
      console.log('App went to background');
      if (userId && socketService.isSocketConnected()) {
        socketService.setUserOffline(userId);
      }
    }
    appStateRef.current = nextAppState;
  }, [userId]);

  // Setup socket connection and app state listeners
  useEffect(() => {
    if (userId && authToken) {
      initializeSocket();
    }

    // Listen for app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [userId, authToken, initializeSocket, handleAppStateChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isInitialized.current) {
        socketService.disconnect();
        isInitialized.current = false;
      }
    };
  }, []);

  return {
    isConnected: socketService.isSocketConnected(),
    socketService,
    // Expose common methods with proper typing
    addEventListener: <T extends Events>(
      event: T,
      callback: SocketEventListener<T>
    ) => socketService.addEventListener(event, callback),
    removeEventListener: <T extends Events>(
      event: T,
      callback: SocketEventListener<T>
    ) => socketService.removeEventListener(event, callback),
  };
};