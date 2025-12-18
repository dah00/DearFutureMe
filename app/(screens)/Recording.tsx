import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
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
  TextInput,
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
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const [messageTitle, setMessageTitle] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);
  const [showTextMessageField, setShowTextMessageField] =
    useState<boolean>(false);
  const [showVoiceRecording, setShowVoiceRecording] = useState<boolean>(false);
  const [textContent, setTextContent] = useState<string>("");

  const handleSaveRecording = async () => {
    if (!messageTitle.trim() && !recording) {
      setShowError(true);
      return;
    }

    setShowError(false);
    try {
      const uri = recording.getURI();

      const response = await fetch(uri);
      const blob = await response.blob();

      const result = await uploadVoiceMessage(
        blob,
        messageTitle.trim(),
        scheduledDate?.toISOString()
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

  const handleDateChange = (event: any, selectDate?: Date) => {
    if (selectDate) {
      setTempDate(selectDate);
    }
    // Only close if explicitly dismissed
    if (event.type === "dismissed") {
      setShowDatePicker(false);
    }
  };

  const handleConfirmDate = () => {
    // Save the temp date as the actual scheduled date
    setScheduledDate(tempDate);
    setShowDatePicker(false);
  };

  const handleCancelDate = () => {
    // Reset temp date to current scheduled date or current date
    setTempDate(scheduledDate || new Date());
    setShowDatePicker(false);
  };

  const formatDateTime = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <SafeAreaView className="flex-1 px-6 py-8 bg-secondary">
      <BackButton />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          // className="flex-1"
        >
          {/* Header */}
          <Text className="font-instrument text-3xl text-center mb-8">
            Create a new Message
          </Text>
          {/* Title */}
          <TextField
            value={messageTitle}
            placeholder="Title"
            onChangeText={setMessageTitle}
            autoCapitalize="sentences"
            isRequired={true}
            showError={!messageTitle && showError}
          />{" "}
          {/** Select Date */}
          <Pressable
            className="bg-primary mt-6 rounded-md justify-center px-4"
            style={{ minHeight: 60, paddingVertical: 12 }}
            onPress={() => {
              setTempDate(scheduledDate || new Date());
              setShowDatePicker(!showDatePicker);
            }}
          >
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-sm text-gray-600">
                  Select delivery date
                </Text>
                {scheduledDate ? (
                  <Text className="text-base font-semibold mt-1">
                    {formatDateTime(scheduledDate)}
                  </Text>
                ) : (
                  <Text className="text-sm text-gray-400 mt-1">
                    Tap to select date & time
                  </Text>
                )}
              </View>
              {scheduledDate && (
                <Image
                  source={icons.calendar}
                  className="w-6 h-6 ml-4"
                  style={{ tintColor: colors.accent }}
                />
              )}
            </View>
          </Pressable>
          {showDatePicker && (
            <View className="mt-4">
              <DateTimePicker
                value={tempDate}
                mode="datetime"
                minimumDate={new Date()}
                onChange={handleDateChange}
                display="default"
                textColor={colors.textPrimary}
                style={{
                  height: Platform.OS === "android" ? 120 : undefined,
                }}
              />
              {/* iOS: Add Cancel and Done buttons */}
              <View className="flex-row justify-end gap-4 mt-4 px-2">
                <Pressable
                  onPress={handleCancelDate}
                  className="px-6 py-2 rounded-md"
                  style={{ backgroundColor: colors.secondary }}
                >
                  <Text
                    className="text-base"
                    style={{ color: colors.textPrimary }}
                  >
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleConfirmDate}
                  className="px-6 py-2 rounded-md"
                  style={{ backgroundColor: colors.accent }}
                >
                  <Text className="text-base font-semibold text-white">
                    Done
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
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
                setShowTextMessageField(true);
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
                setShowVoiceRecording(true);
              }}
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
          {showTextMessageField && (
            <View className="mt-8">
              <TextInput
                onChangeText={setTextContent}
                value={textContent}
                placeholder={`What it do future $Name`}
                multiline
                editable
                className="border rounded-lg border-border px-3 py-4 h-20"
              />
            </View>
          )}
          {/** Create button */}
          <View className="items-center mt-10">
            <Button text="Create" onPress={handleSaveRecording} size="lg" />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Recording;
