import { ErrorDrawer } from "@/components/error-drawer";
import { SuccessDrawer } from "@/components/success-drawer";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { useCallback, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProfile, updateProfile, uploadProfileImage } from "../src/authApi";
import { IMAGE_BASE_URL } from "../src/axios";
// TODO: replace with real logged-in user data — GET /me
// Shape mirrors the `users` table columns exactly

// TODO: replace with a real country list (or a country-picker package)
const COUNTRY_OPTIONS = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Other",
];

// TODO: ideally filtered based on selected country — using India states as demo
const STATE_OPTIONS = [
  "Rajasthan",
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Tamil Nadu",
  "Uttar Pradesh",
  "Gujarat",
  "West Bengal",
  "Other",
];

const GENDER_OPTIONS = ["Male", "Female", "Other"];

const normalizeGender = (value) => {
  if (!value) return "";

  const trimmed = String(value).trim();
  const lower = trimmed.toLowerCase();

  if (lower === "male" || lower === "m") return "Male";
  if (lower === "female" || lower === "f") return "Female";
  if (lower === "other" || lower === "o") return "Other";

  return trimmed;
};

export default function EditProfileScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? "#FBF3E7" : "#1F3D2B";
  const placeholderColor = isDark ? "#FBF3E766" : "#2A262066";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    district: "",
    country: "",
    pincode: "",
    login_method: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [activePicker, setActivePicker] = useState(null); // "country" | "state" | null
  const cameraPermission = ImagePicker.requestCameraPermissionsAsync();
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [showSuccessDrawer, setShowSuccessDrawer] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [pendingNavigation, setPendingNavigation] = useState(null); // route to go to after success drawer auto-closes, or null

  const [showErrorDrawer, setShowErrorDrawer] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const showError = (msg) => {
    setErrorMessage(msg);
    setShowErrorDrawer(true);
  };

  const isPhoneUser = form.login_method === "phone";
  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleTakePhoto = async () => {
    try {
      // Ask for camera permission
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        showError("Please allow camera access.");
        return;
      }

      // Open camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) return;

      const image = result.assets[0];

      const formData = new FormData();

      formData.append("profile_image", {
        uri: image.uri,
        name: "profile.jpg",
        type: "image/jpeg",
      });

      const response = await uploadProfileImage(formData);

      const imagePath = response.data.data.profile_image;

      setProfileImage(`${IMAGE_BASE_URL}${imagePath}`);

      setSuccessMessage("Profile image uploaded successfully.");
      setShowSuccessDrawer(true);
    } catch (error) {
      console.log(error);
      showError("Failed to upload image.");
    }
  };
  const handlePickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      showError(
        "Please allow photo library access to update your profile picture.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setProfileImage(result.assets[0].uri);
      // TODO: upload result.assets[0].uri to your backend/storage,
      // then set profileImage to the returned hosted URL instead of the local URI
    }
  };

  const handleUpdate = async () => {
    try {
      const normalizedGender = normalizeGender(form.gender);

      if (!normalizedGender) {
        showError("Please select your gender.");
        return;
      }

      setSaving(true);
      const response = await updateProfile({
        name: form.name,
        phone: form.phone,
        gender: normalizedGender,
        country: form.country,
        state: form.state,
        district: form.district,
        city: form.city,
        pincode: form.pincode,
        address: form.address,
        profile_image: profileImage,
      });

      setSuccessMessage(response.data.message);
      setPendingNavigation("/profile");
      setShowSuccessDrawer(true);
    } catch (error) {
      showError(error.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };
  const handlePickImage = async () => {
    try {
      // Ask for gallery permission
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        showError("Please allow gallery access.");
        return;
      }

      // Open gallery
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) return;

      const image = result.assets[0];

      const formData = new FormData();

      formData.append("profile_image", {
        uri: image.uri,
        name: "profile.jpg",
        type: "image/jpeg",
      });

      const response = await uploadProfileImage(formData);

      const imagePath = response.data.data.profile_image;

      const fullImageUrl = "http://103.59.75.177:5000" + imagePath;

      setProfileImage(fullImageUrl);

      setProfileImage(`${IMAGE_BASE_URL}${imagePath}`);

      setSuccessMessage("Profile image uploaded successfully.");
      setShowSuccessDrawer(true);
    } catch (error) {
      console.log(error);
      showError("Failed to upload image.");
    }
  };

  const pickerConfig = {
    country: {
      title: "Select Country",
      options: COUNTRY_OPTIONS,
      field: "country",
    },
    state: { title: "Select State", options: STATE_OPTIONS, field: "state" },
    gender: {
      title: "Select Gender",
      options: GENDER_OPTIONS,
      field: "gender",
    },
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, []),
  );
  const loadProfile = async () => {
    try {
      const response = await getProfile();

      const user = response.data.data.user;

      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        gender: normalizeGender(user.gender || ""),
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        district: user.district || "",
        country: user.country || "",
        pincode: user.pincode || "",
        login_method: user.login_method || "email",
      });

      if (user.profile_image) {
        setProfileImage(
          user.profile_image ? `${IMAGE_BASE_URL}${user.profile_image}` : null,
        );
      }
    } catch (error) {
      console.log(error);
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
          Edit Profile
        </Text>
      </View>

      <ScrollView
        className="flex-1 bg-fog-50 dark:bg-ink"
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar block */}
        <View className="items-center pb-6 pt-9">
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setShowPhotoOptions(true)}
            className="relative"
          >
            <View className="h-32 w-32 items-center justify-center rounded-full bg-cream p-2 dark:bg-ink">
              <View className="h-full w-full items-center justify-center overflow-hidden rounded-full bg-pine/60">
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <Ionicons name="person" size={54} color="#FBF3E799" />
                )}

                <View className="absolute bottom-0 left-0 right-0 items-center bg-pine/70 py-2">
                  <Ionicons name="camera-outline" size={18} color="#FBF3E7" />
                  <Text className="mt-0.5 text-[11px] font-semibold text-cream">
                    Edit Photo
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* ---------- Personal Info ---------- */}
        <View className="px-5">
          <Text className="mb-2 ml-1 text-[13px] font-bold tracking-wide text-ink/50 dark:text-cream/50">
            PERSONAL INFO
          </Text>

          <Field label="Full Name">
            <TextInput
              value={form.name}
              onChangeText={(v) => updateField("name", v)}
              placeholder="Enter your full name"
              placeholderTextColor={placeholderColor}
              className="text-base text-pine dark:text-cream"
            />
          </Field>

          {/* Locked field — whichever method the user signed up/logged in with */}
          {isPhoneUser ? (
            <Field label="Phone Number">
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-pine/50 dark:text-cream/50">
                  {form.phone}
                </Text>
                <Ionicons
                  name="lock-closed-outline"
                  size={16}
                  color={placeholderColor}
                />
              </View>
            </Field>
          ) : (
            <Field label="Email">
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-pine/50 dark:text-cream/50">
                  {form.email}
                </Text>
                <Ionicons
                  name="lock-closed-outline"
                  size={16}
                  color={placeholderColor}
                />
              </View>
            </Field>
          )}

          {/* The other contact method — editable/optional */}
          {isPhoneUser ? (
            <Field label="Email">
              <TextInput
                value={form.email}
                onChangeText={(v) => updateField("email", v)}
                placeholder="Enter email"
                placeholderTextColor={placeholderColor}
                keyboardType="email-address"
                autoCapitalize="none"
                className="text-base text-pine dark:text-cream"
              />
            </Field>
          ) : (
            <Field label="Phone Number">
              <TextInput
                value={form.phone}
                onChangeText={(v) => updateField("phone", v)}
                placeholder="Enter phone number"
                placeholderTextColor={placeholderColor}
                keyboardType="phone-pad"
                className="text-base text-pine dark:text-cream"
              />
            </Field>
          )}
        </View>

        {/* ---------- Address ---------- */}
        <View className="mt-6 px-5">
          <Text className="mb-2 ml-1 text-[13px] font-bold tracking-wide text-ink/50 dark:text-cream/50">
            ADDRESS
          </Text>

          <Field label="Address">
            <TextInput
              value={form.address}
              onChangeText={(v) => updateField("address", v)}
              placeholder="House no., street, area"
              placeholderTextColor={placeholderColor}
              multiline
              numberOfLines={2}
              className="text-base text-pine dark:text-cream"
              style={{ minHeight: 44, textAlignVertical: "top" }}
            />
          </Field>

          {/* City + Pincode row */}
          <View className="mt-4 flex-row gap-3">
            <View className="flex-1">
              <Text className="mb-1.5 text-[15px] font-medium text-pine/80 dark:text-cream/80">
                City
              </Text>
              <View className="rounded-xl border border-fog-200 bg-cream px-4 py-3.5 dark:border-cream/10 dark:bg-pine">
                <TextInput
                  value={form.city}
                  onChangeText={(v) => updateField("city", v)}
                  placeholder="City"
                  placeholderTextColor={placeholderColor}
                  className="text-base text-pine dark:text-cream"
                />
              </View>
            </View>

            <View className="flex-1">
              <Text className="mb-1.5 text-[15px] font-medium text-pine/80 dark:text-cream/80">
                Pincode
              </Text>
              <View className="rounded-xl border border-fog-200 bg-cream px-4 py-3.5 dark:border-cream/10 dark:bg-pine">
                <TextInput
                  value={form.pincode}
                  onChangeText={(v) => updateField("pincode", v)}
                  placeholder="Pincode"
                  placeholderTextColor={placeholderColor}
                  keyboardType="number-pad"
                  maxLength={10}
                  className="text-base text-pine dark:text-cream"
                />
              </View>
            </View>
          </View>

          {/* District */}
          <Field label="District">
            <TextInput
              value={form.district}
              onChangeText={(v) => updateField("district", v)}
              placeholder="District"
              placeholderTextColor={placeholderColor}
              className="text-base text-pine dark:text-cream"
            />
          </Field>

          {/* Gender — dropdown */}
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

          {/* State — dropdown */}
          <Field label="State">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActivePicker("state")}
              className="flex-row items-center justify-between"
            >
              <Text
                className={
                  form.state
                    ? "text-base text-pine dark:text-cream"
                    : "text-base text-pine/40 dark:text-cream/40"
                }
              >
                {form.state || "Select State"}
              </Text>
              <Ionicons name="chevron-down" size={18} color={iconColor} />
            </TouchableOpacity>
          </Field>

          {/* Country — dropdown */}
          <Field label="Country">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActivePicker("country")}
              className="flex-row items-center justify-between"
            >
              <Text
                className={
                  form.country
                    ? "text-base text-pine dark:text-cream"
                    : "text-base text-pine/40 dark:text-cream/40"
                }
              >
                {form.country || "Select Country"}
              </Text>
              <Ionicons name="chevron-down" size={18} color={iconColor} />
            </TouchableOpacity>
          </Field>
        </View>

        {/* Update button */}
        <View className="px-5">
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleUpdate}
            disabled={saving}
            className={`mt-8 items-center rounded-full py-4 shadow-sm ${
              saving ? "bg-mustard/50" : "bg-mustard"
            }`}
          >
            <Text className="text-base font-bold text-pine">
              {saving ? "Updating…" : "Update Profile"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ---------- Picker modal (State / Country) ---------- */}
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
          <View className="max-h-[70%] rounded-t-[24px] bg-cream pb-6 pt-2 dark:bg-ink">
            <View className="items-center py-3">
              <View className="h-1.5 w-12 rounded-full bg-fog-200 dark:bg-cream/20" />
            </View>

            {activePicker && (
              <ScrollView showsVerticalScrollIndicator={false}>
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
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* ---------- Photo source action sheet ---------- */}
      <Modal
        visible={showPhotoOptions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPhotoOptions(false)}
      >
        <View className="flex-1 justify-end bg-pine/40">
          <Pressable
            className="absolute inset-0"
            onPress={() => setShowPhotoOptions(false)}
          />
          <View className="rounded-t-[24px] bg-cream pb-6 pt-2 dark:bg-ink">
            <View className="items-center py-3">
              <View className="h-1.5 w-12 rounded-full bg-fog-200 dark:bg-cream/20" />
            </View>

            <Text className="px-6 pb-3 text-lg font-bold text-pine dark:text-cream">
              Update Profile Photo
            </Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setShowPhotoOptions(false);
                handleTakePhoto();
              }}
              className="flex-row items-center gap-3 px-6 py-3.5"
            >
              <Ionicons name="camera-outline" size={20} color={iconColor} />
              <Text className="text-base text-pine dark:text-cream">
                Take Photo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setShowPhotoOptions(false);
                handlePickImage();
              }}
              className="flex-row items-center gap-3 px-6 py-3.5"
            >
              <Ionicons name="images-outline" size={20} color={iconColor} />
              <Text className="text-base text-pine dark:text-cream">
                Choose from Gallery
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <SuccessDrawer
        visible={showSuccessDrawer}
        message={successMessage}
        onContinue={() => {
          setShowSuccessDrawer(false);
          if (pendingNavigation) {
            router.replace(pendingNavigation);
            setPendingNavigation(null);
          }
        }}
      />
      <ErrorDrawer
        visible={showErrorDrawer}
        message={errorMessage}
        onDismiss={() => setShowErrorDrawer(false)}
      />
    </SafeAreaView>
  );
}

function Field({ label, children }) {
  return (
    <View className="mt-4">
      <Text className="mb-1.5 text-[15px] font-medium text-pine/80 dark:text-cream/80">
        {label}
      </Text>
      <View className="rounded-xl border border-fog-200 bg-cream px-4 py-3.5 dark:border-cream/10 dark:bg-pine">
        {children}
      </View>
    </View>
  );
}
