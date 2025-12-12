import Button from "@/components/Button";
import TextField from "@/components/TextField";
import { useAuth } from "@/lib/AuthContext";
import { Link, router } from "expo-router";
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

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);

      Alert.alert("Success", "Welcome back!");
      router.replace("/");
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-center px-6 gap-12"
        >
          {/*Header*/}
          <View className="">
            <Text className="text-5xl font-medium text-center">Login</Text>
          </View>

          {/* Text Fields */}
          <View className="gap-3">
            <TextField
              placeholder="Email Address"
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
            <View className="flex items-end">
              <Link href="/forgot-password" className="text-accent underline">
                Forgot Password
              </Link>
            </View>
          </View>

          {/* Terms and Conditions */}
          <View className="">
            <Text>
              Don't have an account,{" "}
              <Link href="/sign-up" className="text-accent underline">
                sign up
              </Link>{" "}
              now
            </Text>
          </View>

          {/* Sign In button */}
          <View className="items-center">
            <Button
              text={isLoading ? "Logging In..." : "Log In"}
              onPress={handleLogIn}
              size="lg"
              disabled={isLoading}
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Login;
