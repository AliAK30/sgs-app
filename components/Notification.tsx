import { Text, View } from "@/components/Themed";
import { Image } from "expo-image";
import { StyleSheet } from "react-native";
import AnimatedPressable from "./AnimatedPressable";
import Profile from "./screens/Profile";
import { useState } from "react";
import { useAlert } from "@/hooks/useAlert";
import { useUserStore, useFriendsStore, useBanner, useNotificationsStore } from "@/hooks/useStore";
import { h, w } from "@/app/_layout";
import { NotificationType } from "@/types";
import { useNetInfo } from "@react-native-community/netinfo";
import SubmitButton from "./buttons/SubmitButton";
import { url } from "@/constants/Server";
import axios from "axios";
import { handleError } from "@/errors";
import Banner from "./Banner";
import { FontAwesome5 } from "@expo/vector-icons";


export default function Notification(props: NotificationType) {

  const [openProfile, setOpenProfile] = useState<boolean>(false);
  const {token, user} = useUserStore();
  const {Alert, openAlert}= useAlert();
  const {friends, setFriends} = useFriendsStore();
  const {notifications, setNotifications} = useNotificationsStore();
    const {isConnected} = useNetInfo();
    const {openBanner} = useBanner();

  

  if (props.type === "fr") {
    const handlePress = async (action:string) =>{
    try {
          if (isConnected === null || isConnected) {
                
              const res: any = await axios.put(`${url}/student/friend-request/${props.payload.requester.friendshipId}/respond`, 
                {action: action},
                {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                  "userid": user?._id
                },
                timeout: 1000 * 25,
              });
              
              if(action==='accept' && res.data) {
                const friend = {
                    _id: props.payload.requester._id,
                    first_name: props.payload.requester.first_name,
                    last_name: props.payload.requester.last_name,
                    uni_name: props.payload.requester.uni_name,
                    picture: props.payload.requester.picture,
                    isFavourite: res.data.isFavourite
                }
                setFriends([...friends, friend]);
                openBanner('success', 'Accepted Friend Request')
                setNotifications(notifications.filter((noti)=>noti._id !== props._id));
                axios.delete(`${url}/student/notifications/${props._id}`, 
                {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                  "userid": user?._id
                },
                timeout: 1000 * 25,
              });
                
              } else openBanner('fail', 'Rejected Friend Request')
            
          } else {
            openAlert("fail", "Failed!", "No Internet Connection!");
            return;
          }
        } catch (e: any) {
          handleError(e, openAlert);
        } 

  }

    const imgSource =
      props.payload.requester.picture ?? require("@/assets/images/no-dp.svg");

    return (
      <View style={styles.container}>
        <Alert/>
        <Banner/>
        {openProfile && (
          <Profile
            openProfile={openProfile}
            setOpenProfile={setOpenProfile}
            id={props.payload.requester._id ?? "1"}
            similarity={-1}
          />
        )}
        <AnimatedPressable onPress={() => setOpenProfile(true)}>
          <Image source={imgSource} style={styles.img} />
        </AnimatedPressable>
        <View style={{paddingLeft:w*8}}>
            <Text style={styles.name}>{`${props.payload.requester.first_name} ${props.payload.requester.last_name}`}</Text>
            <Text style={styles.para}>sent you a friend request</Text>
        </View>
        <View style={{flexDirection:'row', columnGap:w*4, justifyContent:'flex-end', flex:1}}>
        <SubmitButton style={styles.accept} textStyle={styles.confirmText} text="Accept" onPress={()=>handlePress('accept')}/>
        <SubmitButton  style={styles.reject} textStyle={styles.confirmText} text="Reject" onPress={()=>handlePress('decline')}/>
        </View>
      </View>
    );
  } else {
    return <View style={styles.container}>
        <View style={styles.accepted}>
            <FontAwesome5 name="check" size={20} color="white"/>
        </View>
        <View style={{paddingLeft:w*8}}>
            <Text style={styles.name}>{props.payload}</Text>
        </View>
    </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F0FFF1",
    borderRadius: 19,
    flexDirection: "row",
    paddingHorizontal: 10 * w,
    paddingVertical: 10 * h,
    borderWidth: 1.95,
    borderColor: "#F1F1F1",
    alignItems:'center',
  },

  img: {
    width: h * 25 + w * 25,
    height: h * 25 + w * 25,
    borderRadius: 50,
    
  },
  name: {
    fontFamily: "Inter_700Bold",
    fontSize: 7 * h + 7 * w,
    color: "#202244",
  },
  para: {
    fontFamily: "Inter_400Regular",
    fontSize: 5* h + 5* w,
    color: "#545454",
  },
  

  accept: {
    paddingHorizontal:w*10,
    paddingVertical:h*5,
    borderRadius:8,
    backgroundColor:"#0056D2",
    justifyContent:'center',
    alignItems:'center',
  },

  confirmText: {
    color:'white',
    fontFamily:'Inter_500Medium',
    fontSize: h*7+w*7,
    textAlign:'center'
  },

  reject: {
    paddingHorizontal:w*10,
    paddingVertical:h*5,
    borderRadius:8,
    backgroundColor:'#B3261E',
    justifyContent:'center',
    alignItems:'center',
  },

  accepted: {
    backgroundColor: "#3FDC7E",
    borderRadius:100,
    justifyContent:'center',
    alignItems:'center',
    padding:10,
    boxShadow: "0.65px 1.96px 5.23px 0px rgba(0, 0, 0, 0.10)",
  }
});
