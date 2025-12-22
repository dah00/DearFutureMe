import {
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { useRef, useState } from "react";
import { Alert, Animated } from "react-native";

export const useRecording = () => {
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [recording, setRecording] = useState<any>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

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

  const startRecording = async (hasPermission: boolean) => {
    if (!hasPermission) {
      return false;
    }

    try {
      // Set audio mode before recording
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      startPulseAnimation();
      return true;
    } catch (error) {
      Alert.alert("Error", "Failed to start recording");
      console.error(error);
      return false;
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorder.stop();
      const uri = audioRecorder.uri;
      setRecordingUri(uri);
      setRecording({ getURI: () => uri });
      stopPulseAnimation();
      return uri;
    } catch (error) {
      Alert.alert("Error", "Failed to stop recording");
      console.error(error);
      return null;
    }
  };

  const resetRecording = () => {
    setRecordingUri(null);
    setRecording(null);
  };

  return {
    recordingUri,
    recording,
    recorderState,
    pulseAnim,
    startRecording,
    stopRecording,
    resetRecording,
  };
};
