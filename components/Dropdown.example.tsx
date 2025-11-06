// Example usage of Dropdown component
import Dropdown from "@/components/Dropdown";
import React, { useState } from "react";
import { View } from "react-native";

const Example = () => {
  const [selectedValue, setSelectedValue] = useState<string>("");

  const options = [
    { label: "Voice Message", value: "voice" },
    { label: "Text Message", value: "text" },
    { label: "Video Message", value: "video" },
  ];

  return (
    <View className="p-4">
      <Dropdown
        label="Message Type"
        placeholder="Select message type"
        options={options}
        value={selectedValue}
        onValueChange={setSelectedValue}
      />
    </View>
  );
};

export default Example;

