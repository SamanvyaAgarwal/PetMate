import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  DropdownField,
  FieldLabel,
  OptionPickerModal,
  TextAreaField,
} from "@/components/form-fields";

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

export default function AddHobbyScreen() {
  const { petId } = useLocalSearchParams();

  const [hobbyName, setHobbyName] = useState("");
  const [interestLevel, setInterestLevel] = useState(1);
  const [notes, setNotes] = useState("");
  const [showHobbyPicker, setShowHobbyPicker] = useState(false);

  const isValid = hobbyName.trim().length > 0 && interestLevel > 0;

  const handleSave = () => {
    if (!isValid) {
      Alert.alert(
        "Missing info",
        "Please select a hobby and an interest level.",
      );
      return;
    }
    // TODO: save this hobby record via the real API (petId, hobbyName, interestLevel, notes)
    router.back();
  };

  return (
    <View className="flex-1 bg-cream">
      <SafeAreaView
        edges={["top"]}
        className="border-b border-pine/10 bg-cream"
      >
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color="#1F3D2B" />
          </TouchableOpacity>
          <Text className="text-base font-extrabold text-pine">Add Hobby</Text>
          <View style={{ width: 24 }} />
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <View className="px-6 pt-5">
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SafeAreaView
        edges={["bottom"]}
        className="border-t border-pine/10 bg-cream px-6 pt-3"
      >
        <TouchableOpacity
          onPress={handleSave}
          activeOpacity={0.85}
          className="mb-3 items-center justify-center rounded-2xl bg-mustard py-4"
        >
          <Text className="text-base font-extrabold text-pine">Save</Text>
        </TouchableOpacity>
      </SafeAreaView>

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
    </View>
  );
}
