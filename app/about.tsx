import { View, Text } from "@/components/Themed";
import { StyleSheet, ScrollView, Pressable, Linking } from "react-native";
import { useState, useEffect } from "react";
import { Image } from "expo-image";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { w, h, OS } from "./_layout";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import AnimatedPressable from "@/components/AnimatedPressable";
import * as Haptics from '@/components/Haptics';
import  Back from "@/components/buttons/Back";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withDelay,
    withSequence,
    interpolate,
    useAnimatedScrollHandler,
    runOnJS,
} from 'react-native-reanimated';

// Team member data
const teamMembers = [
    {
        id: 1,
        name: "Ali Ahmed",
        role: "Full Stack Developer & Team Lead",
        quote: "Building bridges between technology and education",
        image: require("@/assets/images/team/ali.png"), // Add actual images
        social: {
            linkedin: "https://www.linkedin.com/in/ali-ahmed-khan-083a15264/",
            github: "https://github.com/AliAK30",
            email: "ali@edumatch.com"
        }
    },
    {
        id: 2,
        name: "Waleed Ahmed",
        role: "Frontend Developer & UI/UX Designer",
        quote: "Crafting experiences that make learning delightful",
        image: require("@/assets/images/team/waleed.png"),
        social: {
            linkedin: "https://linkedin.com/in/waleedaahmed",
            github: "https://github.com/waarq",
            email: "waleed@edumatch.com"
        }
    },
    {
        id: 3,
        name: "Syed Hur Abbas",
        role: "UI/UX Designer & Software Quality Tester",
        quote: "Crafting seamless experiences with precision and purpose.",
        image: require("@/assets/images/team/hur.png"),
        social: {
            linkedin: "https://www.linkedin.com/in/syedhur06/",
            github: "https://github.com/syed-hur-abbas",
            email: "hur@edumatch.com"
        }
    }
];

const supervisor = {
    name: "Dr. Imran Jami",
    role: "Project Supervisor",
    quote: "Guiding innovation in educational technology",
    image: require("@/assets/images/team/dr-jami.png"),
    social: {
        linkedin: "https://www.linkedin.com/in/dr-syed-imran-jami-5bb42211/",
        email: "imran.jami@university.edu"
    }
};

