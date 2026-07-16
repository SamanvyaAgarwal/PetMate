import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { addPet } from "../src/petApi";
import {
  uploadProfileImage,
  uploadPetImage,
} from "../src/authApi";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// TODO: replace with a real API call, e.g.:
// const res = await fetch(`${API_BASE}/me/pets`, {
//   method: "POST",
//   body: JSON.stringify(form),
// });
// const { serial } = await res.json();
// The backend assigns and returns the serial only on successful creation.


const GENDER_OPTIONS = ["Male", "Female", "Unknown"];
const CATEGORY_OPTIONS = ["Dog", "Cat", "Bird", "Rabbit", "Reptile", "Other"];
const COUNTRY_OPTIONS = ["India", "United States", "United Kingdom", "Other"];

function formatDate(date) {
  if (!date) return "";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AddPetScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? "#FBF3E7" : "#1F3D2B";
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    name: "",
    gender: "",
    category: "",
    breed: "",
    dob: null,
    weight: "",
  });

  const [saving, setSaving] = useState(false);
  const [activePicker, setActivePicker] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    try {
      setSaving(true);

      let petImage = null;

      // Upload image first
      if (images.length > 0) {
        const formData = new FormData();

        formData.append("image", {
          uri: images[0].uri,
          name: "pet.jpg",
          type: "image/jpeg",
        });

        const uploadResponse = await uploadPetImage(formData);

        petImage = uploadResponse.data.data.pet_image;
      }

      // Save pet
      const response = await addPet({
        pet_name: form.name,
        pet_type: form.category,
        breed: form.breed,
        gender: form.gender,
        dob: form.dob,
        weight: form.weight,
        vaccinated: false,
        about_pet: "",
        pet_image: petImage,
      });

      Alert.alert("Success", response.data.message);

      router.back();

    } catch (error) {

      console.log(error.response?.data || error);

      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong"
      );

    } finally {
      setSaving(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === "android") setShowDatePicker(false);
    if (event.type === "dismissed") return;
    if (selectedDate) updateField("dob", selectedDate);
  };

  const pickerConfig = {
    gender: {
      title: "Select Gender",
      options: GENDER_OPTIONS,
      field: "gender",
    },
    category: {
      title: "Select Category",
      options: CATEGORY_OPTIONS,
      field: "category",
    },
  };

  const pickImages = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      alert("Permission to access gallery is required.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 1,
    });

    if (!result.canceled) {
      setImages(result.assets.slice(0, 3));
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-pine" edges={["top"]}>
      {/* Top bar */}
      <View className="relative flex-row items-center justify-center border-b border-fog-200 bg-cream px-4 py-3.5 dark:border-cream/10 dark:bg-pine">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="absolute left-3 z-10 h-9 w-9 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={26} color={iconColor} />
        </TouchableOpacity>
        <Text className="text-[17px] font-semibold text-pine dark:text-cream">
          Add Pet
        </Text>
      </View>

      <ScrollView
        className="flex-1 bg-fog-50 dark:bg-ink"
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-6">
          <Text className="text-2xl font-bold leading-8 text-pine dark:text-cream">
            Tell us more about{"\n"}your pet
          </Text>

          {/* Image picker */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={pickImages}
            className="mt-5 h-36 w-36 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-pine/25 dark:border-cream/25"
          >
            {images.length > 0 ? (
              <Image
                source={{ uri: images[0].uri }}
                contentFit="cover"
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            ) : (
              <>
                <Ionicons name="camera-outline" size={30} color="#D9A441" />

                <Text className="mt-2 px-2 text-center text-[13px] text-pine/70 dark:text-cream/70">
                  Tap to add image
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Pet's Name */}
          <Field label="Pet's Name">
            <TextInput
              value={form.name}
              onChangeText={(v) => updateField("name", v)}
              placeholder="Enter Pet's Name"
              placeholderTextColor={isDark ? "#FBF3E766" : "#2A262066"}
              className="text-base text-pine dark:text-cream"
            />
          </Field>

          {/* Gender */}
          <Field label="Gender">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActivePicker("gender")}
              className="flex-row items-center justify-between"
            >
              <Text
                className={
                  form.gender
                    ? "text-base text-pine dark:text-cream"
                    : "text-base text-pine/40 dark:text-cream/40"
                }
              >
                {form.gender || "Select Gender"}
              </Text>
              <Ionicons name="chevron-down" size={18} color={iconColor} />
            </TouchableOpacity>
          </Field>

          {/* Category + Breed row */}
          <View className="mt-4 flex-row gap-3">
            <View className="flex-1">
              <Text className="mb-1.5 text-[13px] font-medium text-pine/60 dark:text-cream/60">
                Pet's Category
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setActivePicker("category")}
                className="rounded-xl border border-fog-200 bg-cream px-4 py-3.5 dark:border-cream/10 dark:bg-pine"
              >
                <Text
                  className={
                    form.category
                      ? "text-base text-pine dark:text-cream"
                      : "text-base text-pine/40 dark:text-cream/40"
                  }
                  numberOfLines={1}
                >
                  {form.category || "Select"}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-1">
              <Text className="mb-1.5 text-[13px] font-medium text-pine/60 dark:text-cream/60">
                Pet's Breed
              </Text>
              <View className="rounded-xl border border-fog-200 bg-cream px-4 py-0.5 dark:border-cream/10 dark:bg-pine">
                <TextInput
                  value={form.breed}
                  onChangeText={(v) => updateField("breed", v)}
                  placeholder="Enter breed"
                  placeholderTextColor={isDark ? "#FBF3E766" : "#2A262066"}
                  className="text-base text-pine dark:text-cream"
                  numberOfLines={1}
                />
              </View>
            </View>
          </View>

          {/* DOB */}
          <Field label="Pet's DOB">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowDatePicker(true)}
              className="flex-row items-center justify-between"
            >
              <Text
                className={
                  form.dob
                    ? "text-base text-pine dark:text-cream"
                    : "text-base text-pine/40 dark:text-cream/40"
                }
              >
                {form.dob ? formatDate(form.dob) : "Select Pet's DOB"}
              </Text>
              <Ionicons name="calendar-outline" size={20} color={iconColor} />
            </TouchableOpacity>
          </Field>
          <TouchableOpacity className="mt-1.5 self-end">
            <Text className="text-[13px] font-medium text-clay">
              Don't know?
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={form.dob || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              maximumDate={new Date()}
              onChange={handleDateChange}
              {...(Platform.OS === "ios" && isDark
                ? { themeVariant: "dark" }
                : {})}
            />
          )}
          {Platform.OS === "ios" && showDatePicker && (
            <TouchableOpacity
              onPress={() => setShowDatePicker(false)}
              className="mt-2 items-center rounded-full bg-mustard/20 py-2.5"
            >
              <Text className="font-semibold text-clay">Done</Text>
            </TouchableOpacity>
          )}

          {/* Weight */}
          <Field label="Pet's Weight">
            <TextInput
              value={form.weight}
              onChangeText={(v) => updateField("weight", v)}
              placeholder="Enter Pet's Weight"
              placeholderTextColor={isDark ? "#FBF3E766" : "#2A262066"}
              keyboardType="numeric"
              className="text-base text-pine dark:text-cream"
            />
          </Field>

          {/* Pet Serial Number — empty/disabled until Save is pressed */}
          <Text className="mb-1.5 mt-4 text-[13px] font-medium text-pine/60 dark:text-cream/60">
            Pet Serial Number
          </Text>
          <View className="flex-row items-center justify-between rounded-xl border border-fog-200 bg-fog-100 px-4 py-3.5 dark:border-cream/10 dark:bg-pine/40">
            <Text className="text-base text-pine/40 dark:text-cream/40">
              Assigned automatically after saving
            </Text>
            <Ionicons
              name="lock-closed-outline"
              size={16}
              color={isDark ? "#FBF3E766" : "#2A262066"}
            />
          </View>

          {/* Save button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleSave}
            disabled={saving}
            className={`mt-8 items-center rounded-full py-4 shadow-sm ${
              saving ? "bg-mustard/50" : "bg-mustard"
            }`}
          >
            <Text className="text-base font-bold text-pine">
              {saving ? "Saving…" : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ---------- Picker modal (Gender / Category) ---------- */}
      <Modal
        visible={!!activePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setActivePicker(null)}
      >
        <View className="flex-1 justify-end bg-pine/40">
          <Pressable
            className="absolute inset-0"
            onPress={() => setActivePicker(null)}
          />
          <View className="rounded-t-[24px] bg-cream pb-6 pt-2 dark:bg-ink">
            <View className="items-center py-3">
              <View className="h-1.5 w-12 rounded-full bg-fog-200 dark:bg-cream/20" />
            </View>

            {activePicker && (
              <>
                <Text className="px-6 pb-3 text-lg font-bold text-pine dark:text-cream">
                  {pickerConfig[activePicker].title}
                </Text>
                {pickerConfig[activePicker].options.map((option) => (
                  <TouchableOpacity
                    key={option}
                    activeOpacity={0.7}
                    onPress={() => {
                      updateField(pickerConfig[activePicker].field, option);
                      setActivePicker(null);
                    }}
                    className="flex-row items-center justify-between px-6 py-3.5"
                  >
                    <Text className="text-base text-pine dark:text-cream">
                      {option}
                    </Text>
                    {form[pickerConfig[activePicker].field] === option && (
                      <Ionicons name="checkmark" size={18} color="#D9A441" />
                    )}
                  </TouchableOpacity>
                ))}
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function Field({ label, children }) {
  return (
    <View className="mt-4">
      <Text className="mb-1.5 text-[13px] font-medium text-pine/60 dark:text-cream/60">
        {label}
      </Text>
      <View className="rounded-xl border border-fog-200 bg-cream px-4 py-3.5 dark:border-cream/10 dark:bg-pine">
        {children}
      </View>
    </View>
  );
}
