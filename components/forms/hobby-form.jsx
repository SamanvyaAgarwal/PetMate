import { addHobby } from "@/src/authApi";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ErrorDrawer } from "@/components/error-drawer";
import {
  DropdownField,
  FieldLabel,
  OptionPickerModal,
  TextAreaField,
} from "@/components/form-fields";
import { SuccessDrawer } from "@/components/success-drawer";

const HOBBY_OPTIONS = [
  "Fetch",
  "Swimming",
  "Tug of War",
  "Belly Rubs",
  "Car Rides",
  "Squeaky Toys",
  "Digging",
  "Chasing Balls",
  "Other",
];

const STAR_VALUES = [1, 2, 3, 4, 5];

// Renders inside <BottomDrawer title="Add Hobby">.
// `onClose` dismisses the drawer (replaces the old router.back()).
export function HobbyForm({ petId, onClose, onSuccess }) {
  const insets = useSafeAreaInsets();

  const [hobbyName, setHobbyName] = useState("");
  const [interestLevel, setInterestLevel] = useState(1);
  const [notes, setNotes] = useState("");
  const [showHobbyPicker, setShowHobbyPicker] = useState(false);
  const [showSuccessDrawer, setShowSuccessDrawer] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorDrawer, setShowErrorDrawer] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const showError = (msg) => {
    setErrorMessage(msg);
    setShowErrorDrawer(true);
  };
  const resetForm = () => {
    setHobbyName("");
    setInterestLevel(1);
    setNotes("");
  };
  const isValid = hobbyName.trim().length > 0 && interestLevel > 0;

  const handleSave = async () => {
    if (!isValid) {
      showError("Please select a hobby and an interest level.");
      return;
    }

    try {
      console.log("Pet ID:", petId);

      const payload = {
        hobby_name: hobbyName,
        rating: interestLevel,
      };

      console.log("Payload:", payload);

      await addHobby(petId, payload);

      resetForm();

      if (onSuccess) {
        await onSuccess();
      }

      setSuccessMessage("Hobby added successfully.");
      setShowSuccessDrawer(true);
    } catch (error) {
      showError(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        className="px-6 pt-5"
      >
        <DropdownField
          label="Hobby Name"
          required
          value={hobbyName}
          placeholder="Select Hobby"
          onPress={() => setShowHobbyPicker(true)}
        />

        <View className="mb-5">
          <FieldLabel required>Pet's Interest Level</FieldLabel>
          <View className="flex-row gap-2">
            {STAR_VALUES.map((value) => (
              <TouchableOpacity
                key={value}
                onPress={() => setInterestLevel(value)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={value <= interestLevel ? "star" : "star-outline"}
                  size={30}
                  color={value <= interestLevel ? "#D9A441" : "#1F3D2B33"}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TextAreaField
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Notes"
        />
      </ScrollView>

      <View
        style={{ paddingBottom: insets.bottom || 12 }}
        className="border-t border-pine/10 bg-cream px-6 pt-3"
      >
        <TouchableOpacity
          onPress={handleSave}
          activeOpacity={0.85}
          className="items-center justify-center rounded-2xl bg-mustard py-4"
        >
          <Text className="text-base font-extrabold text-pine">Save</Text>
        </TouchableOpacity>
      </View>

      <OptionPickerModal
        visible={showHobbyPicker}
        title="Select hobby"
        options={HOBBY_OPTIONS}
        selected={hobbyName}
        onSelect={(val) => {
          setHobbyName(val);
          setShowHobbyPicker(false);
        }}
        onClose={() => setShowHobbyPicker(false)}
      />
      <SuccessDrawer
        visible={showSuccessDrawer}
        message={successMessage}
        onContinue={() => {
          setShowSuccessDrawer(false);
          onClose();
        }}
      />
      <ErrorDrawer
        visible={showErrorDrawer}
        message={errorMessage}
        onDismiss={() => setShowErrorDrawer(false)}
      />
    </>
  );
}
