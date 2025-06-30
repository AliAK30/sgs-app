import { Text, View, TextInput } from "@/components/Themed";
import { Image } from "expo-image";
import { Pressable, StyleSheet, ActivityIndicator } from "react-native";
import Modal from "react-native-modal";
//import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect, useRef, memo } from "react";
import { Link } from "expo-router";
import { SimpleLineIcons, Ionicons, Octicons } from "@expo/vector-icons";
import { useNetInfo } from "@react-native-community/netinfo";
import axios from "axios";
import { url } from "@/constants/Server";
import { useAlert } from "@/hooks/useAlert";
import { useUserStore } from "@/hooks/useStore";
import { h, w , width, height} from "@/app/_layout";
import { User } from "@/types";
import { PieChart, pieDataItem } from "react-native-gifted-charts";
import { ImageBackground } from "expo-image";
import { handleError } from "@/errors";
import SubmitButton from "../buttons/SubmitButton";

type Props = {
    openProfile: boolean;
    setOpenProfile: React.Dispatch<React.SetStateAction<boolean>>;
    id: string;
    similarity: number;
}

const blurImage = require("@/assets/images/blur.png")
type ExtendedUser = User & {print?: string, age?: number};

const obj: ExtendedUser = {
    _id: "6833530a6f31a0f8fe7c7071",
    first_name: "Ali",
    last_name: "Ahmed Khan",
    uni_name: "Muhammad Ali Jinnah University",
    uni_id: "677534463f4abf3b23f8b6d1",
    role: "student",
    gpa:3.5,
    gender: "Male",
    dob:  new Date("2002-06-30T00:00:00.000Z"),
    newUser: true,
    isSurveyCompleted: true,
    privacy: {
        picture: 2,
        email: 2,
        phone_number: 2,
        gpa: 2,
        learning_style: 2,
        dob:2,
    },
    phone_number:"03410837034",
    push_notifications: true,
    age: 22,
    picture: "https://edumatchstorage.blob.core.windows.net/edumatch-container/students/6833530a6f31a0f8fe7c7071/1748417786138-cropped.JPG?si=readonly&sip=0.0.0.0-255.255.255.255&spr=https&sv=2024-11-04&sr=c&sig=LrrrK7J%2F9rUxUcvRhDK%2BZsOUZILPEsaXiyb%2BPn4uJOI%3D"
}



