import { colors } from "@/constants/colors";
import { icons } from "@/constants/icons";
import React, { useMemo } from "react";
import { Animated, Image, Pressable, Text, View } from "react-native";

interface VoiceRecordingControlsProps {
  isRecording: boolean;
  recordingUri: string | null;
  pulseAnim: Animated.Value;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

const VoiceRecordingControls: React.FC<VoiceRecordingControlsProps> = ({
  isRecording,
  recordingUri,
  pulseAnim,
  onStartRecording,
  onStopRecording,
}) => {
  // Use a constant animated value for non-recording state
  const staticScale = useMemo(() => new Animated.Value(1), []);

  return (
    <View className="mt-8 items-center">
      {/* Volume Visualization - Pulsing Circle */}
      <Animated.View
        style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: isRecording ? colors.accent : colors.secondary,
          alignItems: "center",
          justifyContent: "center",
          transform: [
            {
              scale: isRecording ? pulseAnim : staticScale,
            },
          ],
          borderWidth: 2,
          borderColor: isRecording ? colors.accent : colors.textPrimary,
        }}
      >
        <Image
          source={icons.voice}
          style={{
            width: 40,
            height: 40,
            tintColor: isRecording ? "#FFFFFF" : colors.textPrimary,
          }}
        />
      </Animated.View>

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
        <Text className="mt-4 text-accent">✓ Recording saved</Text>
      )}
    </View>
  );
};

export default VoiceRecordingControls;
