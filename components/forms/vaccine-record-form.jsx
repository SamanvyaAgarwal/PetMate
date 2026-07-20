import * as ImagePicker from "expo-image-picker";
import { addVaccine, updateVaccine } from "@/src/authApi";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

// Renders inside <BottomDrawer title="Add Vaccine Record">.
// `onClose` dismisses the drawer (replaces the old router.back()).
export function VaccineRecordForm({
  petId,
  onClose,
  onSuccess,
  mode = "add",
  vaccine = null,
}) {
  const insets = useSafeAreaInsets();

  const [vaccineName, setVaccineName] = useState("");
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [images, setImages] = useState([]);
  const [reminderOn, setReminderOn] = useState(false);
  const [reminderDate, setReminderDate] = useState("");
  const [showVaccinePicker, setShowVaccinePicker] = useState(false);

  useEffect(() => {
    if (mode === "edit" && vaccine) {
      setVaccineName(vaccine.vaccine_name);
      setDate(vaccine.vaccination_date);
      setNotes(vaccine.notes || "");

      if (vaccine.next_due_date) {
        setReminderOn(true);
        setReminderDate(vaccine.next_due_date);
      } else {
        setReminderOn(false);
        setReminderDate("");
      }
    }
  }, [mode, vaccine]);

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
  const formatDateForApi = (dateString) => {
    console.log("Received Date:", dateString);

    const date = new Date(dateString);

    console.log("JS Date:", date);

    return date.toISOString().split("T")[0];
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

  const handleAddMore = async () => {
    if (!isValid) {
      Alert.alert(
        "Missing info",
        "Please fill in the required fields before adding another record."
      );
      return;
    }

    try {
      setLoading(true);
     const payload = {
  vaccine_name: vaccineName,
  vaccination_date: formatDateForApi(date),
  next_due_date: reminderOn
    ? formatDateForApi(reminderDate)
    : null,
  doctor_name: "",
  hospital_name: "",
  notes,
};

      const response = await addVaccine(petId, payload);

      Alert.alert("Success", response.data.message);

      resetForm();

      if (onSuccess) {
        await onSuccess();
      }
    } catch (error) {
      console.log(error.response?.data || error);

      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = async () => {
    if (!isValid) {
      Alert.alert("Missing info", "Please fill in the required fields.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        vaccine_name: vaccineName,
        vaccination_date: formatDateForApi(date),
        next_due_date: reminderOn
          ? formatDateForApi(reminderDate)
          : null,
        notes,
        doctor_name: "",
        hospital_name: "",
      };
      console.log("Payload:", payload);

      let response;

      if (mode === "edit") {
        response = await updateVaccine(vaccine.id, payload);
      } else {
        response = await addVaccine(petId, payload);
      }

      console.log("API Response:", response.data);

      Alert.alert(
        "Success",
        mode === "edit"
          ? "Vaccine updated successfully."
          : "Vaccine added successfully."
      );

      resetForm();

      if (onSuccess) {
        await onSuccess();
      }

      onClose();
    } catch (error) {
      console.log(error.response?.data || error);

      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong."
      );
    } finally {
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
          <Text className="text-base font-extrabold text-pine">
            {loading
              ? "Saving..."
              : mode === "edit"
                ? "Update"
                : "Proceed"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleProceed}
          activeOpacity={0.85}
          className="flex-1 items-center justify-center rounded-2xl bg-mustard py-4"
        >
          {/* <Text className="text-base font-extrabold text-pine">Proceed</Text> */}
          <Text className="text-base font-extrabold text-pine">
            {loading
              ? "Saving..."
              : mode === "edit"
                ? "Update"
                : "Proceed"}
          </Text>
        </TouchableOpacity>
      </View>

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
    </>
  );
}
