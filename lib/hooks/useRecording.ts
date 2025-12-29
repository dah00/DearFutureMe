import {
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { useState } from "react";
import { Alert } from "react-native";

export const useRecording = () => {
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [recording, setRecording] = useState<any>(null);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

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
    startRecording,
    stopRecording,
    resetRecording,
  };
};
