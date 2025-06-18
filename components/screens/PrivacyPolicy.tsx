import { View, Text } from "@/components/Themed";
import Modal from "react-native-modal";
import { StyleSheet, Pressable, ScrollView } from "react-native";
import { height, width, h, w } from "../../app/_layout";

type Props = {
    isVisible: boolean,
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
}


export default function PrivacyPolicy({isVisible, setIsVisible}: Props) {
    return (
        <Modal
                isVisible={isVisible}
                hasBackdrop={true}
                customBackdrop={
                  <Pressable onPress={()=>setIsVisible(false)} style={styles.backdrop}></Pressable>
                }
                animationIn="fadeIn"
                animationOut="fadeOut"
              >
                <ScrollView
                style={styles.container}
                automaticallyAdjustKeyboardInsets={true}
                keyboardDismissMode="none"
                contentContainerStyle={{alignItems:'flex-start', paddingBottom:h*25}}
                >
                  <Text style={styles.title}>Privacy Policy</Text>
                  <Text style={[styles.paraBold, {paddingTop:h*5, alignSelf:'center'}]}>Last Updated: March 31, 2025</Text>
                  <View style={{paddingTop: h*20, paddingRight:w*25}}>
                    <Text style={styles.para}>At <Text style={styles.paraBold}>EduMatch</Text>, we are committed to protecting your privacy in accordance with Pakistani laws, including the principles of the Personal Data Protection Bill 2023 (if enacted) and general data protection practices. This Privacy Policy explains how we collect, use, share, and protect your personal information when you use our mobile application ("the App") in Karachi, Sindh, Pakistan. By using the App, you consent to the practices described in this Privacy Policy.</Text>
                    <Text style={[styles.paraBold, {paddingTop:h*20}]}>1. Information we collect</Text>
                    <Text style={styles.para}>We collect the following types of information, keeping in mind the educational context of Karachi:</Text>
                    
                    <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                        <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.paraBold}>Information you provide:</Text>
                    </View>
                    <View style={{flexDirection:'row', paddingLeft:25*w, columnGap:w*5}}>
                            <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.para}>Account Information: When you sign up, we collect your name, email address, university name (e.g., University of Karachi, NED University), date of birth, and gender, as these are common fields required by educational apps in Pakistan.</Text>
                    </View>
                    <View style={{flexDirection:'row', paddingLeft:25*w, columnGap:w*5}}>
                            <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.para}>User Content: Study notes, flashcards, schedules, and messages you create or share within the App.</Text>
                    </View>
                    <View style={{flexDirection:'row', paddingLeft:25*w, columnGap:w*5}}>
                            <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.para}>Communications: Information you provide when you contact us for support, which may be routed through our Karachi-based support team.</Text>
                    </View>

                    <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                        <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.paraBold}>Automatically Collected Information:</Text>
                    </View>
                    <View style={{flexDirection:'row', paddingLeft:25*w, columnGap:w*5}}>
                            <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.para}>Usage Data: Information about how you use the App, such as pages visited, features used, and time spent, to improve the App for Karachi students.</Text>
                    </View>
                    <View style={{flexDirection:'row', paddingLeft:25*w, columnGap:w*5}}>
                            <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.para}>Device Information: Device type, operating system, IP address, and unique device identifiers, which may be collected to ensure compatibility with devices commonly used in Karachi.</Text>
                    </View>
                    <View style={{flexDirection:'row', paddingLeft:25*w, columnGap:w*5}}>
                            <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.para}>Analytics: We use tools like Google Analytics to collect anonymized data about App usage, ensuring compliance with Pakistani data protection principles.</Text>
                    </View>
                    <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                        <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.paraBold}>Third-Party Information:</Text>
                    </View>
                    <View style={{flexDirection:'row', paddingLeft:25*w, columnGap:w*5}}>
                            <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.para}>If you connect the App to third-party services (e.g., University of Karachi’s student portal, cloud storage), we may collect information such as your university ID or files you choose to sync, with your consent.</Text>
                    </View>


                    <Text style={[styles.paraBold, {paddingTop:h*20}]}>2. How We Use Your Information</Text>
                    <Text style={styles.para}>We use your information to:</Text>
                    <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                            <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.para}>Provide and improve the App’s functionality (e.g., saving your study notes, enabling group collaboration for Karachi students).</Text>
                    </View>
                    <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                            <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.para}>Personalize your experience (e.g., recommending study resources based on your university or courses, such as those offered by the University of Karachi or Aga Khan University).</Text>
                    </View>
                    <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                            <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.para}>Communicate with you (e.g., sending notifications about updates or support responses, considering Karachi's time zone, PKT).</Text>
                    </View>
                    <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                            <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.para}>Analyze usage patterns to enhance the App's performance, especially for students in Karachi, where literacy rates are higher (around 75% in urban areas) but access to digital tools varies.</Text>
                    </View>
                    <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                            <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.para}>Comply with legal obligations under Pakistani law, such as responding to requests from the Federal Investigation Agency (FIA) in Karachi.</Text>
                    </View>

                    <Text style={[styles.paraBold, {paddingTop:h*20}]}>3. How We Share Your Information</Text>
                    <Text style={styles.para}>We do not sell your personal information. We may share your information in the following cases, ensuring compliance with Pakistani law:</Text>
                    <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                    <Text style={styles.paraBold}>{"\u2022"}</Text>
                    <Text style={styles.para}><Text style={styles.paraBold}>With Your Consent:</Text> If you choose to share your study notes or collaborate with others, your User Content may be visible to other users in Karachi or beyond.</Text>
                    </View>
                    <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                    <Text style={styles.paraBold}>{"\u2022"}</Text>
                    <Text style={styles.para}><Text style={styles.paraBold}>Service Providers:</Text> We work with third-party providers (e.g., cloud storage, analytics) to operate the App. These providers are bound by confidentiality agreements and may only use your data to provide their services, in line with Pakistani data protection principles.</Text>
                    </View>
                    <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                    <Text style={styles.paraBold}>{"\u2022"}</Text>
                    <Text style={styles.para}><Text style={styles.paraBold}>Legal Requirements:</Text> We may disclose your information if required by Pakistani law, such as under PECA 2016, or to protect the rights, safety, or property of <Text style={styles.paraBold}>EduMatch</Text> or others. This may include cooperation with the Sindh Education Department or the FIA.</Text>
                    </View>
                    <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                    <Text style={styles.paraBold}>{"\u2022"}</Text>
                    <Text style={styles.para}><Text style={styles.paraBold}>Business Transfers:</Text> If <Text style={styles.paraBold}>EduMatch</Text> is acquired or merged, your information may be transferred as part of the transaction, with notice to users in Karachi.</Text>
                    </View>

                    <Text style={[styles.paraBold, {paddingTop:h*20}]}>4. Data Security</Text>
                    <Text style={styles.para}>We use industry-standard measures (e.g., encryption, secure servers) to protect your information, especially given Karachi's high cybercrime rates. However, no system is completely secure, and we cannot guarantee the absolute security of your data, particularly during power outages or network disruptions common in Karachi</Text>

                    <Text style={[styles.paraBold, {paddingTop:h*20}]}>5. Your Choices and Rights</Text>
                    <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                    <Text style={styles.paraBold}>{"\u2022"}</Text>
                    <Text style={styles.para}><Text style={styles.paraBold}>Access and Update:</Text> You can view and update your account information through the App's settings.</Text>
                    </View>
                    <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                    <Text style={styles.paraBold}>{"\u2022"}</Text>
                    <Text style={styles.para}><Text style={styles.paraBold}>Delete Your Account:</Text> You can delete your account at any time, which will remove your personal information and User Content (though some data may be retained as required by Pakistani law, e.g., for audit purposes).</Text>
                    </View>
                    <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                    <Text style={styles.paraBold}>{"\u2022"}</Text>
                    <Text style={styles.para}><Text style={styles.paraBold}>Opt-Out:</Text> You can opt out of non-essential notifications in the App's settings.</Text>
                    </View>
                    <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                    <Text style={styles.paraBold}>{"\u2022"}</Text>
                    <Text style={styles.para}><Text style={styles.paraBold}>Data Rights:</Text> Under Pakistani law, you may have the right to access, correct, or delete your data. Contact us to exercise these rights, and we will respond in accordance with Sindh jurisdiction requirements.</Text>
                    </View>

                    <Text style={[styles.paraBold, {paddingTop:h*20}]}>6. Children's Privacy</Text>
                    <Text style={styles.para}>The App is intended for university students aged 18 and above, in line with typical university admission ages in Karachi. We do not knowingly collect personal information from children under 10, as per global best practices and Pakistani law.</Text>
                    <Text style={[styles.paraBold, {paddingTop:h*20}]}>7. International Data Transfer</Text>
                    <Text style={styles.para}>Your information is primarily stored and processed in Pakistan. If data is transferred outside Pakistan (e.g., to cloud servers), we will ensure compliance with Pakistani data protection principles and obtain your consent where required.</Text>
                    <Text style={[styles.paraBold, {paddingTop:h*20}]}>8. Third-Party Links</Text>
                    <Text style={styles.para}>The App may contain links to third-party websites or services (e.g., University of Karachi's portal, Sindh Education Department resources). We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies.</Text>
                    <Text style={[styles.paraBold, {paddingTop:h*20}]}>9. Changes to this Privacy Policies</Text>
                    <Text style={styles.para}>We may update this Privacy Policy to reflect changes in Pakistani law, such as updates to the Personal Data Protection Bill 2023, or Sindh educational policies. If we make significant changes, we will notify you via the App or email. Your continued use of the App after such changes constitutes acceptance of the updated Privacy Policy.</Text>
                    <Text style={[styles.paraBold, {paddingTop:h*20}]}>10. Contact Us</Text>
                    <Text style={styles.para}>If you have questions about this Privacy Policy or how we handle your data, please reach us at:</Text>
                    <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                        <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.para}><Text style={styles.paraBold}>Email:</Text> edumatch@gmail.com</Text>
                    </View>
                    <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                        <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.para}><Text style={styles.paraBold}>Address:</Text> Muhammad Ali Jinnah University, Karachi, Pakistan</Text>
                    </View>
                  </View>
                </ScrollView>
              </Modal>
    )
}

const styles = StyleSheet.create({

    container: {
        paddingVertical: h*20,
        backgroundColor: "#E0F7FF",
        borderRadius: 24,
        width:width*0.90,
        maxHeight:height*0.82,
        paddingHorizontal:w*15,
        alignSelf:'center',
    },

    backdrop: {
    flex: 1,
    backgroundColor: "black",
    opacity: 0.4,
    

    },

    title: {
        fontFamily: 'Poppins_700Bold',
        fontSize: h*30,
        color: "#565555",
        textDecorationLine:'underline',
        alignSelf:'center'
    },

    paraBold: {
        fontFamily: 'Inter_700Bold',
        fontSize: 14*h,
    },
    para: {
        fontFamily: 'Inter_400Regular',
        fontSize: 14*h,
        
        
       
        
    }
})