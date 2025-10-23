import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, View } from "react-native";

interface BackButtonProps {
  onPress?: () => void;
}

const BackButton = ({ onPress }: BackButtonProps) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <Pressable onPress={handlePress} className="absolute top-12 left-6 z-10">
      <View className="bg-gray-300 rounded-full p-2">
        <Ionicons name="arrow-back" size={24} color="#111827" />
      </View>
    </Pressable>
  );
};

export default BackButton;
