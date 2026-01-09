import BackButton from "@/components/BackButton";
import TextField from "@/components/TextField";
import { Slot } from "expo-router";
import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EntriesLayout = () => {
  const [title, setTitle] = useState<string>("");
  const [focusArea, setFocusArea] = useState<string>("");

  return (
    <SafeAreaView className="flex-1 bg-secondary">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {/* Back and Save Buttons */}
          <View
            style={{
              position: "absolute",
              top: 20, 
              left: 24, 
              right: 24, 
              zIndex: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <BackButton useAbsolute={false} />
            <Pressable
              className="px-6 py-3 rounded-full bg-accent items-center justify-center"
              onPress={() => {
                console.log("Save pressed");
              }}
            >
              <Text className="text-white font-bold text-lg">Save</Text>
            </Pressable>
          </View>

          {/* Title Section */}
          <View className="mt-24 px-6 mb-6 items-center">
            <Text className="font-instrument text-3xl mb-1">Today's 1%</Text>
            <Text className="text-base text-gray-600">
              Even one small thing is enough
            </Text>
          </View>

          {/* Header Section with Optional Fields */}
          <View className="px-6 mb-6 gap-4">
            <TextField
              placeholder="Title (optional)"
              value={title}
              onChangeText={setTitle}
              autoCapitalize="sentences"
            />
            <TextField
              placeholder="Focus Area (optional)"
              value={focusArea}
              onChangeText={setFocusArea}
              autoCapitalize="sentences"
            />
          </View>

          {/* Child Route Content (WriteEntry or RecordEntry) */}
          <View className="flex-1">
            <Slot />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default EntriesLayout;
