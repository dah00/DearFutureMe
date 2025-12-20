import BackButton from "@/components/BackButton";
import TextField from "@/components/TextField";
import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import { createMessage, uploadVoiceMessage } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
// import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  AppState,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  // Helper function to check and set up permissions
  const checkAndSetupPermissions = async (shouldRequest = false) => {
    try {
      // Always get fresh permission status (doesn't show prompt)
      let currentStatus = await AudioModule.getRecordingPermissionsAsync();

      if (currentStatus.granted) {
        // Permission granted, set audio mode
        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });
        setHasPermission(true);
        return true;
      }

      // If permission is undetermined and we should request, or if it was denied before
      // (requesting again after user enabled in Settings will return granted without showing prompt)
      if (shouldRequest || currentStatus.status === "undetermined") {
        // Request permission - if user enabled it in Settings, this will return granted
        // If still denied, it returns denied without showing prompt
        currentStatus = await AudioModule.requestRecordingPermissionsAsync();

        if (currentStatus.granted) {
          await setAudioModeAsync({
            allowsRecording: true,
            playsInSilentMode: true,
          });
          setHasPermission(true);
          return true;
        } else if (shouldRequest && currentStatus.status === "denied") {
          // User denied first time
          setHasPermission(false);
          Alert.alert(
            "Microphone Access Required",
            "To record voice messages, please allow microphone access in Settings.",
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Open Settings",
                onPress: () => Linking.openSettings(),
              },
            ]
          );
          return false;
        }
      }

      // Permission denied or not granted
      setHasPermission(false);
      return false;
    } catch (error) {
      console.error("Error checking permissions:", error);
      setHasPermission(false);
      return false;
    }
  };

  // Initial permission check
  useEffect(() => {
    checkAndSetupPermissions(true);
  }, []);

  // Re-check permissions when screen comes into focus (e.g., returning from Settings)
  useFocusEffect(
    useCallback(() => {
      // Check permissions every time the screen comes into focus
      // Always try requesting (even if previously denied) to get fresh status after Settings change
      // Add a small delay to ensure iOS has updated permission status after returning from Settings
      const timer = setTimeout(async () => {
        // Always try requesting to get the latest status (won't show prompt if already denied/granted)
        const status = await AudioModule.requestRecordingPermissionsAsync();
        if (status.granted) {
          await setAudioModeAsync({
            allowsRecording: true,
            playsInSilentMode: true,
          });
          setHasPermission(true);
        } else {
          setHasPermission(false);
        }
      }, 300);

      return () => clearTimeout(timer);
    }, [])
  );

  // Re-check permissions when app comes to foreground (e.g., returning from Settings)
  useEffect(() => {
    let appState = AppState.currentState;

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      // Only check if transitioning from background/inactive to active
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        // Delay to ensure permission status has updated after returning from Settings
        // Always try requesting to get the latest status (won't show prompt if already denied/granted)
        setTimeout(async () => {
          const status = await AudioModule.requestRecordingPermissionsAsync();
          if (status.granted) {
            await setAudioModeAsync({
              allowsRecording: true,
              playsInSilentMode: true,
            });
            setHasPermission(true);
          } else {
            setHasPermission(false);
          }
        }, 300);
      }
      appState = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleStartRecording = async () => {
    try {
      // Always re-check permission before attempting to record (in case user changed it in Settings)
      // Force a fresh check by calling the API again
      const permissionStatus = await AudioModule.getRecordingPermissionsAsync();

      // Update state
      setHasPermission(permissionStatus.granted);

      if (!permissionStatus.granted) {
        // Permission not granted, show alert with option to open Settings
        Alert.alert(
          "Microphone Access Required",
          "Microphone permission is required to record voice messages. Please enable it in Settings.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Open Settings",
              onPress: () => Linking.openSettings(),
            },
          ]
        );
        return;
      }

      // Set audio mode before recording
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      setIsRecording(true);
      // Start pulse animation
      startPulseAnimation();
    } catch (error) {
      Alert.alert("Error", "Failed to start recording");
      console.error(error);
    }
  };

  const handleStopRecording = async () => {
    try {
      await audioRecorder.stop();
      setIsRecording(false);
      const uri = audioRecorder.uri;
      setRecordingUri(uri);
      setRecording({ getURI: () => uri }); // Update your existing recording state
      stopPulseAnimation();
    } catch (error) {
      Alert.alert("Error", "Failed to stop recording");
      console.error(error);
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnim.stopAnimation();
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
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
        // Handle result...
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
      // Error handling...
    } finally {
      setIsLoading(false);
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
      <Pressable
        className="p-4 absolute top-12 right-6 z-10 rounded-full bg-accent items-center justify-center"
        onPress={handleSave}
      >
        {/* <Image
          source={icons.check}
          className="w-6 h-6"
          style={{ tintColor: colors.primary }}
        /> */}
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
                setShowVoiceRecording(false);
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
                setShowTextMessageField(false);
                setRecordingUri(null);
                setRecording(null);
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
                className="border rounded-lg border-border px-3 py-4 h-80 bg-primary"
              />
            </View>
          )}

          {showVoiceRecording && (
            <View className="mt-8 items-center">
              {/* Volume Visualization - Pulsing Circle */}
              <Animated.View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: recorderState.isRecording
                    ? colors.accent
                    : colors.secondary,
                  alignItems: "center",
                  justifyContent: "center",
                  transform: [
                    {
                      scale: recorderState.isRecording ? pulseAnim : 1,
                    },
                  ],
                  borderWidth: 2,
                  borderColor: recorderState.isRecording
                    ? colors.accent
                    : colors.textPrimary,
                }}
              >
                <Image
                  source={icons.voice}
                  style={{
                    width: 40,
                    height: 40,
                    tintColor: recorderState.isRecording
                      ? "#FFFFFF"
                      : colors.textPrimary,
                  }}
                />
              </Animated.View>

              {/* Record Button */}
              <Pressable
                onPress={
                  recorderState.isRecording
                    ? handleStopRecording
                    : handleStartRecording
                }
                className="mt-6 px-8 py-4 rounded-full"
                style={{
                  backgroundColor: recorderState.isRecording
                    ? colors.error
                    : colors.accent,
                }}
              >
                <Text className="text-white font-bold text-lg">
                  {recorderState.isRecording
                    ? "Stop Recording"
                    : "Start Recording"}
                </Text>
              </Pressable>

              {/* Show recorded message indicator */}
              {recordingUri && !recorderState.isRecording && (
                <Text className="mt-4 text-accent">✓ Recording saved</Text>
              )}
            </View>
          )}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Recording;
