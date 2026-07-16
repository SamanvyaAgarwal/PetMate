import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  DateField,
  DropdownField,
  ImageUploadField,
  OptionPickerModal,
  TextAreaField,
} from "@/components/form-fields";

const VACCINE_OPTIONS = [
  "Rabies",
  "Distemper",
  "Parvovirus",
  "Bordetella (Kennel Cough)",
  "Leptospirosis",
  "Canine Influenza",
  "Other",
];

export default function AddVaccineRecordScreen() {
  const { petId } = useLocalSearchParams();

  const [vaccineName, setVaccineName] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [images, setImages] = useState([]);
  const [reminderOn, setReminderOn] = useState(false);
  const [reminderDate, setReminderDate] = useState("");
  const [showVaccinePicker, setShowVaccinePicker] = useState(false);

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "We need access to your photos to upload images.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets.map((a) => a.uri)]);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const isValid = vaccineName.trim().length > 0 && date.trim().length > 0;

  const resetForm = () => {
    setVaccineName("");
    setDate("");
    setNotes("");
    setImages([]);
    setReminderOn(false);
    setReminderDate("");
  };

  const handleAddMore = () => {
    if (!isValid) {
      Alert.alert(
        "Missing info",
        "Please fill in the required fields before adding another record.",
      );
      return;
    }
    // TODO: save this vaccine record via the real API (petId, vaccineName, date, notes, images, reminder)
    resetForm();
  };

  const handleProceed = () => {
    if (!isValid) {
      Alert.alert("Missing info", "Please fill in the required fields.");
      return;
    }
    // TODO: save this vaccine record via the real API
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
          <Text className="text-base font-extrabold text-pine">
            Add Vaccine Record
          </Text>
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
              label="Vaccine Name"
              required
              value={vaccineName}
              placeholder="Select Vaccine"
              onPress={() => setShowVaccinePicker(true)}
            />

            <DateField
              label="Date of Vaccination"
              required
              value={date}
              onChangeText={setDate}
            />

            <TextAreaField
              label="Notes"
              value={notes}
              onChangeText={setNotes}
              placeholder="notes"
            />

            <ImageUploadField
              images={images}
              onAdd={pickImages}
              onRemove={removeImage}
            />

            {/* Reminder toggle */}
            <View className="mb-5 rounded-xl border border-pine/10 bg-white px-4 py-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-xs font-bold uppercase tracking-widest text-pine/60">
                  Set Next Reminder
                </Text>
                <Switch
                  value={reminderOn}
                  onValueChange={setReminderOn}
                  trackColor={{ false: "#1F3D2B22", true: "#D9A441" }}
                  thumbColor="#FBF3E7"
                />
              </View>

              {reminderOn && (
                <View className="mt-4">
                  <DateField
                    label="Reminder Date"
                    value={reminderDate}
                    onChangeText={setReminderDate}
                    placeholder="Select reminder date"
                  />
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SafeAreaView
        edges={["bottom"]}
        className="flex-row gap-3 border-t border-pine/10 bg-cream px-6 pt-3"
      >
        <TouchableOpacity
          onPress={handleAddMore}
          activeOpacity={0.85}
          className="mb-3 flex-1 items-center justify-center rounded-2xl border-2 border-mustard py-4"
        >
          <Text className="text-base font-extrabold text-pine">Add More</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleProceed}
          activeOpacity={0.85}
          className="mb-3 flex-1 items-center justify-center rounded-2xl bg-mustard py-4"
        >
          <Text className="text-base font-extrabold text-pine">Proceed</Text>
        </TouchableOpacity>
      </SafeAreaView>

      <OptionPickerModal
        visible={showVaccinePicker}
        title="Select vaccine"
        options={VACCINE_OPTIONS}
        selected={vaccineName}
        onSelect={(val) => {
          setVaccineName(val);
          setShowVaccinePicker(false);
        }}
        onClose={() => setShowVaccinePicker(false)}
      />
    </View>
  );
}
