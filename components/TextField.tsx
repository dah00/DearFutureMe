import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface TextFieldProps {
  placeholder: string;
  label?: string;
  keyboardType?: "default" | "email-address" | "numeric";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: "password" | "email";
  secureTextEntry?: boolean;
  value?: string;
  isRequired?: boolean;
  showError?: boolean; 
  onChangeText?: (text: string) => void;
}

const TextField = ({
  placeholder,
  label,
  keyboardType,
  secureTextEntry = false,
  autoCapitalize,
  autoComplete,
  value,
  isRequired = false,
  showError = false, 
  onChangeText,
}: TextFieldProps) => {
  const [internalValue, setInternalValue] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Use controlled value if provided, otherwise use internal state
  const currentValue = value !== undefined ? value : internalValue;
  const handleChangeText = onChangeText || setInternalValue;

  const hasError = isRequired && !currentValue && showError;

  return (
    <>
      {hasError && <Text className="text-error text-sm mb-[-8]">Field Required</Text>}
      <View
        className={`${
          hasError
            ? "border rounded-lg border-error"
            : "border border-transparent"
        }`}
      >
        <TextInput
          placeholder={placeholder}
          value={currentValue}
          onChangeText={handleChangeText}
          placeholderTextColor="#9CA3AF"
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry && !showPassword}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          className="bg-gray-200 rounded-lg px-4 py-5 pr-12"
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
    </>
  );
};

export default TextField;
