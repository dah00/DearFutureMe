import MessageList from "@/components/Home/MessageList";
import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { getHelloMessage } from "@/lib/api";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const [backendMessage, setBackendMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchHelloMessage = async () => {
      setIsLoading(true);

      const response = await getHelloMessage();

      if (response.success && response.data) {
        setBackendMessage(response.data.message);
      } else {
        setBackendMessage(`Error: ${response.error || "Unknown error"}`);
      }

      setIsLoading(false);
    };

    fetchHelloMessage();
  }, []);

  return (
    <SafeAreaView className="flex-1 px-6 py-8 bg-secondary">
      {/* Back Button */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          // className="flex-1"
        >
          {/** Header */}
          <View className="flex-row justify-between mb-10">
            <Text className="font-instrument text-3xl">
              Hello, <Text className="color-accent"> Rio</Text>
            </Text>
            <Pressable onPress={() => router.push("/Profile")}>
              <Image
                source={icons.profile}
                style={{ width: 26, height: 26, tintColor: colors.button }}
              />
            </Pressable>
          </View>

          {/* Backend Connection Test - ADD THIS SECTION */}
          <View className="mb-4 p-3 bg-primary rounded-lg">
            <Text className="text-sm font-semibold mb-1">Backend Status:</Text>
            {isLoading ? (
              <Text className="text-xs">Connecting to backend...</Text>
            ) : (
              <Text className="text-xs">{backendMessage}</Text>
            )}
          </View>
          {/* END OF ADDED SECTION */}

          {/* * Upcoming Messages */}
          <View className="mb-10">
            <View className="flex-row justify-between">
              <Text className="text-2xl">Upcoming Messages</Text>
              <Text>Calendar Icon</Text>
            </View>
            {/* TODO: Pass the list of messages as prop of MessageList */}
            <View className="bg-primary rounded-lg mt-4">
              <MessageList />
            </View>
          </View>
          <View>
            {/** Voice Recording */}
            <View>
              <Text className="text-2xl">Let's Record</Text>
              <Text className="text-lg">
                What will your future self thank you for
              </Text>

              <Pressable
                className="w-32 h-32 mt-10 rounded-full bg-primary items-center justify-center self-center"
                onPress={() => {
                  router.push("/recording");
                }}
              >
                <Image source={icons.voice} className="w-8 h-8" />
                <Text className="font-instrument text-2xl">Record</Text>
              </Pressable>
            </View>
            {/** Text Recording */}
            <View></View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Home;
