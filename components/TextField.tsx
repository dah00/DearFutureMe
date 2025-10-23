import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

interface TextFieldProps {
  placeholder: string;
  label?: string;
  keyboardType?: "default" | "email-address" | "numeric";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: "password" | "email";
  secureTextEntry?: boolean;
}

const TextField = ({
  placeholder,
  label,
  keyboardType,
  secureTextEntry = false,
  autoCapitalize,
  autoComplete,
}: TextFieldProps) => {
  const [value, setValue] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <View>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={setValue}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry && !showPassword}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        className="bg-gray-200 rounded-lg px-4 py-5 pr-12 text"
      />
      {secureTextEntry && (
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          activeOpacity={0.8}
          className="absolute right-4 top-4"
        >
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={20}
            color="#6B7280"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default TextField;
