import { colors } from "@/constants/colors";
import React from "react";
import { Pressable, Text, View } from "react-native";
import AudioWaveform from "./AudioWaveform";

interface VoiceRecordingControlsProps {
  isRecording: boolean;
  recordingUri: string | null;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

const VoiceRecordingControls: React.FC<VoiceRecordingControlsProps> = ({
  isRecording,
  recordingUri,
  onStartRecording,
  onStopRecording,
}) => {
  return (
    <View className="mt-8 items-center">
      {/* Audio Waveform Visualization */}
      <View className="w-full px-4 mb-6">
        <AudioWaveform
          isRecording={isRecording}
          barCount={50}
          barWidth={3}
          barSpacing={2}
          maxBarHeight={60}
          minBarHeight={4}
          color={colors.accent}
        />
      </View>

      {/* Record Button */}
      <Pressable
        onPress={isRecording ? onStopRecording : onStartRecording}
        className="mt-6 px-8 py-4 rounded-full"
        style={{
          backgroundColor: isRecording ? colors.error : colors.accent,
        }}
      >
        <Text className="text-white font-bold text-lg">
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Text>
      </Pressable>

      {/* Show recorded message indicator */}
      {recordingUri && !isRecording && (
        <Text className="mt-4 text-accent font-semibold">
          ✓ Recording saved
        </Text>
      )}
    </View>
  );
};

export default VoiceRecordingControls;
