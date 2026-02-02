import { colors } from "@/constants/colors";
import { useAuth } from "@/lib/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

const HAS_OPENED_APP_KEY = "has_opened_app";

export default function Index() {
  const { user, loading } = useAuth();
  const [hasOpenedApp, setHasOpenedApp] = useState<boolean | null>(null);

  useEffect(() => {
    const checkFirstTime = async () => {
      try {
        const value = await AsyncStorage.getItem(HAS_OPENED_APP_KEY);
        setHasOpenedApp(value !== null);
      } catch (error) {
        console.error("Error checking first time:", error);
        setHasOpenedApp(false);
      }
    };
    checkFirstTime();
  }, []);

  // Handle routing based on auth state and first-time status
  useEffect(() => {
    if (loading || hasOpenedApp === null) return; // Wait for both to load

    if (user) {
      // User is logged in → go to home
      router.replace("/(tabs)/Home");
    } else if (hasOpenedApp) {
      // Not first time but not logged in → go to login
      router.replace("/(onboarding)/login");
    }
    // If first time (hasOpenedApp === false), show welcome screen
  }, [user, loading, hasOpenedApp]);

  // Show loading while checking auth and first-time status
  if (loading || hasOpenedApp === null) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text>Loading...</Text>
      </View>
    );
  }

  // If user is logged in or has opened app before, don't show welcome screen
  // (This shouldn't render due to useEffect redirect, but just in case)
  if (user || hasOpenedApp) {
    return null;
  }

  // First time opening app → show welcome screen
  return (
    <View className="flex-1 justify-center items-center bg-gray-100 px-6">
      {/** LOGO */}
      <Image
        source={require("@/assets/images/react-logo.png")}
        style={{ width: 100, height: 100, tintColor: colors.accent }}
        contentFit="contain"
      />
      {/** Header */}
      <Text className="font-instrument text-4xl text-accent">
        OnePercent
      </Text>
      <Text className=" text-lg">
        Capture your 1% improvement every day. A short reflection or voice
        note—fast, simple, meaningful.
      </Text>
      <Image
        source={require("@/assets/images/welcome_project_launch.gif")}
        style={{ width: 256, height: 256 }}
        contentFit="contain"
      />
      {/** Button */}
      <Pressable
        className="bg-accent px-6 py-4 rounded-lg mt-4"
        onPress={async () => {
          // Mark that user has opened app
          await AsyncStorage.setItem(HAS_OPENED_APP_KEY, "true");
          // Navigate to login/signup
          router.push("/(onboarding)/login");
        }}
      >
        <Text className="text-white text-lg font-semibold text-center">
          Get Started
        </Text>
      </Pressable>
    </View>
  );
}
