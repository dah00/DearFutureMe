import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import TextField from "@/components/TextField";
import { colors } from "@/constants/colors";
import { AuthService } from "@/lib/auth";
import Checkbox from "expo-checkbox";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * TODO:
 * - disable the the button until agree to terms and conditions is checked
 * - Remove permanent caps icon above eye icon of the password text field
 * - Show an error message "you have to agree with the terms and condition"
 * when Sign up button is pressed, but checkbox is not checked
 *
 *
 */

const SignUp = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!isChecked) {
      Alert.alert("Error", "Please agree to the terms and conditions");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const result = await AuthService.signUp({ email, password, fullName });

      if (result.success) {
        Alert.alert("Success", "Account created successfully!");
        router.replace("/");
      } else {
        Alert.alert("Sign Up Failed", result.error || "Something went wrong");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <SafeAreaView className="flex-1">
      {/* Back Button */}
      <BackButton />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-center px-6 gap-12"
        >
          {/* Header */}
          <View>
            <Text className="text-5xl font-medium text-center">Sign Up</Text>
          </View>

          {/* Text Field */}
          <View className="gap-3">
            <TextField
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
            <TextField
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
            />
            <TextField
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoComplete="password"
              secureTextEntry={true}
            />
          </View>

          {/* Terms and Condition */}
          <View className="flex-row items-center gap-4">
            <Checkbox
              value={isChecked}
              onValueChange={setIsChecked}
              color={isChecked ? colors.accent : colors.button}
              className=""
            />
            <Text>I agree to the terms & conditions</Text>
          </View>

          {/* Sign Up Button */}
          <View className="items-center">
            <Button
              text={isLoading ? "Creating Account..." : "Sign Up"}
              onPress={handleSignUp}
              size="lg"
              disabled={isLoading || !isChecked}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default SignUp;
