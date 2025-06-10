import { View } from "@/components/Themed";
import { useUserStore} from "@/hooks/useStore";
import Statistics from "@/components/Statistics";
import Sections from "@/components/Sections";


export default function Analytics() {

    const {user} = useUserStore()

    if(user?.isSurveyCompleted) return <View style={{ flex: 1, backgroundColor: "white" }}><Statistics/></View>
    else return <View style={{ flex: 1, backgroundColor: "white" }}><Sections/></View>
}