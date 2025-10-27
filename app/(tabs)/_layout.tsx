import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { Tabs } from "expo-router";
import React from "react";
import { Image, Text, View } from "react-native";

const TabIcon = ({ focused, icon, title }: any) => {
  return (
    <View style={{ alignItems: "center", justifyContent: 'center', gap: 4 }}>
      <Image
        source={icon}
        style={{
          width: 24,
          height: 24,
          tintColor: focused ? "#FFFFFF" : "#A8B5DB",
        }}
      />
      <Text className={`text-xs ${focused ? "text-white" : "text-[#A8B5DB]"}`}>
        {title}
      </Text>
      {focused && <View className="w-4 h-1 bg-accent rounded-full" />}
    </View>
  );
};

const _Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: colors.textPrimary,
          width: "90%",
          height: 80,
          //   position: "absolute",
          bottom: 19,
          alignSelf: "center",
          borderRadius: 25,
          overflow: "hidden",
        },
      }}
    >
      <Tabs.Screen
        name="Home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="Records"
        options={{
          title: "Records",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.records} title="Records" />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.profile} title="Profile" />
          ),
        }}
      />
    </Tabs>
  );
};

export default _Layout;
