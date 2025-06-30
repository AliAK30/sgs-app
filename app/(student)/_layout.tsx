import { Tabs, Redirect, usePathname } from "expo-router";
import { StyleSheet } from "react-native";
import { View } from "@/components/Themed";
import { w, h, height, base_height, OS } from "../_layout";
import Feather from "@expo/vector-icons/Feather";
import { useUserStore, useBanner } from "@/hooks/useStore";
import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useAppStateSocketSync } from "@/hooks/useAppStateSocketSync";
import { useNotificationsStore, useFriendsStore, useGroupStore } from "@/hooks/useStore";
import * as Notifications from "expo-notifications";
import Banner from "@/components/Banner";
import axios from "axios";
import { url } from "@/constants/Server";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

Notifications.requestPermissionsAsync();

const iconSize: number = 24;
const gap: number = w * 5;

export default function StudentLayout() {
  const { token, user } = useUserStore();
  const { setNotifications } = useNotificationsStore();
  const {setFriends, friends} = useFriendsStore();
  const {setGroups} = useGroupStore();
  const [focusedTab, setFocusedTab] = useState<string>("index");
  const { addEventListener, removeEventListener } = useSocket();
  const { openBanner } = useBanner();
  const pathname = usePathname();
  useAppStateSocketSync();

  useEffect(() => {
    const fetchGroups = async () => {
    //FETCH GROUPS
        let res: any = await axios.get(`${url}/student/${user?._id}/groups`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "userid": user?._id
        },
        timeout: 1000 * 25,
        });

        setGroups(res.data)
  }

    const fetchNotifications = async () => {
    const res: any = await axios.get(`${url}/student/notifications`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        userid: user?._id,
      },
      timeout: 1000 * 25,
    });
      setNotifications(res.data);
    };

    const fetchFriends = async () => {
    const res: any = await axios.get(`${url}/student/friends`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        userid: user?._id,
      },
      timeout: 1000 * 25,
    });
      setFriends(res.data);
    };

    fetchNotifications();
    fetchFriends();
    fetchGroups();

    const callback1 = addEventListener(
      "friend_request_received",
      async (data) => {
        fetchNotifications();
        const message = `${data.requester.first_name} ${data.requester.last_name} has sent you a friend request`;
        if (OS === "web") {
          openBanner("info", "Friend Request", message);
        } else {
          Notifications.scheduleNotificationAsync({
            content: {
              title: "Friend Request",
              sound: true,
              body: message,
            },
            trigger: null,
          });
        }
      }
    );

    const callback2 = addEventListener(
      "friend_request_accepted",
      async (data) => {
        setFriends([...friends, data.recipient ]);
        fetchNotifications();
        const message = `${data.recipient.first_name} ${data.recipient.last_name} accepted your friend request`;
        if (OS === "web") {
          openBanner("info", "Friend Request Accepted", message);
        } else {
          Notifications.scheduleNotificationAsync({
            content: {
              title: "Friend Request Accepted",
              sound: true,
              body: message,
            },
            trigger: null,
          });
        }
      }
    );

    return () => {
      removeEventListener("friend_request_accepted", callback2)
      removeEventListener("friend_request_received", callback1)
    };
  }, []);

  useEffect(() => {
    // Extracting tab name from path, assuming tabs are directly under root
    const pathParts = pathname.split("/").filter(Boolean); //filter(Boolean) removes falsy values
    const currentTab = pathParts[0] || "index";
    setFocusedTab(currentTab);
  }, [pathname]);

  if (!token) return <Redirect href="/login" />;
  if (user?.role === "admin") return <Redirect href="/(admin)" />;

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Banner />
      <Tabs
        screenOptions={{
          tabBarStyle: styles.tab,
          headerShown: false,
          tabBarLabelPosition: "below-icon",
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarActiveTintColor: "#539DF3",
          tabBarInactiveTintColor: "#000000",
          tabBarIconStyle: styles.tabBarIcon,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Feather size={iconSize} name="home" color={color} />
            ),
            tabBarItemStyle:
              focusedTab === "index"
                ? {
                    borderTopColor: "#539DF3",
                    borderTopWidth: 2,
                    marginHorizontal: gap,
                  }
                : { marginHorizontal: gap },
          }}
        />
        <Tabs.Screen
          name="groups"
          options={{
            title: "Groups",
            tabBarIcon: ({ color }) => (
              <Feather size={iconSize} name="grid" color={color} />
            ),
            tabBarItemStyle:
              focusedTab === "groups"
                ? {
                    borderTopColor: "#539DF3",
                    borderTopWidth: 2,
                    marginHorizontal: gap,
                  }
                : { marginHorizontal: gap },
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: "Analytics",
            tabBarIcon: ({ color }) => (
              <Feather size={iconSize} name="pie-chart" color={color} />
            ),
            tabBarItemStyle:
              focusedTab === "analytics"
                ? {
                    borderTopColor: "#539DF3",
                    borderTopWidth: 2,
                    marginHorizontal: gap,
                  }
                : { marginHorizontal: gap },
          }}
        />
        <Tabs.Screen
          name="peers"
          options={{
            title: "Peers",
            tabBarIcon: ({ color }) => (
              <Feather size={iconSize} name="users" color={color} />
            ),
            tabBarItemStyle:
              focusedTab === "peers"
                ? {
                    borderTopColor: "#539DF3",
                    borderTopWidth: 2,
                    marginHorizontal: gap,
                  }
                : { marginHorizontal: gap },
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color }) => (
              <Feather size={iconSize} name="settings" color={color} />
            ),
            tabBarItemStyle:
              focusedTab === "settings"
                ? {
                    borderTopColor: "#539DF3",
                    borderTopWidth: 2,
                    marginHorizontal: gap,
                  }
                : { marginHorizontal: gap },
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  tab: {
    backgroundColor: "#FFFFFF",
    height:
      height < 640
        ? 65 * h + (640 - height) * ((640 - height) / base_height)
        : 65 * h,
    alignItems: "center",
    borderTopWidth: 0,
  },

  tabBarLabel: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12 * h,
    width: 63,
    height: 63,
  },
  tabBarIcon: {
    marginTop: 0,
  },
});
