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
  if (messages.length < 1) {
    return (
      <View>
        <Text> No upcoming messages</Text>
      </View>
    );
  }
  return (
    <FlatList
      data={messages}
      renderItem={({ item }) => (
        <View className="rounded-lg p-4">
          <View className="flex-row justify-between">
            <View className="flex-row items-center">
              <View className="bg-blue-400 rounded-full p-2">
                <Image
                  source={
                    item.messageType == "text" ? icons.comment : icons.voice
                  }
                  className="w-6 h-6"
                />
              </View>
              <Text> {item.title} </Text>
            </View>
            <Text>{item.date}</Text>
          </View>
        </View>
      )}
      keyExtractor={(item) => item.id.toString()}
      ItemSeparatorComponent={() => (
        <View className="bg-secondary h-1 w-full" />
      )}
    />
  );
};

export default MessageList;
