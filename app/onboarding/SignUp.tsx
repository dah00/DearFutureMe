import Button from "@/components/Button";
import TextField from "@/components/TextField";
import { colors } from "@/constants/colors";
import Checkbox from "expo-checkbox";
import React, { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  const handleSignUp = () => {
    //TODO: implement this
  };
  return (
    <SafeAreaView className="flex-1 justify-center px-6 gap-12">
      {/* Header */}
      <View>
        <Text className="text-5xl font-medium text-center">Sign Up</Text>
      </View>

      {/* Text Field */}
      <View className="gap-3">
        <TextField placeholder="Full Name" autoCapitalize="words" />
        <TextField
          placeholder="Email"
          autoCapitalize="none"
          autoComplete="email"
        />
        <TextField
          placeholder="Password"
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
        <Button text="Sign Up" onPress={handleSignUp} size="lg" />
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
