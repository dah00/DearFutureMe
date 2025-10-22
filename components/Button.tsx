import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface ButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  text: string;
}

const Button = ({
  onPress,
  isLoading = false,
  disabled = false,
  variant,
  size,
  text,
}: ButtonProps) => {
  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "py-2 px-4";
      case "md":
        return "py-4 px-6";
      case "lg":
        return "py-5 px-8";
      default:
        return "py-4 px-6";
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      className={`${getSizeStyles()} bg-accent rounded-xl`}
    >
      <Text className="text-white ">{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;