function Profile({openProfile, setOpenProfile, id, similarity}: Props) {

    const {Alert, openAlert} = useAlert();
    const [fetching, setFetching] = useState<boolean>(false);
    const [friendStatus, setFriendStatus] = useState<"pending"|"accepted"|"blocked"| "">("");
    const [checkingLS, setCheckingLS] = useState<number>(similarity===-1 ? 0 : 2);
    const { isConnected } = useNetInfo();
    const user = useRef<ExtendedUser>({});
    const userStore = useUserStore();
    const pieDatas = [ {value: similarity === -1 ? 70 : similarity, color: '#50BFAF', gradientCenterColor: '#0A594E'}, {value: similarity === -1 ? 30 : 100-similarity, color: '#F8F8F8'},];
    const pieData = useRef<pieDataItem[]|null>(pieDatas);

    const color = friendStatus === "accepted" ? '#B3261E' : friendStatus === 'pending' ? '#565555' : '#007BFF';
    const text = friendStatus === "accepted" ? 'Unfriend' : friendStatus === 'pending' ? 'Pending' : 'Add friend';

    useEffect(()=> {
      getFriendStatus(id);
        fetchUser(id)
        //user.current.print = user.current.gender + (user.current?.age ? ` | Age ${user.current.age} years` : "") + (user.current?.gpa ? ` | CGPA ${user.current.gpa} `: "");
    }, []);

    

    const imgSource = user.current.picture ?? require("@/assets/images/no-dp.svg");

    const handlePress = async () => {
      if(friendStatus === "" || friendStatus === 'blocked') addFriend(id);
    }

    const getFriendStatus = async (id:string) => {
      try {
      if (isConnected === null || isConnected) {
            
          const res: any = await axios.get(`${url}/student/friend-request/${id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userStore.token}`,
              "userid": userStore.user?._id
            },
            timeout: 1000 * 25,
          });
          
          if(res.data) {
            setFriendStatus(res.data.status);
          } 
        
      } else {
        openAlert("fail", "Failed!", "No Internet Connection!");
        return;
      }
    } catch (e: any) {
      handleError(e, openAlert);
    } 
  };

    const addFriend = async (id:string) => {
      try {
      if (isConnected === null || isConnected) {
            
          const res: any = await axios.post(`${url}/student/friend-request`, {recipientId: id}, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userStore.token}`,
              "userid": userStore.user?._id
            },
            timeout: 1000 * 25,
          });
          
          if(res.data) {
            setFriendStatus(res.data.status);
          }
        
      } else {
        openAlert("fail", "Failed!", "No Internet Connection!");
        return;
      }
    } catch (e: any) {
      handleError(e, openAlert);
    } 
    }
    

    const fetchUser = async (id: string) => {
    try {
      if (isConnected === null || isConnected) {
           
          setFetching(true);
          const res: any = await axios.get(`${url}/student/${id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userStore.token}`,
              "userid": userStore.user?._id
            },
            timeout: 1000 * 25,
          });
          
          user.current = res.data;
          user.current.print = user.current.gender + (user.current?.age ? ` | Age ${user.current.age} years` : "") + (user.current?.gpa ? ` | CGPA ${user.current.gpa} `: "");
        
      } else {
        openAlert("fail", "Failed!", "No Internet Connection!");
        return;
      }
    } catch (e: any) {
      handleError(e, openAlert);
    } finally {
      setFetching(false)
    }
  };

  const checkLS = async () => {
    try {

        if(isConnected)
        {
            setCheckingLS(1);
            const {data} = await axios.get(`${url}/student/similarity/${id}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userStore.token}`,
                "userid": userStore.user?._id
            },
            timeout: 1000 * 25,
            });

            if(pieData.current)
            {
                pieData.current[0].value = data.data1;
                pieData.current[1].value = data.data2;
            }
            
        }else {
            openAlert("fail", "Failed!", "No Internet Connection!");
            return;
        }

    } catch (e:any) {

        handleError(e, openAlert, 'NO_LEARNING_STYLE', ()=>{pieData.current =null});

    } finally {
        setCheckingLS(2);
    }
  }

    return(
      <View>
        <Modal
        isVisible={openProfile}
        hasBackdrop={true}
        customBackdrop={
            <Pressable onPress={()=>setOpenProfile(false)} style={styles.backdrop}></Pressable>
        }
        animationIn="fadeIn"
        animationOut="fadeOut"
        >
            <Alert/>
            <View style={[styles.container, {justifyContent: fetching ? 'center': 'flex-start'}]}>
                {fetching ? <ActivityIndicator size="large" color="grey"/> 
                :
                <>
                <Text style={styles.title}>Profile</Text>
                <Text style={styles.role}>{user.current.role==='student' ? "Student" : "Admin"}</Text>
                <View style={[styles.details, {justifyContent:'flex-end'}]}>
                    <View style={{alignItems:'center', bottom:40}}>
                        <Image source={imgSource} style={styles.image}/>
                    
                        <Text style={styles.name}>{user.current.first_name} {user.current.last_name}</Text>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <SimpleLineIcons name='location-pin' color={styles.uni.color} size={styles.uni.fontSize}/>
                            <Text style={styles.uni}>{user.current.uni_name}</Text>
                        </View>
                        <Text style={styles.uni}>{user.current.print}</Text>
                        
                    </View>   
                    {friendStatus !== 'blocked' && <SubmitButton style={[styles.addFriend, {borderColor: color }]} textStyle={[styles.addFriendText, {color:color}]} text={text} onPress={handlePress}/>}
                    {/* <Pressable style={[styles.addFriend, {borderColor: color }]}><Text style={[styles.addFriendText, {color:color}]}>{text}</Text></Pressable> */}
                </View>
                <View style={{ marginTop:h*15, justifyContent:'center'}}>
                <View style={[styles.details, {alignItems:'center', paddingVertical:h*20}]}>
                        <PieChart
                        radius={25*h+25*w}
                        showGradient
                        donut
                        innerRadius={18*h+18*w}
                        data={pieData.current ?? pieDatas}
                        backgroundColor={styles.details.backgroundColor}
                        centerLabelComponent={() => {
                        return <Text style={{fontSize: h*10+w*10, fontFamily:'Poppins_700Bold', color:'#565555'}}>{pieData.current ? `${pieData.current[0].value}%` : "?" }</Text>;
                        }}
                        /> 
                        <Text style={{fontSize: h*7+w*7, fontFamily:'Poppins_600SemiBold', color:'#565555', marginTop:h*10}}>{pieData.current ? "Similar to your Learning Style" : "Learning Style Unknown"}</Text>
                    
                </View>
                
                {checkingLS !== 2 &&  
                
                (<ImageBackground 
                style={styles.blurview}
                source={blurImage}
                imageStyle={{borderRadius:8,}}
                blurRadius={5}
                >   
                    {checkingLS ? <ActivityIndicator size="large" color='grey'/> :
                    <Pressable style={styles.similarity} onPress={checkLS}>
                        <Text style={styles.similarityText}>Check Similarity</Text>
                    </Pressable>
                    }
                </ImageBackground>)
                }


                </View>
                <View style={{flexDirection:'row', justifyContent:'center', columnGap:w*10, flex:1, alignItems:'center'}}>
                    {user.current.phone_number &&
                    <Link href={`tel:${user.current.phone_number}`} asChild>
                    <Pressable style={styles.call}>
                        <Ionicons name="call-outline" size={styles.callText.fontSize} color={styles.callText.color}/>
                        <Text style={styles.callText}>Call</Text>
                    </Pressable>
                    </Link> }
                    
                    {user.current.email && 
                    <Link href={`mailto:${user.current.email}`} asChild>
                    <Pressable style={styles.email}>
                        <Octicons name="paper-airplane" size={styles.emailText.fontSize} color={styles.emailText.color}/>
                        <Text style={styles.emailText}>Mail</Text>
                    </Pressable>
                    </Link>}

                </View>
                </>
                }
                
            </View>
        </Modal>
        </View>
    );
}

export default memo(Profile, (prevProps:Props, nextProps:Props)=> prevProps.id===nextProps.id)


const styles = StyleSheet.create({

    container: {
        paddingTop: h*15,
        flex:1,
        backgroundColor: "#F5F7FA",
        borderRadius: 24,
        width:width*0.9,
        maxHeight:height*0.75,
        paddingHorizontal:w*15,
        alignSelf:'center',
        
    },

    backdrop: {
    flex: 1,
    backgroundColor: "black",
    opacity: 0.4,
    },

    image: {
        width:h*40+w*40, 
        height:h*40+w*40, 
        borderRadius:50, 
        borderWidth:1.5, 
        borderColor:'#50BFAF',
        
    },

    title: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 12.5*h+12.5*w,
        color: "#565555",
        textAlign:'center'
    },

    details: {
        backgroundColor: 'rgba(230, 236, 245, 0.96)',
        borderRadius:8,
        marginTop:h*6,
        boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.25)",
        
    },

    role: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 6*h+6*w,
        backgroundColor: '#50BFAF',
        color:'#FFFFFF',
        alignSelf:'flex-start',
        borderRadius:13,
        paddingVertical:3*h,
        paddingHorizontal: 13*w,
        marginTop:h*40,
        
    },

    name: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 8*h+8*w,
        color:'#565555',
    },

    uni: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 5*h+5*w,
        color:'#797B7D',
        marginLeft:1*w,
    },

    addFriend: {
        borderColor:'#007BFF',
        borderRadius:12,
        boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.25)",
        paddingHorizontal:w*14,
        paddingVertical:4*h,
        borderWidth:1.5,
        position:'absolute',
        alignSelf:'center',
        marginBottom:10*h,
    },
    addFriendText: {
        fontFamily: 'Inter_700Bold',
        fontSize: 6*h+6*w,
        color:'#007BFF',
    },

    similarity: {
        backgroundColor:'#50BFAF',
        borderRadius:35,
        //boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.25)",
        paddingHorizontal:w*14,
        paddingVertical:4*h,
        
        position:'absolute',
        //alignSelf:'center',
        //marginBottom:10*h,
    },
    similarityText: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 7*h+7*w,
        color:'#F8F8F8',
    },

    blurview: {
        position:'absolute', 
        //backgroundColor: 'rgba(230, 236, 245, 0)',
        width:'100%',
        height:"100%",
        //top:h*7, 
        //left:w*3,       
        alignItems:'center',
        justifyContent:'center',      
    },

    call: {
        paddingHorizontal: 35*w,
        paddingVertical:h*15,
        borderColor:"#50BFAF",
        borderWidth:2,
        borderRadius:19,
        backgroundColor: '#F5F7FA',
        flexDirection:'row',
        columnGap:w*5,
        alignItems:'center'
    },

    callText: {
        color: "#50BFAF",
        fontFamily: 'Inter_700Bold',
        fontSize:h*9+w*9,
    },

    email: {
        paddingHorizontal: 35*w,
        paddingVertical:h*15,
        backgroundColor:"#50BFAF",
        borderRadius:19,
        borderColor:"#50BFAF",
        borderWidth:2,
        flexDirection:'row',
        columnGap:w*5,
        alignItems:'center'
        
    },

    emailText: {
        color: "#F5F7FA",
        fontFamily: 'Inter_700Bold',
        fontSize:h*9+w*9,
    }
})