import Button from "@/components/Button";
import TextField from "@/components/TextField";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogIn = () => {
    // TODO: Implement
  };

  return (
    <SafeAreaView className="flex-1 justify-center px-8 gap-12">
      {/*Header*/}
      <View className="">
        <Text className="text-5xl font-medium text-center">Login</Text>
      </View>

      {/* Text Fields */}
      <View className=" gap-3">
        <TextField
          placeholder="Email Address"
          autoCapitalize="none"
          autoComplete="email"
        />
        <TextField
          placeholder="Password"
          autoCapitalize="none"
          autoComplete="password"
          secureTextEntry={true}
        />
        <Link
          href="/onboarding/ForgotPassword"
          className="text-accent text-right underline"
        >
          Forgot Password
        </Link>
      </View>

      {/* Terms and Conditions */}
      <View className="">
        <Text>
          Don't have an account,{" "}
          <Link href="/onboarding/SignUp" className="text-accent underline">
            sign up
          </Link>{" "}
          now
        </Text>
      </View>

      {/* Sign In button */}
      <View className="items-center">
        <Button text="Sign In" onPress={handleLogIn} size="lg" />
      </View>
    </SafeAreaView>
  );
};

export default Login;
