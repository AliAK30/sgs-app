import { View, Text, TextInput } from "@/components/Themed";
import { StyleSheet, ScrollView, Pressable, RefreshControl, FlatList} from "react-native";
import { useUserStore, useGroupStore, useFriendsStore } from "@/hooks/useStore";
import { useState, useEffect, } from "react";
import { Image } from "expo-image";
import SearchResult from "@/components/screens/SearchResult";
import { Feather, Ionicons} from "@expo/vector-icons";
import {w, h} from "../_layout"
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import SimilarStudents from "@/components/screens/SimilarStudents";
import Notifications from "@/components/screens/Notifications";
import AnimatedPressable from "@/components/AnimatedPressable";
import { useAlert } from "@/hooks/useAlert";
import {triggerHaptic, formatFirstName} from '@/utils';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    } from 'react-native-reanimated';
import { useNotificationsStore } from "@/hooks/useStore";
import { useNetInfo } from "@react-native-community/netinfo";
import StyledGroup from "@/components/StyledGroup";

const imgSource2 = require("@/assets/images/bino.svg");

const defaultImageSrc = require("@/assets/images/no-dp.svg");

function Seperator() {
  return <View style={{ paddingHorizontal: w * 6 }}></View>;
}

function Header({text}:any) {
  return <Text style={styles.friends}>{text}</Text>;
}

