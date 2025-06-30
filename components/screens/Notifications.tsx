import { Text, View } from "@/components/Themed";
import { StyleSheet, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Notification from "../Notification";
import Back from "../buttons/Back";
import { useNotificationsStore, useUserStore } from "@/hooks/useStore";
import { useNetInfo } from "@react-native-community/netinfo";
import { useAlert } from "@/hooks/useAlert";
import { h, w } from "@/app/_layout";
import axios from "axios";
import { url } from "@/constants/Server";

function Seperator() {
  return <View style={{ paddingVertical: h * 6 }}></View>;
}

function Header({ count }: any) {
  return <Text style={styles.friends}>{`Total (${count})`}</Text>;
}

type Props = {
  goBack: () => void;
};

export default function Notifications({ goBack }: Props) {
  const { isConnected } = useNetInfo();
  const { notifications, setNotifications } = useNotificationsStore();
  const { user, token } = useUserStore();
  const { Alert } = useAlert();

  const deleteNotifications =  () => {
    axios.delete(`${url}/student/notifications`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        userid: user?._id,
      },
      timeout: 1000 * 25,
    });
    setNotifications(notifications.filter(noti=>noti.type==='fr'));
  };
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <LinearGradient
        // Background Linear Gradient
        colors={["#ADD8E6", "#EAF5F8"]}
        start={{ x: 0.5, y: 0 }} // Top center
        end={{ x: 0.5, y: 1 }} // Bottom center (180deg)
        locations={[0.755, 1]} // Corresponds to 75.5% and 100%
        style={styles.container}
      >
        <Alert />

        <View style={{ justifyContent: "center" }}>
          <Back onPress={()=>{deleteNotifications(); goBack();}} />
          <View style={{ position: "absolute", alignSelf: "center" }}>
            <Text style={styles.title}>Notifications 🔔</Text>
          </View>
        </View>

        {isConnected === false ? (
          <Text style={styles.notfound}>No Internet Connection</Text>
        ) : (
          <FlatList
            data={notifications}
            renderItem={({ item }) => <Notification {...item} />}
            keyExtractor={(item, index) => item?._id ?? ""}
            ItemSeparatorComponent={Seperator}
            ListHeaderComponent={<Header count={notifications.length} />}
            ListFooterComponent={<Seperator />}
            ListEmptyComponent={
              <Text style={[styles.notfound, { paddingTop: h * 20 }]}>
                No New Notifications
              </Text>
            }
          />
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "92%",
    borderRadius: 24,
    backgroundColor: "rgba(173, 216, 230, 0.25)",
    paddingHorizontal: 15 * w,
    alignSelf: "center",
    paddingTop: h * 25,
  },

  title: {
    fontFamily: "Poppins_600SemiBold",
    color: "#565555",
    fontSize: h * 12.5 + w * 12.5,
    textAlign: "center",
  },

  friends: {
    fontFamily: "Inter_600SemiBold",
    color: "#565555",
    fontSize: h * 8 + w * 8,
    paddingLeft: w * 4,
    marginTop: h * 25,
    marginBottom: h * 15,
  },
  notfound: {
    fontFamily: "Inter_700Bold",
    color: "#565555",
    fontSize: h * 8 + w * 8,
    textAlign: "center",
  },
});
