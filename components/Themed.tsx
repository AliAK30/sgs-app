/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, View as DefaultView, TextInput as DefaultTextInput, ScrollView as DefaultScrollView, PressableProps } from 'react-native';

/* import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
} */

export const Pressable = (Props: PressableProps) => {
  return <Pressable {...Props}/>
}

export const Text = (Props: DefaultText['props']) => {
  return <DefaultText {...Props}/>
}

export const View = (Props: DefaultView['props']) => {
  return <DefaultView {...Props}/>
}

export const TextInput = (Props: DefaultTextInput['props']) => {

  return <DefaultTextInput {...Props} style={[Props.style, {padding:0}]}/>
}

export const ScrollView = (Props: DefaultScrollView['props']) => {
  return <DefaultScrollView {...Props}/>
}

