import { Vibration } from "react-native";

export const triggerVibration = (data: number) => {
        switch (data) {
            case 1:
                Vibration.vibrate(15);
                break;
            case 2:
                Vibration.vibrate(25);
                break;
            case 3:
                Vibration.vibrate(35);
                break;
            case 4:
                Vibration.vibrate(45);
                break;
            case 5:
                Vibration.vibrate(55);
                break;
            default:
                Vibration.vibrate(5);
                break;
        }
    };