import { useEffect, useState } from "react";
import { View } from "react-native";

export default function AudioWaveform({
  recordingInProgress,
  latestDecibel,
}: {
  recordingInProgress: boolean;
  latestDecibel: React.RefObject<number | null>;
}) {
  const [waveformHeights, setWaveformHeights] = useState<number[]>([]);
  const maxBars = 50;

  useEffect(() => {
    if (!recordingInProgress) return;
    setWaveformHeights([]);

    let waveformBuffer: number[] = [];
    const interval = setInterval(() => {
      if (latestDecibel.current != null) {
        // const normalized = Math.max(0, Math.min(1, (latestDecibel.current + 60) / 60));
        // // const variation = 0.6 + Math.random() * 0.1; // WhatsApp wiggle
        // const variation = 1
        // const height = normalized * 40 * variation;

        const db = latestDecibel.current; // typically -60..0
        const minDb = -60;
        const maxDb = 0;

        let normalized = (db - minDb) / (maxDb - minDb); // 0..1
        normalized = Math.max(0, Math.min(1, normalized));

        // Noise gate: treat very quiet as silence
        const gate = 0.08; // try 0.05 - 0.15
        if (normalized < gate) normalized = 0;

        // Optional: make quiet even quieter (gamma curve)
        const gamma = 1.8; // >1 compresses low values
        normalized = Math.pow(normalized, gamma);

        // Now compute height (no variation)
        const maxBarHeight = 80; // px (pick what looks good)
        const minBarHeight = 1; // px (or 0)
        const height =
          minBarHeight + normalized * (maxBarHeight - minBarHeight);

        waveformBuffer.push(height);
        if (waveformBuffer.length > maxBars) waveformBuffer.shift();

        setWaveformHeights([...waveformBuffer]);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [recordingInProgress]);

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
            height: height * 2,
            backgroundColor: "#007AFF",
            borderRadius: 2,
          }}
        />
      ))}
    </View>
  );
}
