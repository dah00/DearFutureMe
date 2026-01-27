import { useEffect, useRef, useState } from "react";
import { useAudioRecorder, useAudioRecorderState, RecordingPresets, AudioModule, setAudioModeAsync } from "expo-audio";
import { Alert } from "react-native";

export default function useAudioRecorderHook() {
  const [audioUri, setAudioUri] = useState<string | null>(null);

  const recorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  });

  const recorderState = useAudioRecorderState(recorder);
  const latestDecibel = useRef<number | null>(null);

  useEffect(() => {
    if (recorderState.metering != null) {
      latestDecibel.current = recorderState.metering;
    }

    // Set audioUri only when recording is no longer active and a URL is available
    if (!recorderState.isRecording && recorderState.url) {
      setAudioUri(recorderState.url);
    }
  }, [recorderState.metering, recorderState.isRecording, recorderState.url]);

  const startOrStopRecording = async () => {
    try {
      const permission = await AudioModule.requestRecordingPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission required");
        return;
      }

      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });

      if (recorderState.isRecording) {
        await recorder.stop();
      } else {
        await recorder.prepareToRecordAsync();
        recorder.record();
      }
    } catch (e) {
      console.error("Failed to start or stop recording:", e);
      Alert.alert("Recording Error", "An error occurred while managing the recording.");
    }
  };

  return {
    recordingInProgress: recorderState.isRecording,
    currentDecibel: recorderState.metering ?? null,
    audioUri,
    startOrStopRecording,
    latestDecibel,
  };
}