import { Tabs, Redirect } from "expo-router";
import { View } from "@/components/Themed";
import UnsafeArea from "@/components/UnsafeArea";
import { StyleSheet, Pressable, PressableProps, GestureResponderEvent } from "react-native"
import { w, h, width,height, base_height } from "../_layout";
import { Feather, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useUserStore } from "@/hooks/useStore";
import { useState } from "react";

const iconSize: number = 24;
const gap: number = w*7;


type TabBarButtonProps = PressableProps & {
  children: React.ReactNode;
  onPress?: (e: GestureResponderEvent) => void;
};

export default function StudentLayout() {

    const {token} = useUserStore();
    const [focusedTab, setFocusedTab] = useState<string>("index")

    if(!token) return <Redirect href="/login"/>

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
              <MaterialIcons size={iconSize} name="groups" color={color} />
            ),
            tabBarItemStyle: focusedTab === "sections" ? {borderTopColor:'#539DF3', borderTopWidth:2, marginHorizontal:gap}: {marginHorizontal:gap}
          }}
        />
        <Tabs.Screen
          name="analytics"
          options={{
            title: "Analytics",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons size={iconSize} name="spider-web" color={color} />
            ),
            tabBarItemStyle: focusedTab === "statistics" ? {borderTopColor:'#539DF3', borderTopWidth:2, marginHorizontal:gap}: {marginHorizontal:gap}
          }}
        />
        <Tabs.Screen
          name="peers"
          options={{
            title: "Peers",
            tabBarIcon: ({ color }) => (
              <Feather size={iconSize} name="users" color={color} />
            ),
            tabBarItemStyle: focusedTab === "peers" ? {borderTopColor:'#539DF3', borderTopWidth:2, marginHorizontal:gap}: {marginHorizontal:gap}
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
    width:55,
    
  },
  tabBarIcon: {
    marginTop:0
  },
});