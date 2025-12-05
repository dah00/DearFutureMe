import BackButton from "@/components/BackButton";
import Dropdown from "@/components/Dropdown";
import TextField from "@/components/TextField";
import { uploadVoiceMessage } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Recording = () => {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<any>(null); 

  const handleSaveRecording = async () => {
    if (!recording) return;

    try {
      const uri = recording.getURI();
      
      const response = await fetch(uri);
      const blob = await response.blob();
      
      const result = await uploadVoiceMessage(
        blob,
        "Voice message",  
        new Date().toISOString()  
      );

      if (result.success) {
        Alert.alert("Success", "Voice message saved!");
        router.back();
      } else {
        Alert.alert("Error", result.error || "Failed to save");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload recording");
    }
  };
  
  return (
    <SafeAreaView className="flex-1 px-6 py-8 bg-secondary">
      <BackButton />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          // className="flex-1"
        >
          {/* Title */}
          <Text className="font-instrument text-3xl text-center mb-8">
            Create a new Message
          </Text>
          <View className="bg-secondary">
            {/* <TextInput placeholder='Title' className=''/> */}
            <TextField placeholder="title" autoCapitalize="sentences" />
            <Dropdown
              label="Message Type"
              options={[
                { label: "Voice", value: "Voice" },
                { label: "Text", value: "Text" },
              ]}
            />
            
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Recording;
