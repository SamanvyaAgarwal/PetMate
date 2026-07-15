import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
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

// TODO: replace with a real fetch — GET /pets/:petId — to pre-fill this form
const MOCK_PET = {
  name: "Bruno",
  gender: "male", // "male" | "female"
  breed: "Labrador Retriever",
  avatar: null,
  dob: "12-03-2024",
  weight: "24",
  weightUnknown: false,
  country: "India",
  state: "Rajasthan",
  city: "Jaipur",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  zipCode: "",
  registrationNumber: "PT-2024-BRU-0417", // generated when the pet was first added
};

const BREEDS = [
  "Labrador Retriever",
  "Golden Retriever",
  "German Shepherd",
  "Beagle",
  "Poodle",
  "Bulldog",
  "Rottweiler",
  "Dachshund",
  "Other",
];

function FieldLabel({ children }) {
  return (
    <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-pine/50">
      {children}
    </Text>
  );
}

function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  editable = true,
}) {
  return (
    <View className="mb-5">
      <FieldLabel>{label}</FieldLabel>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#1F3D2B55"
        keyboardType={keyboardType}
        editable={editable}
        className={`rounded-xl border border-pine/15 px-4 py-3.5 text-[15px] text-pine ${
          editable ? "bg-white" : "bg-pine/5"
        }`}
      />
    </View>
  );
}

function DropdownField({ label, value, placeholder, onPress }) {
  return (
    <View className="mb-5">
      <FieldLabel>{label}</FieldLabel>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className="flex-row items-center justify-between rounded-xl border border-pine/15 bg-white px-4 py-3.5"
      >
        <Text className={`text-[15px] ${value ? "text-pine" : "text-pine/40"}`}>
          {value || placeholder}
        </Text>
        <Ionicons
          name="chevron-down"
          size={18}
          color="#1F3D2B"
          style={{ opacity: 0.5 }}
        />
      </TouchableOpacity>
    </View>
  );
}

