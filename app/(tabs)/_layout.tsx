import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

const TabIcon = ({ focused, icon, title }: any) => {
  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        // backgroundColor: "purple",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
      }}
    >
      <Image
        source={icon}
        style={{
          width: 24,
          height: 24,
          tintColor: focused ? colors.background : colors.button,
        }}
      />
      <Text
        style={{
          fontSize: 12,
          color: focused ? "#FFFFFF" : "#A8B5DB",
        }}
      >
        {title}
      </Text>
      {focused && (
        <View
          style={{
            width: 50,
            height: 4,
            backgroundColor: "#7C3AED",
            borderRadius: 2,
          }}
        />
      )}
    </View>
  );
};

const _Layout = () => {
  return (
    <View className="flex-1">
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
          tabBarItemStyle: {
            flex: 1,
            height: "100%",
          },
          tabBarIconStyle: {
            width: "100%",
            height: "100%",
          },
          tabBarStyle: {
            backgroundColor: colors.textPrimary,
            width: "90%",
            height: 80,
            bottom: 19,
            alignSelf: "center",
            borderRadius: 25,
            borderBlockColor: colors.textSecondary,
            paddingBottom: 0,
            position: "relative",
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
              <TabIcon focused={focused} icon={icons.user} title="Profile" />
            ),
          }}
        />
      </Tabs>
      {/* Floating Action Button */}
      <Pressable
        onPress={() => router.push("/recording")}
        className="absolute w-16 h-16 rounded-full bg-accent items-center justify-center shadow-lg"
        style={{
          bottom: 115, // Position above the tab bar with some spacing
          left: "50%",
          marginLeft: -32, // Half of button width (64px / 2) to center it
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </Pressable>
    </View>
  );
};

export default _Layout;
