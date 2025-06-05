import { Text, View } from "@/components/Themed";
import { StyleSheet, Pressable, ScrollView,} from "react-native";
import { useRouter } from "expo-router";
import { useState, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import DashedProgress from "@/components/DashedProgress";
import NextButton from "@/components/NextButton";
import LottieView from "lottie-react-native";
import { w, h, width, height} from "../app/_layout";


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

export default function onboarding() {
  
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
 

  const handleNext = () => {
   
    if (currentPage < onboardingData.length - 1) {
      const nextPage = currentPage + 1;
      scrollViewRef.current?.scrollTo({
        x: nextPage * (width*0.92),
        animated: true,
      });
      
      
    } else {
      router.replace("/(student)");
    }
  };

  const handleSkip = () => {
    router.replace("/(student)");
  };

  const handleScroll = (event: any) => {

      const contentOffsetX = event.nativeEvent.contentOffset.x;
      setCurrentPage(Math.ceil(contentOffsetX/width));
  };

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

            <NextButton onPress={handleNext} />
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
})