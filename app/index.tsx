import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-gray-100">
      <Text className="text-xl font-bold text-primary">
        Welcome to insideMind!
      </Text>
      <Link href="/onboarding/Login">Get Started Link</Link>
    </View>
  );
}
