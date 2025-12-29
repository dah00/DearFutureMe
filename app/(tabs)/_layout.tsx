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
            maxWidth: "33%",
          },
          tabBarIconStyle: {
            width: "100%",
            height: "100%",
          },
          tabBarStyle: {
            backgroundColor: colors.textPrimary,
            width: "92%",
            height: 75,
            bottom: 18,
            alignSelf: "center",
            borderRadius: 30,
            borderBlockColor: colors.border,
            paddingBottom: 0,
            paddingHorizontal: 12,
            position: "relative",
            borderTopWidth: 0,
            borderWidth: 0,
            justifyContent: "space-around",
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
      {/* Floating Action Button - Integrated Design */}
      <Pressable
        onPress={() => router.push("/recording")}
        className="absolute w-[60px] h-[60px] rounded-full bg-primary items-center justify-center z-10 border-2 border-white/30"
        style={{
          left: "50%",
          bottom: 85,
          marginLeft: -30, // Half of button width (60px / 2)
          elevation: 12,
        }}
      >
        <Ionicons name="add" size={36} color="#FFFFFF" />
      </Pressable>
    </View>
  );
};

export default _Layout;
