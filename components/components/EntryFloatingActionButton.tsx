import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

const EntryFloatingActionButton = () => {
  return (
    <View
      className="absolute top-[130px] z-10 justify-between bg-background rounded-full flex-row gap-8 px-8 py-6"
      style={{
        left: 100,
        right: 100,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Pressable
        className="items-center gap-1"
        onPress={() => router.push("/WriteEntry")}
      >
        <View className="bg-success rounded-full w-12 h-12 items-center justify-center">
          <Image source={icons.comment} className="w-8 h-8" />
        </View>
        <Text>Write</Text>
      </Pressable>
      <Pressable className="items-center gap-1">
        <View className="bg-accent rounded-full w-12 h-12 items-center justify-center">
          <Image source={icons.voice} className="w-8 h-8 rounded-full" />
        </View>
        <Text>Record</Text>
      </Pressable>
    </View>
  );
};

export default EntryFloatingActionButton;
