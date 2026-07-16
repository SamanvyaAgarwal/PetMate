import Ionicons from "@expo/vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
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
  ImageUploadField,
  OptionPickerModal,
  TextAreaField,
} from "@/components/form-fields";

const ALLERGY_OPTIONS = [
  "Pollen",
  "Dust Mites",
  "Chicken",
  "Beef",
  "Dairy",
  "Fleas",
  "Mold",
  "Grass",
  "Medication",
  "Other",
];

export default function AddAllergyScreen() {
  const { petId } = useLocalSearchParams();

  const [allergyName, setAllergyName] = useState("");
  const [reaction, setReaction] = useState("");
  const [images, setImages] = useState([]);
  const [showAllergyPicker, setShowAllergyPicker] = useState(false);

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

  const isValid = allergyName.trim().length > 0;

  const resetForm = () => {
    setAllergyName("");
    setReaction("");
    setImages([]);
  };

  const handleAddMore = () => {
    if (!isValid) {
      Alert.alert(
        "Missing info",
        "Please select an allergy name before adding another record.",
      );
      return;
    }
    // TODO: save this allergy record via the real API (petId, allergyName, reaction, images)
    resetForm();
  };

  const handleProceed = () => {
    if (!isValid) {
      Alert.alert("Missing info", "Please select an allergy name.");
      return;
    }
    // TODO: save this allergy record via the real API
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
            Add Allergy
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
              label="Allergy Name"
              required
              value={allergyName}
              placeholder="Select an option"
              onPress={() => setShowAllergyPicker(true)}
            />

            <TextAreaField
              label="Reaction Description"
              value={reaction}
              onChangeText={setReaction}
              placeholder="Describe reaction"
            />

            <ImageUploadField
              images={images}
              onAdd={pickImages}
              onRemove={removeImage}
            />
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
        visible={showAllergyPicker}
        title="Select allergy"
        options={ALLERGY_OPTIONS}
        selected={allergyName}
        onSelect={(val) => {
          setAllergyName(val);
          setShowAllergyPicker(false);
        }}
        onClose={() => setShowAllergyPicker(false)}
      />
    </View>
  );
}
