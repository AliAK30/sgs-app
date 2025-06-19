import { useEffect, useCallback, useRef } from 'react';
import { useUserStore, useSocketStore } from './useStore';
import socketService from '@/SocketService';
import { Events, SocketEventListener } from '@/SocketService'; // Assuming these types are exported from your SocketService file

export const useSocket = () => {

  const {isConnected, setIsConnected} = useSocketStore();
  const {user, token} = useUserStore();

  // Initialize socket connection
  const initializeSocket = useCallback(async () => {
    
    if (socketService.isInitialized()) return;
    if (!user?._id || !token) {
      console.warn('Skipping socket init: Missing user or token');
      return;
    }
    
    try {
      await socketService.initialize(user?._id, token, user?.role??"student", setIsConnected);
      console.log('Socket initialized successfully');
    } catch (error) {
      console.error('Failed to initialize socket:', error);
    } 
  }, [user?._id, token]);

  // Setup socket connection and app state listeners
  useEffect(() => {

    if(user?._id && token && !socketService.isInitialized() && !socketService.isInitializing()){
      initializeSocket();
    }
  
    if(!user?._id || !token) socketService.disconnect();

  }, [user?._id, token]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (socketService.isInitialized()) {
        socketService.disconnect();
      }
    };
  }, []);

  return {
    isConnected,
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