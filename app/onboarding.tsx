import { Text, View } from "@/components/Themed";
import { StyleSheet, Pressable, ScrollView,} from "react-native";
import { useRouter, Redirect } from "expo-router";
import { useState, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import DashedProgress from "@/components/DashedProgress";
import LottieView from "lottie-react-native";
import { useUserStore } from "@/hooks/useStore";
import { width, height} from "./_layout";
import { url } from "@/constants/Server";
import axios from "axios";
import Feather from "@expo/vector-icons/Feather"
import SubmitButton from "@/components/buttons/SubmitButton";



const onboardingData = [
  {
    id: '1',
    title: 'Discover Your Learning Style',
    description: 'Answer a series of curated questions to unlock your unique learning style and get a personalized educational experience tailored just for you.',
    image: require('@/assets/images/onboard1.json'),
  },
  {
    id: '2',
    title: 'Meet Your Study Twin',
    description: 'Get matched with peers who share your learning style — collaborate smarter and grow together through aligned thinking.',
    image: require('@/assets/images/onboard2.json'), 
  },
  {
    id: '3',
    title: 'Join Your Learning Style Group',
    description: 'Be part of focused study groups built around your learning style. Learn, share, and succeed with peers who understand your way of thinking.',
    image: require('@/assets/images/onboard3.json'), 
  }
];

export default function Onboarding() {
  
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const {user, token, setUser} = useUserStore();
 

  const handleNext = () => {
    
   
    if (currentPage < onboardingData.length - 1) {
      const nextPage = currentPage + 1;
      scrollViewRef.current?.scrollTo({
        x: nextPage * (width*0.92),
        animated: true,
      });
      
      
    } else {
      handleSkip();
    }
  };

  const handleSkip = () => {
   
    updateUserNewStatus();
    if(!user?.isSurveyCompleted) router.replace('/(student)/analytics')
    else router.replace("/(student)");
    
  };

  const handleScroll = (event: any) => {
     
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      setCurrentPage(Math.ceil(contentOffsetX/width));
  };

  const updateUserNewStatus = async () => {
    try {
      const res = await axios.patch(`${url}/student/profile`, {newUser: false}, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "userid": user?._id
        },
        timeout: 1000 * 15,
      });
      setUser({...user, newUser: res.data.newUser});
    } catch (e:any) {}
  }

  
  //redirect back to index if user has not selected a role
  if (!user?.role) return <Redirect href="/" />
  //redirect back to login if user is not authenticated
  else if (!token) return <Redirect href="/login" />
  //redirect to student or admin if not a new user
  else if (!user?.newUser) return <Redirect href={user.role === 'student' ? "/(student)" : "/(admin)"}/>

  
  return (
  
      
      <LinearGradient
        style={styles.container}
        colors={["#ADD8E6", "#EAF5F8"]}
        locations={[0.27, 1]}
      >
        
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={20}
          contentContainerStyle={{ alignItems: 'center', flexGrow:1 }}
        >
          {onboardingData.map((item, index) => (
            <View key={item.id} style={styles.slide}
              >
              <View style={styles.imageContainer}>
                    <LottieView source={item.image} style={[styles.image, { maxHeight: height * 0.35 }]} resizeMode="contain" autoPlay={true} loop={true}/>
              </View>

              <View style={styles.contentContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.bottomControls}>
          <View style={styles.progressContainer}>
            <DashedProgress
              totalDashes={onboardingData.length}
              focusedDash={currentPage+1}
              onPress={()=> {}}
            />
          </View>

          
          <View style={styles.controlsRow}>
            <Pressable onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Skip intro</Text>
            </Pressable>

            <SubmitButton 
            onPress={handleNext} 
            android_ripple={{ color: 'rgba(255, 255, 255, 0.2)' }} 
            text="" 
            style={styles.nextButton}
            Icon={()=>Icon}
            />
          </View>
        </View>
      </LinearGradient>
    
  );
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    alignSelf: 'center',
    backgroundColor: "rgba(173, 216, 230, 0.25)",
    width: "92%",
    borderRadius: 24,
    
  },

  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    width:width*0.92,
  },

  imageContainer: {
    flex: 0.9,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '5%',
  },

  image: {
    width: '92%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'cover',
  },

  contentContainer: {
    flex: 0.5,
    width: '100%',
    alignItems: 'center',
  },

  title: {
    fontFamily: "Poppins_700Bold",
    color: "#565555",
    fontSize: 20,
    textAlign: "center",
    marginBottom: 12,
  },

  description: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: "rgba(0, 0, 0, 0.70)",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 24,
  },

  bottomControls: {
    paddingBottom: 32,
    alignItems: 'center',
  },

  progressContainer: {
    marginBottom: 24,
    alignSelf: 'center',
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 32,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontFamily: "Inter_600SemiBold",
    color: "#007BFF",
    textDecorationLine: "underline",
    fontSize: 16,
  },

  nextButton: {
    width: height * 0.06,
    height: height * 0.06,
    borderRadius: height * 0.03,
    backgroundColor: '#007BFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  arrowContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})

const Icon = <View style={styles.arrowContainer}>
        <Feather size={28} name="chevron-right" color='white' />
      </View>