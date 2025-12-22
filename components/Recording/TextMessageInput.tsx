import React from "react";
import { TextInput, View } from "react-native";

interface TextMessageInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const TextMessageInput: React.FC<TextMessageInputProps> = ({
  value,
  onChangeText,
  placeholder = "What it do future $Name",
}) => {
  return (
    <View className="mt-8">
      <TextInput
        onChangeText={onChangeText}
        value={value}
        placeholder={placeholder}
        multiline
        editable
        className="border rounded-lg border-border px-3 py-4 h-80 bg-primary"
      />
    </View>
  );
};

export default TextMessageInput;
