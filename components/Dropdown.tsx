import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  placeholder?: string;
  label?: string;
  options: DropdownOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

const Dropdown = ({
  placeholder = "Select an option",
  label,
  options,
  value,
  onValueChange,
  disabled = false,
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string>("");

  // Use controlled value if provided, otherwise use internal state
  const currentValue = value !== undefined ? value : internalValue;
  const handleValueChange = onValueChange || setInternalValue;

  const selectedOption = options.find(
    (option) => option.value === currentValue
  );
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (selectedValue: string) => {
    handleValueChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <View>
      {label && (
        <Text className="text-sm font-medium mb-2 text-gray-700">{label}</Text>
      )}
      <Pressable
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className="bg-gray-200 rounded-lg px-4 py-5 flex-row items-center justify-between"
      >
        <Text
          className={`flex-1 ${
            selectedOption ? "text-gray-900" : "text-gray-400"
          }`}
        >
          {displayText}
        </Text>
        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color="#6B7280"
        />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center px-4"
          onPress={() => setIsOpen(false)}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="bg-white rounded-lg max-h-96"
          >
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold">
                {label || placeholder}
              </Text>
            </View>
            <ScrollView className="max-h-80">
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleSelect(option.value)}
                  className={`px-4 py-4 border-b border-gray-100 ${
                    currentValue === option.value ? "bg-accent/10" : ""
                  }`}
                >
                  <View className="flex-row items-center justify-between">
                    <Text
                      className={`${
                        currentValue === option.value
                          ? "font-semibold text-accent"
                          : "text-gray-900"
                      }`}
                    >
                      {option.label}
                    </Text>
                    {currentValue === option.value && (
                      <Ionicons name="checkmark" size={20} color="#2563EB" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Dropdown;
