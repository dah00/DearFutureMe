import { colors } from "@/constants/colors";
import { useAuth } from "@/lib/AuthContext";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";

export default function Index() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/Home");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-100">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 px-6">
      {/** LOGO */}
      <Image
        source={require("@/assets/images/react-logo.png")}
        style={{ width: 100, height: 100, tintColor: colors.accent }}
        contentFit="contain"
      />
      {/** Header */}
      <Text className="font-instrument text-4xl text-accent">Dear Future Me</Text>
      <Text className="text-lg">
        Record your thoughts, dreams, and ambitions. We'll send them back to you
        at the perfect moment to inspire and remind you of what matters to you.
      </Text>
      <Image
        source={require("@/assets/images/welcome_project_launch.gif")}
        style={{ width: 256, height: 256 }}
        contentFit="contain"
      />
      {/** Button */}
      <Pressable
        className="bg-accent px-6 py-4 rounded-lg mt-4"
        onPress={() => router.push("/Home")}
      >
        <Text className="text-white text-lg font-semibold text-center">
          Get Started
        </Text>
      </Pressable>
    </View>
  );
}
