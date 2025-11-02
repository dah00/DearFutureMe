import { Stack } from "expo-router";
import React from "react";

const _Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Recording" options={{ headerShown: false }} />
    </Stack>
  );
};

export default _Layout;