export default function About() {
    const router = useRouter();
    const scrollY = useSharedValue(0);
    const [activeSection, setActiveSection] = useState(0);

    // Animation values for staggered entrance
    const headerOpacity = useSharedValue(0);
    const problemOpacity = useSharedValue(0);
    const solutionOpacity = useSharedValue(0);
    const featuresOpacity = useSharedValue(0);
    const teamOpacity = useSharedValue(0);

    useEffect(() => {
        // Staggered entrance animations
        headerOpacity.value = withTiming(1, { duration: 600 });
        problemOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
        solutionOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
        featuresOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
        teamOpacity.value = withDelay(800, withTiming(1, { duration: 600 }));
    }, []);

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollY.value = event.contentOffset.y;
        },
    });

    // Animated styles
    const headerAnimatedStyle = useAnimatedStyle(() => ({
        opacity: headerOpacity.value,
        transform: [
            {
                translateY: interpolate(headerOpacity.value, [0, 1], [50, 0])
            }
        ]
    }));

    const problemAnimatedStyle = useAnimatedStyle(() => ({
        opacity: problemOpacity.value,
        transform: [
            {
                translateX: interpolate(problemOpacity.value, [0, 1], [-50, 0])
            }
        ]
    }));

    const solutionAnimatedStyle = useAnimatedStyle(() => ({
        opacity: solutionOpacity.value,
        transform: [
            {
                translateX: interpolate(solutionOpacity.value, [0, 1], [50, 0])
            }
        ]
    }));

    const featuresAnimatedStyle = useAnimatedStyle(() => ({
        opacity: featuresOpacity.value,
        transform: [
            {
                translateY: interpolate(featuresOpacity.value, [0, 1], [30, 0])
            }
        ]
    }));

    const teamAnimatedStyle = useAnimatedStyle(() => ({
        opacity: teamOpacity.value,
        transform: [
            {
                translateY: interpolate(teamOpacity.value, [0, 1], [40, 0])
            }
        ]
    }));

    const parallaxStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: interpolate(scrollY.value, [0, 200], [0, -50])
            }
        ]
    }));

    const openLink = async (url: string) => {
        try {
            await Linking.openURL(url);
            Haptics.triggerHaptic('impact-2');
        } catch (error) {
            console.error('Failed to open URL:', error);
        }
    };

    const SocialButton = ({ icon, onPress, color = "#565555" }: { icon: string, onPress: () => void, color?: string }) => (
        <AnimatedPressable
            onPress={onPress}
            style={[styles.socialButton, { backgroundColor: color + '15' }]}
        >
            <Ionicons name={icon as any} size={18} color={color} />
        </AnimatedPressable>
    );

    const FeatureCard = ({ icon, title, description, delay = 0 }: { icon: string, title: string, description: string, delay?: number }) => {
        const cardOpacity = useSharedValue(0);
        
        useEffect(() => {
            cardOpacity.value = withDelay(delay, withTiming(1, { duration: 500 }));
        }, []);

        const cardAnimatedStyle = useAnimatedStyle(() => ({
            opacity: cardOpacity.value,
            transform: [
                {
                    scale: interpolate(cardOpacity.value, [0, 1], [0.8, 1])
                }
            ]
        }));

        return (
            <Animated.View style={[styles.featureCard, cardAnimatedStyle]}>
                <View style={styles.featureIconContainer}>
                    <MaterialIcons name={icon as any} size={24} color="#ADD8E6" />
                </View>
                <Text style={styles.featureTitle}>{title}</Text>
                <Text style={styles.featureDescription}>{description}</Text>
            </Animated.View>
        );
    };

    const TeamMemberCard = ({ member, index }: { member: typeof teamMembers[0], index: number }) => {
        const cardScale = useSharedValue(1);

        const cardAnimatedStyle = useAnimatedStyle(() => ({
            transform: [{ scale: cardScale.value }]
        }));

        const handlePress = () => {
            cardScale.value = withSequence(
                withTiming(0.95, { duration: 100 }),
                withTiming(1, { duration: 100 })
            );
            Haptics.triggerHaptic('impact-1');
        };

        return (
            <Animated.View style={[cardAnimatedStyle]}>
                <Pressable onPress={handlePress}>
                    <LinearGradient
                        style={styles.teamCard}
                        colors={["rgba(173, 216, 230, 0.43)", "rgba(173, 216, 230, 0.07)"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Image source={member.image} style={styles.memberImage} />
                        <View style={styles.memberInfo}>
                            <Text style={styles.memberName}>{member.name}</Text>
                            <Text style={styles.memberRole}>{member.role}</Text>
                            <Text style={styles.memberQuote}>"{member.quote}"</Text>
                            <View style={styles.socialContainer}>
                                <SocialButton 
                                    icon="logo-linkedin" 
                                    onPress={() => openLink(member.social.linkedin)}
                                    color="#0077B5"
                                />
                                <SocialButton 
                                    icon="logo-github" 
                                    onPress={() => openLink(member.social.github)}
                                    color="#333"
                                />
                                <SocialButton 
                                    icon="mail-outline" 
                                    onPress={() => openLink(`mailto:${member.social.email}`)}
                                    color="#EA4335"
                                />
                            </View>
                        </View>
                    </LinearGradient>
                </Pressable>
            </Animated.View>
        );
    };

    return (
        <Animated.ScrollView
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            contentContainerStyle={styles.container}
            style={{ backgroundColor: '#FFFFFF' }}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <Animated.View style={[styles.header, headerAnimatedStyle, parallaxStyle]}>
                
                <Back onPress={() => router.push("/(student)/settings")} />
                <Text style={styles.title}>About Project</Text>
                
                {/* <View style={styles.logoContainer}>
                    <LinearGradient
                        style={styles.logoGradient}
                        colors={["#ADD8E6", "#87CEEB"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        
                    </LinearGradient>
                </View> */}
            </Animated.View>

            {/* Problem Section */}
            <Animated.View style={[styles.section, problemAnimatedStyle]}>
                <View style={styles.sectionHeader}>
                    <MaterialIcons name="question-mark" size={28} color="#FF6B6B" />
                    <Text style={styles.sectionTitle}>The Problem</Text>
                </View>
                <View style={styles.problemCard}>
                    <Text style={styles.problemText}>
                        In virtual learning environments, there is very limited support for group learning and teamwork among students. 
                        Students face challenges because courses are designed without considering different learning styles, 
                        leading to poor experiences and lack of understanding.
                    </Text>
                </View>
            </Animated.View>

            {/* Solution Section */}
            <Animated.View style={[styles.section, solutionAnimatedStyle]}>
                <View style={styles.sectionHeader}>
                    <MaterialIcons name="lightbulb" size={28} color="#4ECDC4" />
                    <Text style={styles.sectionTitle}>Our Solution</Text>
                </View>
                <LinearGradient
                    style={styles.solutionCard}
                    colors={["rgba(78, 205, 196, 0.1)", "rgba(78, 205, 196, 0.05)"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Text style={styles.solutionText}>
                        A system that identifies students' learning styles using the Felder-Silverman Learning Style Model (FSLSM) 
                        questionnaire and groups students with similar learning styles to ensure better interaction and enhanced engagement.
                    </Text>
                </LinearGradient>
            </Animated.View>

            {/* Features Section */}
            <Animated.View style={[styles.section, featuresAnimatedStyle]}>
                <View style={styles.sectionHeader}>
                    <MaterialIcons name="auto-awesome" size={28} color="#FFD93D" />
                    <Text style={styles.sectionTitle}>Key Features</Text>
                </View>
                <View style={styles.featuresGrid}>
                    <FeatureCard 
                        icon="psychology"
                        title="Learning Style Analysis"
                        description="Identify learning preferences through FSLSM questionnaire"
                        delay={0}
                    />
                    <FeatureCard 
                        icon="group"
                        title="Smart Grouping"
                        description="Match students with similar learning styles for better collaboration"
                        delay={100}
                    />
                    <FeatureCard 
                        icon="analytics"
                        title="Detailed Analytics"
                        description="Comprehensive student profiles with learning preferences"
                        delay={200}
                    />
                    <FeatureCard 
                        icon="devices"
                        title="Cross-Platform"
                        description="Available on both mobile and web platforms"
                        delay={300}
                    />
                </View>
            </Animated.View>

            {/* Team Section */}
            <Animated.View style={[styles.section, teamAnimatedStyle]}>
                <View style={styles.sectionHeader}>
                    <MaterialIcons name="people" size={28} color="#9B59B6" />
                    <Text style={styles.sectionTitle}>Meet the Team</Text>
                </View>

                {/* Supervisor */}
                <View style={styles.supervisorSection}>
                    <Text style={styles.supervisorTitle}>Project Supervisor</Text>
                    <LinearGradient
                        style={styles.supervisorCard}
                        colors={["rgba(155, 89, 182, 0.1)", "rgba(155, 89, 182, 0.05)"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Image source={supervisor.image} style={styles.supervisorImage} />
                        <View style={styles.supervisorInfo}>
                            <Text style={styles.supervisorName}>{supervisor.name}</Text>
                            <Text style={styles.supervisorRole}>{supervisor.role}</Text>
                            <Text style={styles.supervisorQuote}>"{supervisor.quote}"</Text>
                            <View style={styles.socialContainer}>
                                <SocialButton 
                                    icon="logo-linkedin" 
                                    onPress={() => openLink(supervisor.social.linkedin)}
                                    color="#0077B5"
                                />
                                <SocialButton 
                                    icon="mail-outline" 
                                    onPress={() => openLink(`mailto:${supervisor.social.email}`)}
                                    color="#EA4335"
                                />
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Team Members */}
                <View style={styles.teamGrid}>
                    <Text style={styles.teamTitle}>Team Members</Text>
                    {teamMembers.map((member, index) => (
                        <TeamMemberCard key={member.id} member={member} index={index} />
                    ))}
                </View>
            </Animated.View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>Made with ❤️ for better learning experiences</Text>
                <Text style={styles.versionText}>Version 1.0.0</Text>
            </View>
        </Animated.ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F5F7FA",
    borderRadius: 24,
    //flex:1,
    width: '92%',
    alignSelf: 'center',
    paddingTop:h*13,
    paddingHorizontal: w*13,

    },

    header: {
        paddingHorizontal: w * 15,
        paddingTop: h * 60,
        paddingBottom: h * 30,
        alignItems: 'center',
    },

    backButton: {
        position: 'absolute',
        left: w * 15,
        top: h * 60,
        padding: w * 8,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },

    logoContainer: {
        alignItems: 'center',
        rowGap: h * 8,
    },

    logoGradient: {
        paddingHorizontal: w * 24,
        paddingVertical: h * 12,
        borderRadius: 20,
    },

    title: {
      fontFamily: "Poppins_600SemiBold",
      color: "#565555",
      fontSize: h * 12.5+w*12.5,
      textAlign: 'center',
      marginBottom: h*15,
    },

    tagline: {
        fontFamily: 'Inter_500Medium',
        fontSize: w * 6 + h * 6,
        color: '#85878D',
        textAlign: 'center',
        paddingHorizontal: w * 20,
    },

    section: {
        paddingHorizontal: w * 15,
        marginBottom: h * 30,
    },

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: w * 12,
        marginBottom: h * 16,
    },

    sectionTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16 * w + 16 * h,
        color: '#565555',
    },

    problemCard: {
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderRadius: 16,
        padding: w * 20,
        borderLeftWidth: 4,
        borderLeftColor: '#FF6B6B',
    },

    problemText: {
        fontFamily: 'Inter_500Medium',
        fontSize: w * 7 + h * 7,
        color: '#565555',
        lineHeight: (w * 7 + h * 7) * 1.5,
    },

    solutionCard: {
        borderRadius: 16,
        padding: w * 20,
        borderLeftWidth: 4,
        borderLeftColor: '#4ECDC4',
    },

    solutionText: {
        fontFamily: 'Inter_500Medium',
        fontSize: w * 7 + h * 7,
        color: '#565555',
        lineHeight: (w * 7 + h * 7) * 1.5,
    },

    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: h * 16,
    },

    featureCard: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: w * 16,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 8,
    },

    featureIconContainer: {
        width: w * 50,
        height: w * 50,
        borderRadius: w * 25,
        backgroundColor: 'rgba(173, 216, 230, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: h * 12,
    },

    featureTitle: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: w * 6.5 + h * 6.5,
        color: '#565555',
        textAlign: 'center',
        marginBottom: h * 8,
    },

    featureDescription: {
        fontFamily: 'Inter_400Regular',
        fontSize: w * 5.5 + h * 5.5,
        color: '#85878D',
        textAlign: 'center',
        lineHeight: (w * 5.5 + h * 5.5) * 1.4,
    },

    supervisorSection: {
        marginBottom: h * 24,
    },

    supervisorTitle: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: w * 8 + h * 8,
        color: '#9B59B6',
        marginBottom: h * 12,
        textAlign: 'center',
    },

    teamTitle: {
        fontFamily: 'Inter_600SemiBold',
        fontSize: w * 8 + h * 8,
        color: '#50BFAF',
        marginBottom: h,
        textAlign: 'center',
    },

    supervisorCard: {
        borderRadius: 20,
        padding: w * 20,
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: w * 16,
    },

    supervisorImage: {
        width: w * 80,
        height: w * 80,
        borderRadius: w * 40,
        
    },

    supervisorInfo: {
        flex: 1,
        rowGap: h * 6,
    },

    supervisorName: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: w * 8 + h * 8,
        color: '#565555',
    },

    supervisorRole: {
        fontFamily: 'Inter_500Medium',
        fontSize: w * 6 + h * 6,
        color: '#9B59B6',
    },

    supervisorQuote: {
        fontFamily: 'Inter_400Regular',
        fontSize: w * 5.5 + h * 5.5,
        color: '#2e2f30',
        fontStyle: 'italic',
    },

    teamGrid: {
        rowGap: h * 16,
    },

    teamCard: {
        borderRadius: 20,
        padding: w * 20,
        flexDirection: 'row',
        alignItems: 'center',
        columnGap: w * 16,
    },

    memberImage: {
        width: w * 70,
        height: w * 70,
        borderRadius: w * 35,
    },

    memberInfo: {
        flex: 1,
        rowGap: h * 4,
    },

    memberName: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: w * 7.5 + h * 7.5,
        color: '#565555',
    },

    memberRole: {
        fontFamily: 'Inter_500Medium',
        fontSize: w * 6 + h * 6,
        color: '#50BFAF',
    },

    memberQuote: {
        fontFamily: 'Inter_400Regular',
        fontSize: w * 5.5 + h * 5.5,
        color: '##2e2f30',
        fontStyle: 'italic',
    },

    socialContainer: {
        flexDirection: 'row',
        columnGap: w * 8,
        marginTop: h * 4,
    },

    socialButton: {
        width: w * 32,
        height: w * 32,
        borderRadius: w * 16,
        alignItems: 'center',
        justifyContent: 'center',
    },

    footer: {
        alignItems: 'center',
        paddingHorizontal: w * 15,
        paddingTop: h * 20,
        rowGap: h * 8,
    },

    footerText: {
        fontFamily: 'Inter_500Medium',
        fontSize: w * 6 + h * 6,
        color: '#85878D',
        textAlign: 'center',
    },

    versionText: {
        fontFamily: 'Inter_400Regular',
        fontSize: w * 5 + h * 5,
        color: '#B0B3B8',
    },
});