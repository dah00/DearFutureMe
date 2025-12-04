import Button from "@/components/Button";
import { useAuth } from "@/lib/AuthContext";
import { router } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const Profile = () => {
  const { signOut } = useAuth();
  return (
    <View className="flex-1 bg-accent">
      <Text>Profile</Text>
      <Button
        text="Log Out"
        onPress={async () => {
          await signOut();
          router.push("/login");
        }}
      />
    </View>
  );
};

export default Profile;
