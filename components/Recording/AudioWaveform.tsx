import { colors } from "@/constants/colors";
import React, { useEffect, useRef, useState } from "react";
import { Animated, View } from "react-native";

interface AudioWaveformProps {
  isRecording: boolean;
  barCount?: number;
  barWidth?: number;
  barSpacing?: number;
  maxBarHeight?: number;
  minBarHeight?: number;
  color?: string;
}

interface WaveBar {
  id: number;
  height: Animated.Value;
  translateX: Animated.Value;
}

const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isRecording,
  barCount = 50,
  barWidth = 3,
  barSpacing = 2,
  maxBarHeight = 60,
  minBarHeight = 4,
  color = colors.accent,
}) => {
  const [bars, setBars] = useState<WaveBar[]>([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const barIdCounter = useRef(0);
  const animationInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const heightUpdateIntervals = useRef<
    Map<number, ReturnType<typeof setInterval>>
  >(new Map());
  const scrollDuration = 3000; // 3 seconds to scroll across screen
  const barSpacingTotal = barWidth + barSpacing;

  useEffect(() => {
    if (!isRecording) {
      if (animationInterval.current) {
        clearInterval(animationInterval.current);
        animationInterval.current = null;
      }
      heightUpdateIntervals.current.forEach((interval) =>
        clearInterval(interval)
      );
      heightUpdateIntervals.current.clear();
      setBars([]);
      return;
    }

    // Don't start creating bars until we have a valid container width
    if (containerWidth === 0) {
      return;
    }

    // Calculate how often to create new bars based on scroll speed
    // We want bars to be spaced evenly as they scroll
    const pixelsPerSecond = containerWidth / (scrollDuration / 1000);
    const barCreationInterval = Math.max(
      30,
      (barSpacingTotal / pixelsPerSecond) * 1000
    ); // Minimum 30ms

    const createNewBar = (): WaveBar => {
      const id = barIdCounter.current++;
      // Use scale factor instead of height value (0 = minBarHeight, 1 = maxBarHeight)
      const minScale = minBarHeight / maxBarHeight;
      const initialScale = minScale;

      // Start bars at the right edge of the container
      // They'll scroll from right to left across the screen
      const startX = containerWidth - barWidth;

      const newBar: WaveBar = {
        id,
        height: new Animated.Value(initialScale), // This will be used as scaleY
        translateX: new Animated.Value(startX),
      };

      return newBar;
    };

    const animateBar = (bar: WaveBar) => {
      // Scroll from right to left, ending off-screen to the left
      Animated.timing(bar.translateX, {
        toValue: -barWidth, // Move completely off-screen to the left
        duration: scrollDuration,
        useNativeDriver: true,
      }).start(() => {
        const interval = heightUpdateIntervals.current.get(bar.id);
        if (interval) {
          clearInterval(interval);
          heightUpdateIntervals.current.delete(bar.id);
        }
        setBars((prev) => prev.filter((b) => b.id !== bar.id));
      });

      // Update height to simulate volume using scaleY
      const updateHeight = () => {
        const isSpeaking = Math.random() > 0.3;
        const volume = isSpeaking
          ? Math.random() * 0.5 + 0.5
          : Math.random() * 0.2 + 0.1;
        // Calculate scale factor (0 to 1) based on volume
        const minScale = minBarHeight / maxBarHeight;
        const targetScale = minScale + volume * (1 - minScale);

        Animated.spring(bar.height, {
          toValue: targetScale,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }).start();
      };

      const heightInterval = setInterval(
        updateHeight,
        100 + Math.random() * 100
      );
      heightUpdateIntervals.current.set(bar.id, heightInterval);
      setTimeout(updateHeight, 50);
    };

    animationInterval.current = setInterval(() => {
      const newBar = createNewBar();
      setBars((prev) => {
        const maxVisibleBars = Math.ceil(containerWidth / barSpacingTotal) + 5;
        const updated = [...prev, newBar];
        return updated.slice(-maxVisibleBars);
      });
      animateBar(newBar);
    }, barCreationInterval);

    return () => {
      if (animationInterval.current) {
        clearInterval(animationInterval.current);
      }
      heightUpdateIntervals.current.forEach((interval) =>
        clearInterval(interval)
      );
      heightUpdateIntervals.current.clear();
    };
  }, [
    isRecording,
    barWidth,
    barSpacing,
    maxBarHeight,
    minBarHeight,
    scrollDuration,
    barSpacingTotal,
    containerWidth, // Re-run effect when container width changes
  ]);

  return (
    <View
      style={{
        width: "100%",
        height: maxBarHeight,
        overflow: "hidden",
      }}
      onLayout={(event) => {
        const width = event.nativeEvent.layout.width;
        if (width > 0 && width !== containerWidth) {
          setContainerWidth(width);
        }
      }}
    >
      <View
        style={{
          height: maxBarHeight,
          width: "100%",
          position: "relative",
        }}
      >
        {bars.map((bar) => (
          <Animated.View
            key={bar.id}
            style={{
              width: barWidth,
              height: maxBarHeight, // Fixed height, use scaleY for animation
              backgroundColor: color,
              borderRadius: barWidth / 2,
              position: "absolute",
              bottom: 0,
              left: 0, // Use left: 0 as base, translateX will position it
              transform: [
                { translateX: bar.translateX },
                { scaleY: bar.height }, // Use scaleY for height animation
              ],
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default AudioWaveform;
