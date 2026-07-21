import { addAllergy } from "@/src/authApi";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ErrorDrawer } from "@/components/error-drawer";
import {
  DropdownField,
  ImageUploadField,
  OptionPickerModal,
  TextAreaField,
} from "@/components/form-fields";
import { SuccessDrawer } from "@/components/success-drawer";

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

// Renders inside <BottomDrawer title="Add Allergy">.
// `onClose` dismisses the drawer (replaces the old router.back()).
export function AllergyForm({ petId, onClose, onSuccess }) {
  const insets = useSafeAreaInsets();

  const [allergyName, setAllergyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [reaction, setReaction] = useState("");
  const [images, setImages] = useState([]);
  const [showAllergyPicker, setShowAllergyPicker] = useState(false);
  const [showSuccessDrawer, setShowSuccessDrawer] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorDrawer, setShowErrorDrawer] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const showError = (msg) => {
    setErrorMessage(msg);
    setShowErrorDrawer(true);
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      showError("We need access to your photos to upload images.");
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
      showError("Please select an allergy name before adding another record.");
      return;
    }
    // TODO: save this allergy record via the real API (petId, allergyName, reaction, images)
    resetForm();
  };

  const handleProceed = async () => {
    console.log("Proceed button pressed");

    if (!isValid) {
      console.log("Validation failed");
      showError("Please select an allergy name.");
      return;
    }

    try {
      console.log("Inside try block");
      setLoading(true);

      const payload = {
        allergy_name: allergyName,
        severity: "Low",
        symptoms: reaction,
        treatment: "",
        notes: "",
      };

      console.log("Payload:", payload);

      const response = await addAllergy(petId, payload);

      console.log("API Success:", response.data);

      resetForm();

      if (onSuccess) {
        await onSuccess();
      }

      setSuccessMessage("Allergy added successfully.");
      setShowSuccessDrawer(true);
    } catch (error) {
      console.log("Catch block");
      console.log(error);
      console.log(error.response?.data);

      showError(error.response?.data?.message || error.message);
    } finally {
      console.log("Finally block");
      setLoading(false);
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
      </ScrollView>

      <View
        style={{ paddingBottom: insets.bottom || 12 }}
        className="flex-row gap-3 border-t border-pine/10 bg-cream px-6 pt-3"
      >
        <TouchableOpacity
          onPress={handleAddMore}
          activeOpacity={0.85}
          className="flex-1 items-center justify-center rounded-2xl border-2 border-mustard py-4"
        >
          <Text className="text-base font-extrabold text-pine">Add More</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleProceed}
          activeOpacity={0.85}
          className="flex-1 items-center justify-center rounded-2xl bg-mustard py-4"
        >
          <Text className="text-base font-extrabold text-pine">
            {loading ? "Saving..." : "Proceed"}
          </Text>
        </TouchableOpacity>
      </View>

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
