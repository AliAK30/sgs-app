import io, { Socket, ManagerOptions, SocketOptions } from "socket.io-client";
import { OS } from "@/app/_layout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { url } from "./constants/Server";
import { User } from "./types";

export type FriendRequestData = {
  requester: {
    first_name: string;
    last_name: string;
    id: string;
  };
  recipientId: string;
};

export type FriendRequestResponseData = {
  userId: string;
  friend: {
    id: string;
    first_name: string;
    last_name: string;
    picture: string;
  };
};

export type UserStatusData = {
  user: User;
  isOnline: boolean;
  lastSeen: Date;
};

export type NotificationData = {
  id: number;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
};

export type ConnectionData = {
  data: any|undefined;
}

export type Events =
  | "friend_request_received"
  | "friend_request_accepted"
  | "friend_request_declined"
  | "friendship_removed"
  | "user_blocked"
  | "user_status_change";

export type EventData<T> = T extends "friend_request_received"
  ? FriendRequestData
  : T extends
      | "friend_request_accepted"
      | "friend_request_declined"
      | "friendship_removed"
      | "user_blocked"
  ? FriendRequestResponseData
  : UserStatusData;

export type SocketEventListener<T> = (data: EventData<T>) => void;

class SocketService {
  private socket: Socket | null = null;
  private isConnected: boolean | null = null;
  private userId: string | null = null;
  private userRole: string | null = null;
  private initialized: boolean = false;
  private initializing: boolean = false;
  private listeners: Map<Events, Set<SocketEventListener<Events>>> = new Map();
  private setIsConnected: null | ((value: boolean | null) => void) = null;
  private static instance: SocketService;

  

  public isInitialized(): boolean {
    return this.initialized;
  }

