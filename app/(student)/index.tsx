import { View, Text, TextInput } from "@/components/Themed";
import { StyleSheet, ScrollView, Pressable} from "react-native";
import { useUserStore } from "@/hooks/useStore";
import { useState, useEffect, } from "react";
import { Image } from "expo-image";
import SearchResult from "@/components/SearchResult";
import { Feather, Ionicons } from "@expo/vector-icons";
import {w, h, OS} from "../_layout"
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import SimilarStudents from "@/components/SimilarStudents";
import AnimatedPressable from "@/components/AnimatedPressable";
import { formatFirstName } from "@/utils";
import * as Haptics from '@/components/Haptics';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSequence,
    } from 'react-native-reanimated';


const imgSource2 = require("@/assets/images/bino.svg");

export default function Index() {

    const [click, setClick] = useState<number>(0);
    const [fetching, setFetching] = useState<boolean>(false)
    const router = useRouter();
    const {user} = useUserStore();
    const [value, setValue] = useState<string>("")
    const imgSource = user?.picture ?? require("@/assets/images/no-dp.svg");
    
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

    
    if(click === 1)
        return (<SearchResult value={value} fetching={fetching} setFetching={setFetching} setValue={setValue} setClick={setClick}/>);

    if(click === 2)
        return (<SimilarStudents id={user?._id ?? ""} fetching={fetching} setFetching={setFetching} setClick={setClick}/>)
  return (
    <ScrollView 
    automaticallyAdjustKeyboardInsets={true}
      keyboardDismissMode="none"
      contentContainerStyle={styles.container}
      style={{backgroundColor: '#FFFFFF'}}>
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
                    Haptics.triggerHaptic('impact-2');
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
                onPress ={() => {
                Haptics.triggerHaptic('impact-2');
                setFetching(true);
                setClick(1);
                }}
                hitSlop={15}
                style={styles.searchIcon}
            >
              <Feather name="search" color="black" size={19} />
          </AnimatedPressable>
            </View>
            <View style={styles.bell}>
                <Ionicons name="notifications-outline" color="black" size={19} />
            </View>
        </View>
        
        
        <AnimatedPressable
        onPress={() => {
            Haptics.triggerHaptic('impact-3');
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
              <Image source={imgSource2} style={{ width: 135 * w, height: 68 * h }} />
            </View>
            <View style={{ justifyContent: 'center', rowGap: h }}>
              <Text style={styles.findTwin}>Find your Study Twin</Text>
              <Text style={styles.findTwinSubText}>and learn together like never before!</Text>
            </View>
          </LinearGradient>
      </AnimatedPressable>


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
        fontSize: 8.25*w+8.25*h,
    },

    findTwinSubText: {
        color: "#FFFEFE",
        fontFamily:'Inter_400Regular',
        fontSize:4.75*h+4.75*w,
    }
});

