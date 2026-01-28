import { useEffect, useRef, useState } from "react";
import { useAudioRecorder, useAudioRecorderState, RecordingPresets, AudioModule, setAudioModeAsync } from "expo-audio";
import { Alert } from "react-native";

// TODO: 
// - Do not erase the audiowaveform when user pauses during recording. 
// - Erase the audiowaveform only when Reset is pressed

export default function useAudioRecorderHook() {
  const [audioUri, setAudioUri] = useState<string | null>(null);

  const recorder = useAudioRecorder({
    ...RecordingPresets.HIGH_QUALITY,
    isMeteringEnabled: true,
  });

  const recorderState = useAudioRecorderState(recorder);
  const latestDecibel = useRef<number | null>(null);

  const [waveformHeights, setWaveformHeights] = useState<number[]>([]);
  const waveformBufferRef = useRef<number[]>([]);

  const resetWaveform = () => {
    waveformBufferRef.current = [];
    setWaveformHeights([]);
  };

  useEffect(() => {
    if (recorderState.metering != null) {
      latestDecibel.current = recorderState.metering;
    }

    // Set audioUri only when recording is no longer active and a URL is available
    if (!recorderState.isRecording && recorderState.url) {
      setAudioUri(recorderState.url);
    }
  }, [recorderState.metering, recorderState.isRecording, recorderState.url]);

  // Build a scrolling waveform based on metering (dB)
  useEffect(() => {
    if (!recorderState.isRecording) {
      resetWaveform();
      return;
    }

    const maxBars = 50;

    // Normalization / shaping
    const minDb = -60;
    const maxDb = 0;
    const gate = 0.08;
    const gamma = 1.8;

    // Visual sizing
    const minBarHeight = 1;
    const maxBarHeight = 80;

    // Start fresh each time we start recording
    resetWaveform();

    const interval = setInterval(() => {
      const db = latestDecibel.current;
      if (db == null) return;

      let normalized = (db - minDb) / (maxDb - minDb); // 0..1
      normalized = Math.max(0, Math.min(1, normalized));

      if (normalized < gate) normalized = 0;
      normalized = Math.pow(normalized, gamma);

      const height = minBarHeight + normalized * (maxBarHeight - minBarHeight);

      const buf = waveformBufferRef.current;
      buf.push(height);
      if (buf.length > maxBars) buf.shift();

      // Create a new array to trigger render
      setWaveformHeights([...buf]);
    }, 120);

    return () => clearInterval(interval);
  }, [recorderState.isRecording]);

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
    waveformHeights,
    setWaveformHeights,
    resetWaveform,
  };
}