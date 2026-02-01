import React from "react";
import { View } from "react-native";

export default function AudioWaveformView({
  waveformHeights,
}: {
  waveformHeights: number[];
}) {
  return (
    <View
      style={{
        height: 60,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        width: "100%",
        marginBottom: 20,
      }}
    >
      {waveformHeights.map((height, index) => (
        <View
          key={index}
          style={{
            width: 4,
            height: height,
            backgroundColor: "#007AFF",
            borderRadius: 2,
          }}
        />
      ))}
    </View>
  );
}

