import { AuthProvider } from "@/lib/AuthContext";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import React from "react";
import { StatusBar, Text, TextInput } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

// Apply default font family globally before first render
(Text as any).defaultProps = (Text as any).defaultProps || {};
{
  const existing = (Text as any).defaultProps.style;
  const arr = Array.isArray(existing) ? existing : existing ? [existing] : [];
  (Text as any).defaultProps.style = [{ fontFamily: "InstrumentSans" }, ...arr];
}

(TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
{
  const existing = (TextInput as any).defaultProps.style;
  const arr = Array.isArray(existing) ? existing : existing ? [existing] : [];
  (TextInput as any).defaultProps.style = [
    { fontFamily: "InstrumentSans" },
    ...arr,
  ];
}

// Strong override: ensure InstrumentSans is appended last so it wins over NativeWind class styles
{
  const originalTextRender = (Text as any).render;
  (Text as any).render = function (...args: any[]) {
    const origin = originalTextRender?.apply(this, args);
    const originStyle = origin?.props?.style;
    const styleArray = Array.isArray(originStyle)
      ? originStyle
      : originStyle
      ? [originStyle]
      : [];
    return React.cloneElement(origin, {
      style: [...styleArray, { fontFamily: "InstrumentSans" }],
    });
  };

  const originalInputRender = (TextInput as any).render;
  (TextInput as any).render = function (...args: any[]) {
    const origin = originalInputRender?.apply(this, args);
    const originStyle = origin?.props?.style;
    const styleArray = Array.isArray(originStyle)
      ? originStyle
      : originStyle
      ? [originStyle]
      : [];
    return React.cloneElement(origin, {
      style: [...styleArray, { fontFamily: "InstrumentSans" }],
    });
  };
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    InstrumentSans: require("../assets/fonts/Instrument_Sans/InstrumentSans-VariableFont_wdth,wght.ttf"),
    "InstrumentSans-Italic": require("../assets/fonts/Instrument_Sans/InstrumentSans-Italic-VariableFont_wdth,wght.ttf"),
  });

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar hidden={true} />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(screens)" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
