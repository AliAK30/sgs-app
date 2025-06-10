import { Tabs, Redirect } from "expo-router";
import { StyleSheet, Pressable, PressableProps, GestureResponderEvent } from "react-native"
import { w, h,height, base_height } from "../_layout";
import { Feather, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useUserStore } from "@/hooks/useStore";
import { useState } from "react";

const iconSize: number = 24;
const gap: number = w*5;


type TabBarButtonProps = PressableProps & {
  children: React.ReactNode;
  onPress?: (e: GestureResponderEvent) => void;
};

export default function AdminLayout() {

    const {token, user} = useUserStore();
    const [focusedTab, setFocusedTab] = useState<string>("index")

    if(!token) return <Redirect href="/login"/>
    if(user?.role === "student") return <Redirect href="/(student)"/>

    return (
        
        <Tabs
        screenOptions={({route}) => ({
        tabBarButton: (props: TabBarButtonProps)=> (
          <Pressable
            {...props}
            
            onPress={(e) => {
                e.preventDefault();
              setFocusedTab(route.name)
              props.onPress?.(e);
            }}
          />
        ),
        tabBarStyle: styles.tab,
        headerShown: false,
        tabBarLabelPosition: "below-icon", 
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: "#539DF3",
        tabBarInactiveTintColor: "#000000",
        tabBarIconStyle: styles.tabBarIcon,
      })}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Feather size={iconSize} name="home" color={color} />
            ),
            tabBarItemStyle: focusedTab === "index" ? {borderTopColor:'#539DF3', borderTopWidth:2, marginHorizontal:gap}: {marginHorizontal:gap},
          }}
        />
        <Tabs.Screen
          name="groups"
          options={{
            title: "Groups",
            tabBarIcon: ({ color }) => (
              <Feather size={iconSize} name="grid" color={color} />
            ),
            tabBarItemStyle: focusedTab === "groups" ? {borderTopColor:'#539DF3', borderTopWidth:2, marginHorizontal:gap}: {marginHorizontal:gap}
          }}
        />
        <Tabs.Screen
          name="admins"
          options={{
            title: "Admins",
            tabBarIcon: ({ color }) => (
              <Feather size={iconSize} name="shield" color={color} />
            ),
            tabBarItemStyle: focusedTab === "admins" ? {borderTopColor:'#539DF3', borderTopWidth:2, marginHorizontal:gap}: {marginHorizontal:gap}
          }}
        />
        <Tabs.Screen
          name="students"
          options={{
            title: "Students",
            tabBarIcon: ({ color }) => (
              <Feather size={iconSize} name="users" color={color} />
            ),
            tabBarItemStyle: focusedTab === "students" ? {borderTopColor:'#539DF3', borderTopWidth:2, marginHorizontal:gap}: {marginHorizontal:gap}
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            tabBarIcon: ({ color }) => (
              <Feather size={iconSize} name="settings" color={color} />
            ),
            tabBarItemStyle: focusedTab === "settings" ? {borderTopColor:'#539DF3', borderTopWidth:2, marginHorizontal:gap}: {marginHorizontal:gap}
          }}
        />
      </Tabs>
      
    );
}

const styles = StyleSheet.create({

  tab: {
    backgroundColor: "#FFFFFF",
    height: height < 640 ? (65*h)+(640-height)*((640-height)/base_height):65*h,
    alignItems:'center',
    borderTopWidth:0,
  },

  tabBarLabel: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12*h,
    width:63,
    
  },
  tabBarIcon: {
    marginTop:0
  },
});