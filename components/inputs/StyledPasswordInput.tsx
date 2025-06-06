import { EyeIcon, WarnIcon } from "@/components/Icons";
import StyledInput, { StyledInputProps } from "./StyledInput";
import { useState } from "react";



export default function StyledPasswordInput({error, ...props}: StyledInputProps) {

    const [showPassword, setShowPassword] = useState<boolean>(false)
    let name = showPassword ? "eye-outline" : "eye-off-outline"
    let Icon = error ? <WarnIcon/> : <EyeIcon name={name} onTap={()=>setShowPassword(showPassword=>!showPassword)}/>
  return (
    <StyledInput
    {...props}
    error={error}
    secureTextEntry={!showPassword}
    Icon={()=>Icon}
    iconRenderingCondition={error ? error : "render"}
    />
  );
}
//"eye-off-outline"
