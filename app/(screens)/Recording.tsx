import BackButton from "@/components/BackButton";
import Dropdown from "@/components/Dropdown";
import TextField from "@/components/TextField";
import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Recording = () => {
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
