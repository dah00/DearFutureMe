import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import TextField from "@/components/TextField";
import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ForgotPassword = () => {
  const handleSendCode = () => {
    // TODO: Implement
  };
  return (
    <SafeAreaView className="flex-1">
      <BackButton />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-center px-6 gap-12"
        >
          {/** Header */}
          <View>
            <Text className="text-5xl font-medium text-center">
              Forgot Password
            </Text>
          </View>

          {/** Text Field */}
          <View>
            <TextField
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          {/** Button */}
          <View className="items-center">
            <Button text="Send Code" onPress={handleSendCode} size="lg" />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default ForgotPassword;
