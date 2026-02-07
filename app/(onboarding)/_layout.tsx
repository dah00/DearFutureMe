import { colors } from "@/constants/colors";
import { Stack } from "expo-router";
import React from "react";

const _Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
};

export default _Layout;
