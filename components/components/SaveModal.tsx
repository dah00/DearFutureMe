import React, { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import Button from "../Button";
import TextField from "../TextField";

interface SaveModalProps {
  showSaveModal: boolean;
  setShowSaveModal: React.Dispatch<React.SetStateAction<boolean>>;
  // setShowSaveModal: () => void
}

const SaveModal = ({ showSaveModal, setShowSaveModal }: SaveModalProps) => {
  const [title, setTitle] = useState<string>();
  const [focusArea, setFocusArea] = useState<string>();
  return (
    <Modal visible={showSaveModal} animationType="slide" transparent={true}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-xl w-[80%] pt-20 pb-8 px-6">
          <View className="absolute top-6 right-8">
            <Pressable onPress={() => setShowSaveModal(false)}>
              <Text className="font-bold text-xl">X</Text>
            </Pressable>
          </View>
          <View className="gap-2">
            <TextField
              placeholder="Title (Optional)"
              autoCapitalize="words"
              secureTextEntry={false}
              value={title}
              isRequired={false}
              onChangeText={setTitle}
              showError={false}
            />
            <TextField
              placeholder="Focus Area (Optional)"
              autoCapitalize="words"
              secureTextEntry={false}
              value={focusArea}
              isRequired={false}
              onChangeText={setFocusArea}
              showError={false}
            />
          </View>
          <View className="items-center mt-8">
            <Button
              text="Save"
              onPress={() => setShowSaveModal(true)}
              size="md"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SaveModal;
