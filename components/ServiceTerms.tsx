import { View, Text } from "@/components/Themed";
import Modal from "react-native-modal";
import { StyleSheet, Pressable, ScrollView } from "react-native";
import { height, width, h, w, base_height, scale, fontScale } from "../app/_layout";

type Props = {
    isVisible: boolean,
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>,
}


export default function ServiceTerms({isVisible, setIsVisible}: Props) {

    
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
                  <Text style={styles.title}>Terms of Service</Text>
                  <Text style={[styles.paraBold, {paddingTop:h*5, alignSelf:'center'}]}>Last Updated: March 31, 2025</Text>
                  <View style={{paddingTop: h*20, paddingRight:w*25}}>
                    <Text style={styles.para}>Welcome to <Text style={styles.paraBold}>EduMatch</Text>, a mobile application designed to help university students manage their studies, collaborate with peers, and access educational resources. By downloading, accessing, or using the App, you agree to be bound by these Terms of Service ("Terms"). If you do not agree with these Terms, please do not use the App.</Text>
                    <Text style={[styles.paraBold, {paddingTop:h*20}]}>1. Acceptance of Terms</Text>
                    <Text style={styles.para}>By creating an account or using the App, you confirm that you are at least 10 years old (or the age of majority in your jurisdiction) and agree to these Terms. If you are using the App on behalf of an organization (e.g., a university or study group), you represent that you have the authority to bind that organization to these Terms.</Text>
                    <Text style={[styles.paraBold, {paddingTop:h*20}]}>2. Use of the App</Text>
                    <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                        <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.para}><Text style={styles.paraBold}>Permitted Use:</Text> The App is intended for personal, non-commercial use by university students to assist with studying, scheduling, note-taking, and collaboration.</Text>
                    </View>
                    <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                        <Text style={styles.paraBold}>{"\u2022"}</Text>
                    <Text style={styles.para}><Text style={styles.paraBold}>Prohibited Use:</Text> You may not:</Text>
                    </View>
                    <View style={{flexDirection:'row', paddingLeft:25*w, columnGap:w*5}}>
                            <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.para}>Use the App for any illegal or unauthorized purpose.</Text>
                    </View>
                    <View style={{flexDirection:'row', paddingLeft:25*w, columnGap:w*5}}>
                            <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.para}>Share, upload, or distribute content that is harmful, offensive, or infringes on the rights of others (e.g., copyrighted material, defamatory content).</Text>
                    </View>
                    <View style={{flexDirection:'row', paddingLeft:25*w, columnGap:w*5}}>
                            <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.para}>Attempt to hack, reverse-engineer, or interfere with the App's functionality.</Text>
                    </View>
                    <View style={{flexDirection:'row', paddingLeft:25*w, columnGap:w*5}}>
                            <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.para}>Use the App to harass, bully, or harm others.</Text>
                    </View>
                    <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                        <Text style={styles.paraBold}>{"\u2022"}</Text>
                    <Text style={styles.para}><Text style={styles.paraBold}>Account Responsibility:</Text> You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</Text>
                    </View>
                    <Text style={[styles.paraBold, {paddingTop:h*20}]}>3. User Generated Content</Text>
                    <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                            <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.para}>You may create, upload, or share content such as study notes, flashcards, or group messages ("User Content").</Text>
                    </View>
                    <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                            <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.para}>By uploading User Content, you grant <Text style={styles.paraBold}>EduMatch</Text> a non-exclusive, royalty-free, worldwide license to use, store, and display your content solely for the purpose of operating and improving the App.</Text>
                    </View>
                    <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                            <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.para}>You are responsible for ensuring that your User Content does not violate any laws or third-party rights (e.g., copyright, privacy).</Text>
                    </View>
                    <Text style={[styles.paraBold, {paddingTop:h*20}]}>4. Intellectual Property</Text>
                    <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                            <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.para}>The App, including its design, code, and content (excluding User Content), is owned by <Text style={styles.paraBold}>EduMatch</Text> or its licensors and is protected by copyright, trademark, and other intellectual property laws.</Text>
                    </View>
                    <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                            <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.para}>You may not copy, modify, distribute, or create derivative works of the App without prior written permission.</Text>
                    </View>
                    <Text style={[styles.paraBold, {paddingTop:h*20}]}>5. Third Party Services</Text>
                    <Text style={styles.para}>The App may integrate with third-party services (e.g., cloud storage, university portals). Your use of these services is subject to their respective terms and privacy policies. <Text style={styles.paraBold}>EduMatch</Text> is not responsible for the performance or security of third-party services.</Text>
                  <Text style={[styles.paraBold, {paddingTop:h*20}]}>6. Termination</Text>
                  <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                            <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.para}>We reserve the right to suspend or terminate your account if you violate these Terms or engage in behavior that harms the App or its users.</Text>
                    </View>
                    <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                            <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.para}>You may delete your account at any time through the App's settings. Upon deletion, your User Content may be removed, but some data (e.g., backups) may be retained as required by law.</Text>
                    </View>
                    <Text style={[styles.paraBold, {paddingTop:h*20}]}>7. Disclaimers</Text>
                  <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                            <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.para}>The App is provided "as is" without warranties of any kind, express or implied. We do not guarantee that the App will be error-free, secure, or available at all times.</Text>
                    </View>
                    <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                            <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.para}><Text style={styles.paraBold}>EduMatch</Text> is not responsible for the accuracy or reliability of User Content or third-party resources accessed through the App.</Text>
                    </View>
                    <Text style={[styles.paraBold, {paddingTop:h*20}]}>8. Limitation of Liability</Text>
                    <Text style={styles.para}>To the fullest extent permitted by law, <Text style={styles.paraBold}>EduMatch</Text> shall not be liable for any indirect, incidental, or consequential damages (e.g., loss of data, academic performance) arising from your use of the App.</Text>
                    <Text style={[styles.paraBold, {paddingTop:h*20}]}>9. Changes to These Terms</Text>
                    <Text style={styles.para}>We may update these Terms from time to time. If we make significant changes, we will notify you via the App or email. Your continued use of the App after such changes constitutes acceptance of the updated Terms.</Text>
                    <Text style={[styles.paraBold, {paddingTop:h*20}]}>10. Governing Laws</Text>
                    <Text style={styles.para}>These Terms are governed by the laws of Pakistan, with specific adherence to the jurisdiction of Sindh, where Karachi courts will have exclusive jurisdiction over any disputes arising from these Terms. This aligns with the legal framework for educational apps operating in Karachi.</Text>
                    <Text style={[styles.paraBold, {paddingTop:h*20}]}>11. Contact Us</Text>
                    <Text style={styles.para}>If you have questions about these Terms, please contact us at:</Text>
                    <View style={{flexDirection:'row', paddingLeft:7*w, columnGap:w*5}}>
                        <Text style={styles.paraBold}>{"\u2022"}</Text>
                        <Text style={styles.para}><Text style={styles.paraBold}>Email:</Text> sgs@gmail.com</Text>
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
        paddingHorizontal:w*15,
        alignSelf:'center',
        maxHeight:height*0.82,
        
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