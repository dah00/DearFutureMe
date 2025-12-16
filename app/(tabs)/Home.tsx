import MessageList from "@/components/Home/MessageList";
import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { useMessages } from "@/lib/hooks/useMessages";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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
  const {
    messages,
    isLoading,
    error,
    reload,
    createMessage,
    upcomingMessages,
    isLoadingUpcoming,
  } = useMessages();

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

          {/* * Upcoming Messages */}
          <View className="mb-10">
            <View className="flex-row justify-between items-center">
              <Text className="text-2xl">Upcoming Messages</Text>
              <Pressable onPress={reload}>
                <Text className="text-accent text-sm">Refresh</Text>
              </Pressable>
            </View>

            <View className="bg-primary rounded-lg mt-4">
              {isLoadingUpcoming ? (
                <View className="p-4">
                  <Text>Loading messages…</Text>
                </View>
              ) : error ? (
                <View className="p-4">
                  <Text className="text-red-500">
                    {typeof error === "string" ? error : JSON.stringify(error)}
                  </Text>
                </View>
              ) : (
                <MessageList messages={upcomingMessages} />
              )}
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
            <View className="mt-6">
              <Pressable
                className="bg-accent py-2 px-4 rounded-lg mt-4"
                onPress={async () => {
                  const result = await createMessage({
                    title: "Sample message",
                    content: "Created from app",
                    message_type: "text",
                    scheduled_date: new Date().toISOString(),
                  });
                  if (!result.success) {
                    Alert.alert(
                      "Error",
                      result.error ?? "Could not create message"
                    );
                  }
                }}
              >
                <Text className="text-white text-center">
                  Add Sample Message
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Home;
