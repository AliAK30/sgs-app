import { Text, View } from "@/components/Themed";
import {
  StyleSheet,
  Pressable,
  ScrollView,
  Dimensions,
  Image,
  SafeAreaView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DashedProgress from "@/components/DashedProgress";
import NextButton from "@/components/NextButton";
import LottieView from "lottie-react-native";
import { w, h, width, base_height } from "../app/_layout";


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
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');


  const handleNext = () => {
    if (currentPage < onboardingData.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      scrollViewRef.current?.scrollTo({
        x: nextPage * screenWidth,
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
    const pageIndex = Math.round(contentOffsetX / screenWidth);
    setCurrentPage(pageIndex);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        style={[styles.gradient, { width: Platform.OS === 'web' ? '92%' : '92%' }]}
        colors={["#ADD8E6", "#EAF5F8"]}
        locations={[0.27, 1]}
      >
        
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollView}
          contentContainerStyle={{ alignItems: 'center', minHeight: screenHeight * 0.85 }}
        >
          {onboardingData.map((item, index) => (
            <View key={item.id} style={[styles.slide, { 
              width: screenWidth * (Platform.OS === 'web' ? 0.92 : 0.92),
              minHeight: screenHeight * 0.85,
              paddingHorizontal: screenWidth * 0.04, 
              }
              ]}
              >
              <View style={styles.imageContainer}>
                    {/*<Image source={item.image} style={styles.image} resizeMode="contain"/>*/}
                    <LottieView source={item.image} style={[styles.image, { maxHeight: screenHeight * 0.35 }]} resizeMode="contain" autoPlay={true} loop={true}/>
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
              onPress={() => {}}
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
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  gradient: {
    flex: 1,
    alignSelf: 'center',
    backgroundColor: "rgba(173, 216, 230, 0.25)",
    borderRadius: 24,
    //paddingHorizontal: height * 0.024,
  },
  scrollView: {
    flex: 1,
  },

  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    //paddingHorizontal: h * 10 + w * 10,
    //marginBottom: h * 5,

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