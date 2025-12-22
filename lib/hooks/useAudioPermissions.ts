import { AudioModule, setAudioModeAsync } from "expo-audio";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, AppState, Linking } from "react-native";

export const useAudioPermissions = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const checkAndSetupPermissions = useCallback(
    async (shouldRequest = false) => {
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
    },
    []
  );

  const requestPermissionWithAlert = useCallback(async () => {
    const permissionStatus = await AudioModule.getRecordingPermissionsAsync();
    setHasPermission(permissionStatus.granted);

    if (!permissionStatus.granted) {
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
      return false;
    }

    await setAudioModeAsync({
      allowsRecording: true,
      playsInSilentMode: true,
    });
    return true;
  }, []);

  // Initial permission check
  useEffect(() => {
    checkAndSetupPermissions(true);
  }, [checkAndSetupPermissions]);

  // Re-check permissions when screen comes into focus (e.g., returning from Settings)
  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(async () => {
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

  return {
    hasPermission,
    requestPermissionWithAlert,
    checkAndSetupPermissions,
  };
};
