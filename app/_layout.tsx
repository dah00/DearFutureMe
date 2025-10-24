import { AuthProvider } from "@/lib/AuthContext";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar hidden={true} />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="onboarding/Login"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="onboarding/SignUp"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="onboarding/ForgotPassword"
            options={{ headerShown: false }}
          />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
