import BackButton from "@/components/BackButton";
import DatePickerSection from "@/components/Recording/DatePickerSection";
import MessageTypeSelector from "@/components/Recording/MessageTypeSelector";
import TextMessageInput from "@/components/Recording/TextMessageInput";
import VoiceRecordingControls from "@/components/Recording/VoiceRecordingControls";
import TextField from "@/components/TextField";
import { createMessage, uploadVoiceMessage } from "@/lib/api";
import { useAudioPermissions } from "@/lib/hooks/useAudioPermissions";
import { useRecording } from "@/lib/hooks/useRecording";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Recording = () => {
  const [isWriteSelected, setIsWriteSelected] = useState<boolean>(false);
  const [isRecordSelected, setIsRecordSelected] = useState<boolean>(false);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [messageTitle, setMessageTitle] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);
  const [textContent, setTextContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { hasPermission, requestPermissionWithAlert } = useAudioPermissions();
  const {
    recordingUri,
    recording,
    recorderState,
    startRecording,
    stopRecording,
    resetRecording,
  } = useRecording();

  const handleWriteSelect = () => {
    setIsWriteSelected(true);
    setIsRecordSelected(false);
  };

  const handleRecordSelect = () => {
    setIsWriteSelected(false);
    setIsRecordSelected(true);
    resetRecording();
  };

  const handleStartRecording = async () => {
    const hasPerm = await requestPermissionWithAlert();
    if (hasPerm) {
      await startRecording(true);
    }
  };

  const handleStopRecording = async () => {
    await stopRecording();
  };

  const handleSave = async () => {
    // 1. Validate title
    const trimmedTitle = messageTitle.trim();
    if (!trimmedTitle) {
      setShowError(true);
      Alert.alert("Error", "Please enter a title");
      return;
    }

    // 2. Validate message type selected
    if (!isWriteSelected && !isRecordSelected) {
      Alert.alert("Error", "Please select Write or Record");
      return;
    }

    // 3. Validate content based on type
    if (isWriteSelected && !textContent.trim()) {
      Alert.alert("Error", "Please enter a message");
      return;
    }

    if (isRecordSelected && !recording) {
      Alert.alert("Error", "Please record a voice message");
      return;
    }

    setIsLoading(true);
    setShowError(false);

    try {
      const scheduledDateISO = scheduledDate?.toISOString() || null;

      if (isWriteSelected) {
        // Save text message
        const result = await createMessage({
          title: trimmedTitle,
          content: textContent.trim(),
          message_type: "text",
          scheduled_date: scheduledDateISO ?? undefined,
        });

        if (result.success) {
          Alert.alert("Success", "Message saved!");
          router.back();
        } else {
          Alert.alert("Error", result.error || "Failed to save message");
        }
      } else {
        // Save voice message
        if (!recordingUri) {
          Alert.alert("Error", "Please record a voice message");
          return;
        }

        const response = await fetch(recordingUri);
        const blob = await response.blob();

        const result = await uploadVoiceMessage(
          blob,
          trimmedTitle,
          scheduledDateISO ?? undefined
        );

        if (result.success) {
          Alert.alert("Success", "Voice message saved!");
          router.back();
        } else {
          Alert.alert("Error", result.error || "Failed to save voice message");
        }
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 px-6 py-8 bg-secondary">
      <BackButton />
      <Pressable
        className="p-4 absolute top-12 right-6 z-10 rounded-full bg-accent items-center justify-center"
        onPress={handleSave}
        disabled={isLoading}
      >
        <Text className="text-white font-bold text-xl">Save</Text>
      </Pressable>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          {/* Header */}
          <Text className="font-instrument text-3xl text-center mt-8 mb-8">
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
          />

          {/* Date Picker */}
          <DatePickerSection
            scheduledDate={scheduledDate}
            onDateChange={setScheduledDate}
          />

          {/* Message Type Selector */}
          <MessageTypeSelector
            isWriteSelected={isWriteSelected}
            isRecordSelected={isRecordSelected}
            onWriteSelect={handleWriteSelect}
            onRecordSelect={handleRecordSelect}
          />

          {/* Text Message Input */}
          {isWriteSelected && (
            <TextMessageInput
              value={textContent}
              onChangeText={setTextContent}
            />
          )}

          {/* Voice Recording Controls */}
          {isRecordSelected && (
            <VoiceRecordingControls
              isRecording={recorderState.isRecording}
              recordingUri={recordingUri}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
            />
          )}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Recording;