   public isInitializing(): boolean {
    return this.initializing;
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  // Initialize socket connection
  async initialize(userId: string, authToken: string, role: string, setIsConnected: (value: boolean | null) => void): Promise<Socket> {
    try {
      
      this.initializing = true;
      // Skip if already connected for same user
      if (this.socket?.connected && this.userId === userId) {
        this.initializing = false;
        return Promise.resolve(this.socket);
      }

      // Disconnect existing connection if different user
      if (this.userId && this.userId !== userId) {
        this.disconnect();
      }

      this.userId = userId;
      this.setIsConnected = setIsConnected;    
      this.userRole = role;
      // Socket.IO configuration
      const socketConfig: Partial<ManagerOptions & SocketOptions> = {
        transports: ["websocket", "polling"] as const, // Fallback to polling if websocket fails
        upgrade: true,
        rememberUpgrade: true,
        timeout: 20000,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        auth: {
          token: authToken, // Send auth token for server verification
          userId: userId,
          role: role,
        },
      };

      // Platform-specific configurations
      if (OS === "web") {
        socketConfig.withCredentials = true;
      }

      // Determine server URL based on environment
      const SERVER_URL = url;
      // Create socket connection
      this.socket = io(SERVER_URL, socketConfig);

      // 🧼 Clear previous listeners before setting up new ones
      this.clearSocketListeners();

      // Setup connection event handlers
      this.setupConnectionHandlers();

      // Setup friend-related event handlers
      this.setupFriendEventHandlers();

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          this.isConnected = false;
          setIsConnected(this.isConnected);
          this.initialized = false;
          this.initializing = false;
          reject(new Error("Socket connection timeout"));
        }, 10000);

        this.socket?.on("connect", () => {
          clearTimeout(timeout);
          this.isConnected = true;
          setIsConnected(this.isConnected);
          this.initialized = true;
          this.initializing = false;
          console.log("✅ Socket connected:", this.socket?.id);

          // Join user's personal room
          this.socket?.emit("join_user_room", userId);

          resolve(this.socket as Socket);
        });

        this.socket?.on("connect_error", (error) => {
          clearTimeout(timeout);
          console.error("❌ Socket connection error:", error);
          this.isConnected = false;
          this.initialized = false;
          this.initializing = false;
          setIsConnected(this.isConnected);
          reject(error);
        });
      });
    } catch (error) {
      console.error("Socket initialization error:", error);
      throw error;
    }
  }


  //for clearing all socket listeners
  private clearSocketListeners(): void {
  if (this.socket) {
    this.socket.removeAllListeners();
  }
}

  // Setup connection-related event handlers
  private setupConnectionHandlers(): void {
    if (!this.socket) return;

    this.socket.on("disconnect", (reason: string) => {
      console.log("🔌 Socket disconnected:", reason);
      this.isConnected = false;
      this.setIsConnected && this.setIsConnected(this.isConnected);
      // Handle different disconnect reasons
      if (reason === "io server disconnect") {
        // Server disconnected, try to reconnect
        this.socket?.connect();
      }
    });

    this.socket.on("reconnect", (attemptNumber: number) => {
      console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
      this.isConnected = true;
      this.setIsConnected && this.setIsConnected(this.isConnected);
      // Rejoin user room after reconnection
      if (this.userId) {
        this.socket?.emit("join_user_room", this.userId);
      }
    });

    this.socket.on("reconnect_error", (error: Error) => {
      this.isConnected = false;
      this.setIsConnected && this.setIsConnected(this.isConnected);
      console.error("🔄❌ Socket reconnection error:", error);
    });

    this.socket.on("reconnect_failed", () => {
      console.error("🔄💀 Socket reconnection failed");
      this.isConnected = false;
      this.setIsConnected && this.setIsConnected(this.isConnected);
    });
  }

  // Setup friend-related event handlers
  private setupFriendEventHandlers(): void {
    if (!this.socket) return;

    // Friend request received
    this.socket.on("friend_request_received", (data: FriendRequestData) => {
      console.log("👋 Friend request received:", data);
      this.emitToListeners("friend_request_received", data);

      // Show local notification
      /* this.showNotification(
        "Friend Request",
        `${data.requester.first_name} ${data.requester.last_name} sent you a friend request`
      ); */
    });

    // Friend request accepted
    this.socket.on(
      "friend_request_accepted",
      (data: FriendRequestResponseData) => {
        console.log("✅ Friend request accepted:", data);
        this.emitToListeners("friend_request_accepted", data);

        /* this.showNotification(
          "Friend Request Accepted",
          `${data.friend.first_name} ${data.friend.last_name} accepted your friend request`
        ); */
      }
    );

    // Friend request declined
    this.socket.on(
      "friend_request_declined",
      (data: FriendRequestResponseData) => {
        console.log("❌ Friend request declined:", data);
        this.emitToListeners("friend_request_declined", data);
      }
    );

    // Friendship removed
    this.socket.on("friendship_removed", (data: FriendRequestResponseData) => {
      console.log("💔 Friendship removed:", data);
      this.emitToListeners("friendship_removed", data);
    });

    // User blocked
    this.socket.on("user_blocked", (data: FriendRequestResponseData) => {
      console.log("🚫 User blocked:", data);
      this.emitToListeners("user_blocked", data);
    });

    // User status changes (online/offline)
    this.socket.on("user_status_change", (data: UserStatusData) => {
      console.log("👤 User status change:", data);
      this.emitToListeners("user_status_change", data);
    });
  }

  // Add event listener
  addEventListener<T extends Events>(event: T, callback: SocketEventListener<T>): SocketEventListener<T> {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set<SocketEventListener<typeof event>>());
    }
    this.listeners.get(event)?.add(callback);
    return callback;
  }

  // Remove event listener
  removeEventListener<T extends Events>(event: T, callback: SocketEventListener<T>): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)?.delete(callback);
    }
  }

  // Emit to all registered listeners
  private emitToListeners<T extends Events>(event: T, data: EventData<T>): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)?.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} listener:`, error);
        }
      });
    }
  }

  // Update user online status
  setUserOnline(userId: string): void {
    if (this.isConnected) {
      this.socket?.emit("user_online", userId);
    }
  }

  // Update user offline status
  setUserOffline(userId: string): void {
    if (this.isConnected) {
      this.socket?.emit("user_offline", userId);
    }
  }

  // Show notification (platform-specific)
  /* async showNotification(title: string, body: string): Promise<void> {
    try {
      if (OS === "web") {
        // Web notifications
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(title, { body });
        }
      } else {
        // React Native mobile notifications
        console.log(`📱 Notification: ${title} - ${body}`);

        // Store notification for in-app display
        const notifications =
          (await AsyncStorage.getItem("notifications")) || "[]";
        const notificationList: NotificationData[] = JSON.parse(notifications);
        notificationList.unshift({
          id: Date.now(),
          title,
          body,
          timestamp: new Date().toISOString(),
          read: false,
        });

        // Keep only last 50 notifications
        const trimmedList = notificationList.slice(0, 50);
        await AsyncStorage.setItem(
          "notifications",
          JSON.stringify(trimmedList)
        );
      }
    } catch (error) {
      console.error("Error showing notification:", error);
    }
  } */

  // Disconnect socket
  disconnect(): void {
    if (this.socket) {
      // Set user offline before disconnecting
      if (this.userId) {
        this.setUserOffline(this.userId);
      }

      // Clear all listeners
      this.listeners.clear();

      // Disconnect socket
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.initialized = false;
      this.userId = null;
      this.setIsConnected && this.setIsConnected(this.isConnected);
      console.log("Socket disconnected manually");
    }
  }

  isSocketConnected(): boolean|null {
    return this.isConnected;
  }

  // Get socket instance (for direct access if needed)
  getSocket(): Socket | null {
    return this.socket;
  }
}

// Create singleton instance
const socketService = SocketService.getInstance();
export default socketService;