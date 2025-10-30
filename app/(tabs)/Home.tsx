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

const Home = () => {
  return (
    <SafeAreaView className="flex-1 px-6 py-8 bg-red-700">
      {/* Back Button */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          // className="flex-1"
        >
          {/** Header */}
          <View className="flex-row justify-between mb-10">
            <Text className="font-instrument text-2xl">
              Hello, Rio/First Name/
            </Text>
            <View>
              <Text>Profile Icon</Text>
            </View>
          </View>
          {/** Upcoming Messages */}
          <View className="mb-10">
            <View className="flex-row justify-between">
              <Text className="text-2xl">Upcoming Messages</Text>
              <Text>Calendar Icon</Text>
            </View>
            <View>
              <View>
                <Text>Upcomoing Message 1</Text>
                <Text>on MM/DD/YYYY</Text>
              </View>
              <View>
                <Text>Upcomoing Message 1</Text>
                <Text>on MM/DD/YYYY</Text>
              </View>
            </View>
          </View>
          <View>
            {/** Voice Recording */}
            <View>
              <Text className="text-2xl">Let's Record</Text>
              <Text className="text-xl">
                What will your future self thank you for
              </Text>

              <View></View>
              <Text>Record a voice message</Text>
            </View>
            {/** Text Recording */}
            <View></View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Home;
