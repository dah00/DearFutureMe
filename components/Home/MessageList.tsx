import { icons } from "@/constants/icons";
import React from "react";
import { FlatList, Image, Text, View } from "react-native";

const messages = [
  {
    id: 1,
    title: "Get jacked in 3 months",
    messageType: "text",
    date: "12/25/25",
  },
  { id: 2, title: "Owning my morning", messageType: "voice", date: "02/04/26" },
];

const MessageList = () => {
  return (
    <FlatList
      data={messages}
      renderItem={({ item }) => (
        <View className="rounded-lg p-2 bg-border gap-2 mt-2">
          <View className="flex-row justify-between">
            <View className="flex-row items-center">
              <View className="bg-blue-400 rounded-full p-2">
                <Image source={icons.comment} className="w-8 h-8" />
              </View>
              <Text> {item.title} </Text>
            </View>
            <Text>{item.date}</Text>
          </View>
        </View>
      )}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

export default MessageList;