export default function EditPetScreen() {
  const { petId } = useLocalSearchParams();

  const [avatar, setAvatar] = useState(MOCK_PET.avatar);
  const [name, setName] = useState(MOCK_PET.name);
  const [gender, setGender] = useState(MOCK_PET.gender);
  const [breed, setBreed] = useState(MOCK_PET.breed);
  const [dob, setDob] = useState(MOCK_PET.dob);
  const [weight, setWeight] = useState(MOCK_PET.weight);
  const [weightUnknown, setWeightUnknown] = useState(MOCK_PET.weightUnknown);
  const [country, setCountry] = useState(MOCK_PET.country);
  const [state, setState] = useState(MOCK_PET.state);
  const [city, setCity] = useState(MOCK_PET.city);
  const [addressLine1, setAddressLine1] = useState(MOCK_PET.addressLine1);
  const [addressLine2, setAddressLine2] = useState(MOCK_PET.addressLine2);
  const [landmark, setLandmark] = useState(MOCK_PET.landmark);
  const [zipCode, setZipCode] = useState(MOCK_PET.zipCode);

  const [showBreedPicker, setShowBreedPicker] = useState(false);

  const pickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "We need access to your photos to set a pet photo.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const toggleWeightUnknown = () => {
    setWeightUnknown((prev) => {
      if (!prev) setWeight("");
      return !prev;
    });
  };

  const handleSelectBreed = (value) => {
    setBreed(value);
    setShowBreedPicker(false);
  };

  const handleShowRegistrationInfo = () => {
    Alert.alert(
      "Registration Number",
      "This is your pet's unique PawTrail ID, generated automatically when the profile was first created. It can't be changed.",
    );
  };

  const handleSave = () => {
    // TODO: call the real update-pet API with petId + all the fields above
    router.back();
  };

  return (
    <View className="flex-1 bg-cream">
      {/* ---------- Header ---------- */}
      <SafeAreaView
        edges={["top"]}
        className="border-b border-pine/10 bg-cream"
      >
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color="#1F3D2B" />
          </TouchableOpacity>
          <Text className="text-base font-extrabold text-pine">Edit Pet</Text>
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
          {/* ---------- Photo picker ---------- */}
          <View className="items-center pb-2 pt-6">
            <TouchableOpacity onPress={pickAvatar} activeOpacity={0.8}>
              <View className="h-28 w-28 items-center justify-center rounded-full border-2 border-dashed border-pine/25 bg-white">
                {avatar ? (
                  <Image
                    source={{ uri: avatar }}
                    style={{ width: 112, height: 112, borderRadius: 56 }}
                  />
                ) : (
                  <Ionicons
                    name="camera-outline"
                    size={28}
                    color="#1F3D2B"
                    style={{ opacity: 0.35 }}
                  />
                )}
              </View>

              {avatar ? (
                <TouchableOpacity
                  onPress={() => setAvatar(null)}
                  activeOpacity={0.8}
                  className="absolute -right-1 -top-1 h-7 w-7 items-center justify-center rounded-full border-2 border-cream bg-clay"
                >
                  <Ionicons name="close" size={14} color="#FBF3E7" />
                </TouchableOpacity>
              ) : (
                <View className="absolute -bottom-1 -right-1 h-8 w-8 items-center justify-center rounded-full border-2 border-cream bg-mustard">
                  <Ionicons name="add" size={18} color="#1F3D2B" />
                </View>
              )}
            </TouchableOpacity>
            <Text className="mt-3 text-xs font-semibold text-pine/40">
              Pet Photo
            </Text>
          </View>

          <View className="px-6 pt-4">
            {/* Name */}
            <TextField
              label="Pet's Name"
              value={name}
              onChangeText={setName}
              placeholder="Bruno"
            />

            {/* Gender toggle */}
            <View className="mb-5">
              <FieldLabel>Gender</FieldLabel>
              <View className="flex-row rounded-xl bg-pine/[0.06] p-1">
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setGender("male")}
                  className={`flex-1 items-center rounded-lg py-2.5 ${gender === "male" ? "bg-pine" : ""}`}
                >
                  <Text
                    className={`text-sm font-semibold ${gender === "male" ? "text-cream" : "text-pine/60"}`}
                  >
                    Male
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setGender("female")}
                  className={`flex-1 items-center rounded-lg py-2.5 ${gender === "female" ? "bg-pine" : ""}`}
                >
                  <Text
                    className={`text-sm font-semibold ${gender === "female" ? "text-cream" : "text-pine/60"}`}
                  >
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Breed */}
            <DropdownField
              label="Pet's Breed"
              value={breed}
              placeholder="Select breed"
              onPress={() => setShowBreedPicker(true)}
            />

            {/* DOB */}
            <View className="mb-5">
              <FieldLabel>Pet's DOB</FieldLabel>
              <View className="flex-row items-center rounded-xl border border-pine/15 bg-white px-4 py-3.5">
                <TextInput
                  value={dob}
                  onChangeText={setDob}
                  placeholder="DD-MM-YYYY"
                  placeholderTextColor="#1F3D2B55"
                  className="flex-1 text-[15px] text-pine"
                />
                {/* TODO: swap for a real native date picker (@react-native-community/datetimepicker) */}
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color="#1F3D2B"
                  style={{ opacity: 0.5 }}
                />
              </View>
            </View>

            {/* Weight + Don't know */}
            <View className="mb-5">
              <View className="mb-2 flex-row items-center justify-between">
                <FieldLabel>Pet's Weight (kg)</FieldLabel>
                <TouchableOpacity
                  onPress={toggleWeightUnknown}
                  activeOpacity={0.6}
                >
                  <Text className="text-xs font-semibold text-clay">
                    {weightUnknown ? "Know weight?" : "Don't know?"}
                  </Text>
                </TouchableOpacity>
              </View>
              <TextInput
                value={weightUnknown ? "" : weight}
                onChangeText={setWeight}
                placeholder={weightUnknown ? "Unknown" : "e.g. 24"}
                placeholderTextColor="#1F3D2B55"
                keyboardType="numeric"
                editable={!weightUnknown}
                className={`rounded-xl border border-pine/15 px-4 py-3.5 text-[15px] text-pine ${
                  weightUnknown ? "bg-pine/5" : "bg-white"
                }`}
              />
            </View>

            {/* Location */}
            {/* TODO: wire real cascading Country -> State -> City data/API */}
            <DropdownField
              label="Country"
              value={country}
              placeholder="Select country"
              onPress={() => {}}
            />
            <View className="mb-5 flex-row gap-3">
              <View className="flex-1">
                <DropdownField
                  label="State"
                  value={state}
                  placeholder="Select state"
                  onPress={() => {}}
                />
              </View>
              <View className="flex-1">
                <DropdownField
                  label="City"
                  value={city}
                  placeholder="Select city"
                  onPress={() => {}}
                />
              </View>
            </View>

            <TextField
              label="Address Line 1"
              value={addressLine1}
              onChangeText={setAddressLine1}
              placeholder="Enter address line 1"
            />
            <TextField
              label="Address Line 2"
              value={addressLine2}
              onChangeText={setAddressLine2}
              placeholder="Enter address line 2"
            />
            <TextField
              label="Landmark"
              value={landmark}
              onChangeText={setLandmark}
              placeholder="Enter landmark"
            />
            <TextField
              label="Zip Code"
              value={zipCode}
              onChangeText={setZipCode}
              placeholder="Enter zip code"
              keyboardType="numeric"
            />

            {/* Registration number — read-only, generated at creation time */}
            <View className="mb-2">
              <View className="mb-2 flex-row items-center gap-1.5">
                <FieldLabel>Registration Number</FieldLabel>
                <TouchableOpacity
                  onPress={handleShowRegistrationInfo}
                  activeOpacity={0.6}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={15}
                    color="#1F3D2B"
                    style={{ opacity: 0.5 }}
                  />
                </TouchableOpacity>
              </View>
              <View className="rounded-xl border border-pine/15 bg-pine/5 px-4 py-3.5">
                <Text className="text-[15px] text-pine/60">
                  {MOCK_PET.registrationNumber}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ---------- Fixed Save button ---------- */}
      <SafeAreaView
        edges={["bottom"]}
        className="border-t border-pine/10 bg-cream px-6 pt-3"
      >
        <TouchableOpacity
          onPress={handleSave}
          activeOpacity={0.85}
          className="mb-3 items-center justify-center rounded-2xl bg-mustard py-4"
        >
          <Text className="text-base font-extrabold text-pine">
            Save Changes
          </Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* ---------- Breed picker modal ---------- */}
      <Modal
        visible={showBreedPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBreedPicker(false)}
      >
        <Pressable
          className="flex-1 bg-pine/50"
          onPress={() => setShowBreedPicker(false)}
        />
        <View className="absolute bottom-0 left-0 right-0 max-h-[70%] rounded-t-[28px] bg-cream px-6 pt-5">
          <SafeAreaView edges={["bottom"]}>
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-extrabold text-pine">
                Select breed
              </Text>
              <TouchableOpacity
                onPress={() => setShowBreedPicker(false)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="close"
                  size={22}
                  color="#1F3D2B"
                  style={{ opacity: 0.6 }}
                />
              </TouchableOpacity>
            </View>

            <ScrollView className="mb-4" showsVerticalScrollIndicator={false}>
              {BREEDS.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => handleSelectBreed(option)}
                  activeOpacity={0.7}
                  className="flex-row items-center justify-between border-b border-pine/10 py-3.5"
                >
                  <Text
                    className={`text-[15px] ${option === breed ? "font-bold text-pine" : "text-pine/70"}`}
                  >
                    {option}
                  </Text>
                  {option === breed && (
                    <Ionicons name="checkmark" size={18} color="#D9A441" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}