export default function Index() {

    const [click, setClick] = useState<number>(0);
    const [fetching, setFetching] = useState<boolean>(false)
    const router = useRouter();
    const {user, token} = useUserStore();
    const {groups} = useGroupStore();
    const {friends} = useFriendsStore();
    const [value, setValue] = useState<string>("")
    const imgSource = user?.picture ?? defaultImageSrc;
    const [refreshing, setRefreshing] = useState(false);
    const {notifications} = useNotificationsStore();
    const {Alert, openAlert} = useAlert();
    const {isConnected} = useNetInfo();


    const onRefresh = async () => {
        setRefreshing(true);
        // Refresh user data and any other relevant data here
        // Example: await refetchUser();
        // Example: await refetchPeers();
        // If you have API calls or store actions, trigger them here
        // For demonstration, we'll just log:
        setTimeout(() => setRefreshing(false), 1000); // Simulate refresh
    };

     // Typewriter effect state
    const [displayedText, setDisplayedText] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);

    // Animation values
    const emojiRotation = useSharedValue(0);

    

    // Typewriter effect
    useEffect(() => {
        const fullText = `Hey ${formatFirstName(user?.first_name)} `;
        let currentIndex = 0;

        const typeInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
            setDisplayedText(fullText.slice(0, currentIndex));
            currentIndex++;
        } else {
            clearInterval(typeInterval);
            setShowEmoji(true);
            // Start emoji wave animation after typewriter finishes
            emojiRotation.value = withSequence(
            withTiming(20, { duration: 200 }),
            withTiming(-20, { duration: 200 }),
            withTiming(20, { duration: 200 }),
            withTiming(0, { duration: 200 })
            );
        }
        }, 80);

        return () => clearInterval(typeInterval);
    }, [user?.first_name]);

    // Animated styles

    const emojiAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${emojiRotation.value}deg` }],
    }));

    const handleSearch = () => {
        triggerHaptic('impact-2');
        setFetching(true);
        setClick(1);
    }
    
    if(click === 1)
        return (<SearchResult value={value} fetching={fetching} setFetching={setFetching} setValue={setValue} setClick={setClick}/>);

    if(click === 2)
        return (<SimilarStudents id={user?._id ?? ""} fetching={fetching} setFetching={setFetching} setClick={setClick}/>)

    if(click === 3)
        return (<Notifications goBack={()=>setClick(0)}/>)

  return (
    <ScrollView 
    automaticallyAdjustKeyboardInsets={true}
      keyboardDismissMode="none"
      contentContainerStyle={styles.container}
      style={{backgroundColor: '#FFFFFF'}}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        >
            <Alert/>
        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.title}>{displayedText}</Text>
                {showEmoji && (
                <Animated.Text style={[styles.title, emojiAnimatedStyle]}>
                    👋
                </Animated.Text>
                )}
            </View>
            <Text style={styles.belowTitle}>Connect, Collaborate, Learn in your style!</Text>
            </View>
            <Pressable
            onPress={
                () => {
                    triggerHaptic('impact-2');
                    router.push("/(student)/peers");
                }
            }>
            <Image source={imgSource} style={{width:h*26+w*26, height:h*26+w*26, borderRadius:50}}/>
            </Pressable>
            
        </View>
        <View style={{flexDirection:'row', columnGap:w*8}}>
            <View style={styles.searchView}>
                <TextInput style={styles.search} placeholder="Find peers by name.." inputMode="text" value={value} onChangeText={setValue} placeholderTextColor="#85878D"/>
                <AnimatedPressable
                onPress ={handleSearch}
                hitSlop={15}
                style={styles.searchIcon}
            >
              <Feather name="search" color="black" size={19} />
          </AnimatedPressable>
            </View>
            <View style={styles.bell}>
                {notifications.length > 0 && <View style={styles.badgeView}><Text style={styles.badge}>{notifications.length}</Text></View>}
                <Ionicons name="notifications-outline" color="black" size={19} onPress={()=>setClick(3)}/>
            </View>
        </View>
        
        
        <AnimatedPressable
        onPress={() => {
            triggerHaptic('impact-3');
            setClick(2);
        }}

        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.30,
          elevation: 20,
          borderRadius: 20,
        }}
      >
          <LinearGradient
            style={{ flexDirection: 'row', borderRadius: 20, height: h * 40 + w * 40 }}
            colors={["rgba(60, 60, 60, 1)", "rgba(35, 35, 35, 1)", "#1A1A1A"]}
            locations={[0.17, 0.60, 0.70]}
            start={{ x: 0.5, y: 0 }}
          >
            <View style={{ justifyContent: 'flex-end', rowGap: h }}>
              <Image source={imgSource2} style={{ width: 130 * w, height: 67 * h }} />
            </View>
            <View style={{ justifyContent: 'center', rowGap: h }}>
              <Text style={styles.findTwin}>Find your Study Twin</Text>
              <Text style={styles.findTwinSubText}>and learn together like never before!</Text>
            </View>
          </LinearGradient>
      </AnimatedPressable>

      <View>
        <Header text="Your Groups"/>
        <View style={{flexDirection:'row'}}>
      {isConnected === false ? (
                <Text style={styles.notfound}>No Internet Connection</Text>
              ) : groups.length>0 ?
                <FlatList
                  data={groups.slice(0, 3)}
                  renderItem={({ item,index }) => <StyledGroup {...item} index={index}/>}
                  keyExtractor={(item, index) => item?._id ?? ""}
                  ItemSeparatorComponent={Seperator}
                  horizontal={true}
                  ListFooterComponent={<Seperator />}
                  showsHorizontalScrollIndicator={false}
                /> : <Text style={styles.notfound}>No Groups</Text>
              }
         </View>
        </View>

              <View>
                <Header text="Your Favourite Peers"/>
                <View style={{flexDirection:'row', columnGap:w*5}}>
                    {friends.length> 0 ? ( friends.slice(0, 7).map((friend)=>{
                        const src = friend?.picture ?? defaultImageSrc;
                        return (<View key={friend._id} style={{alignItems:'center', rowGap:h*2}}>
                            <Image  source={src} style={{width:h*26+w*26, height:h*26+w*26, borderRadius:50}}/>
                            <Text style={styles.peerName}>{formatFirstName(friend.first_name)}</Text>
                            </View>);        
                    })) :
                    <Text style={styles.notfound}>No Peers Added</Text>
                    }

                </View>
              </View>



    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgba(173, 216, 230, 0.25)",
        borderRadius: 24,
        paddingHorizontal: w*15,
        paddingTop: h*25,
        width:"92%",
        alignSelf:'center',
        rowGap:h*20
      },

    title: {
        fontFamily: 'Poppins_600SemiBold',
        color: "#565555",
        fontSize: 14*w+14*h
    },

    belowTitle: {
        fontFamily: 'Inter_500Medium',
        color:'#85878D',
        fontSize: w*5.5+h*5.5,
    },
    searchView: {
        flex:1,
        flexDirection:'row',
        backgroundColor:'#FFFFFF',
        borderRadius:9.4,
        borderColor:'#E7EAE9',
        borderWidth:0.78,
        paddingVertical:h*10,
        paddingHorizontal:w*10,
        alignItems:'center',
        columnGap:w*25,
        
    },

    searchIcon: {
        padding: 5,
        borderRadius: 5,
    },

    bell: {
        backgroundColor:'#FFFFFF',
        borderRadius:9.4,
        borderColor:'#E7EAE9',
        borderWidth:0.78,
        paddingVertical:h*10,
        paddingHorizontal:w*10,
        alignItems: "center",
        justifyContent:'center',
        position:'relative',
    },
    search: {
        flex:1,
        fontFamily: 'Inter_500Medium',
        color:'#85878D',
        fontSize: w*8.5+h*8,
        //outlineWidth:0
    },

    findTwin: {
        color: '#ADD8E6',
        fontFamily:'Inter_600SemiBold',
        fontSize: 8.15*w+8.18*h,
    },

    findTwinSubText: {
        color: "#FFFEFE",
        fontFamily:'Inter_400Regular',
        fontSize:4.75*h+4.75*w,
    },

    badgeView: {
        
    position: 'absolute',
    backgroundColor: 'red',
    borderRadius: 50,
    height:19,
    width:19,
    justifyContent: 'center',
    alignItems: 'center',
    right:0,
    top:0,
    },

    badge: {
        fontSize:w*5+h*5,
        fontFamily:'Inter_400Regular',
        color:'white',
        textAlign:'center'
    },

    friends: {
    fontFamily: "Inter_700Bold",
    color: "#565555",
    fontSize: h * 8 + w * 8,
    paddingLeft: w * 4,
    marginTop: h * 5,
    marginBottom: h * 15,
  },
  notfound: {
    fontFamily: "Inter_700Bold",
    color: "#565555",
    fontSize: h * 8 + w * 8,
    textAlign: "center",
    flex:1,
  },

  peerName: {
        fontFamily: 'Inter_600SemiBold',
        color:'#565555',
        fontSize: w*5+h*5,
    },
});

