import BackButton from "@/components/BackButton";
import TextField from "@/components/TextField";
import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { uploadVoiceMessage } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
// import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Recording = () => {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<any>(null);
  const [isWriteSelected, setIsWriteSelected] = useState<boolean>(false);
  const [isRecordSelected, setIsRecordSelected] = useState<boolean>(false);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const handleSaveRecording = async () => {
    if (!recording) return;

    try {
      const uri = recording.getURI();

      const response = await fetch(uri);
      const blob = await response.blob();

      const result = await uploadVoiceMessage(
        blob,
        "Voice message",
        new Date().toISOString()
      );

      if (result.success) {
        Alert.alert("Success", "Voice message saved!");
        router.back();
      } else {
        Alert.alert("Error", result.error || "Failed to save");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload recording");
    }
  };

  const handleDateChange = (event: any, selectDate?: Date) => {};

  return (
    <SafeAreaView className="flex-1 px-6 py-8 bg-secondary">
      <BackButton />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          // className="flex-1"
        >
          {/* Title */}
          <Text className="font-instrument text-3xl text-center mb-8">
            Create a new Message
          </Text>
          <View className="bg-secondary">
            <TextField placeholder="Title" autoCapitalize="sentences" />

            {/** Select Date */}
            <Pressable
              className="bg-primary mt-6 h-16 rounded-md justify-center px-4"
              onPress={() => setShowDatePicker(!showDatePicker)}
            >
              <View className="flex-row justify-between items-center">
                {/* <Image source={icons.calendar} className="w-5 h-5" /> */}
                <Text className="">Select delivery date </Text>
                {showDatePicker && (
                  <DateTimePicker
                    value={scheduledDate || new Date()}
                    mode="date"
                    minimumDate={new Date()}
                    onChange={handleDateChange}
                  />
                )}
              </View>
            </Pressable>

            {/** Write OR Record */}
            <View className="flex-row justify-center gap-8 mt-10">
              <Pressable
                className="w-24 h-24 rounded-full items-center justify-center self-cente"
                style={{
                  borderColor: isWriteSelected
                    ? colors.accent
                    : colors.textPrimary,
                  backgroundColor: isWriteSelected
                    ? colors.accent
                    : colors.secondary,
                  borderWidth: 1,
                }}
                onPress={() => {
                  setIsWriteSelected(true);
                  setIsRecordSelected(false);
                }}
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
                  borderColor: isRecordSelected
                    ? colors.accent
                    : colors.textPrimary,
                  backgroundColor: isRecordSelected
                    ? colors.accent
                    : colors.secondary,
                  borderWidth: 1,
                }}
                onPress={() => {
                  setIsWriteSelected(false);
                  setIsRecordSelected(true);
                }}
              >
                <Image
                  source={icons.voice}
                  className="w-8 h-8"
                  style={{
                    tintColor: isRecordSelected
                      ? "#FFFFFF"
                      : colors.textPrimary,
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
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Recording;
