import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface MessageTypeSelectorProps {
  isWriteSelected: boolean;
  isRecordSelected: boolean;
  onWriteSelect: () => void;
  onRecordSelect: () => void;
}

const MessageTypeSelector: React.FC<MessageTypeSelectorProps> = ({
  isWriteSelected,
  isRecordSelected,
  onWriteSelect,
  onRecordSelect,
}) => {
  return (
    <View className="flex-row justify-center gap-8 mt-10">
      <Pressable
        className="w-24 h-24 rounded-full items-center justify-center self-center"
        style={{
          borderColor: isWriteSelected ? colors.accent : colors.textPrimary,
          backgroundColor: isWriteSelected ? colors.accent : colors.secondary,
          borderWidth: 1,
        }}
        onPress={onWriteSelect}
      >
        <Image
          source={icons.comment}
          className="w-8 h-8"
          style={{
            tintColor: isWriteSelected ? "#FFFFFF" : colors.textPrimary,
          }}
        />
        <Text
          className="font-instrument text-xl"
          style={{
            color: isWriteSelected ? "#FFFFFF" : colors.textPrimary,
          }}
        >
          Write
        </Text>
      </Pressable>

      <Pressable
        className="w-24 h-24 rounded-full items-center justify-center self-center"
        style={{
          borderColor: isRecordSelected ? colors.accent : colors.textPrimary,
          backgroundColor: isRecordSelected ? colors.accent : colors.secondary,
          borderWidth: 1,
        }}
        onPress={onRecordSelect}
      >
        <Image
          source={icons.voice}
          className="w-8 h-8"
          style={{
            tintColor: isRecordSelected ? "#FFFFFF" : colors.textPrimary,
          }}
        />
        <Text
          className="font-instrument text-xl"
          style={{
            color: isRecordSelected ? "#FFFFFF" : colors.textPrimary,
          }}
        >
          Record
        </Text>
      </Pressable>
    </View>
  );
};

export default MessageTypeSelector;
