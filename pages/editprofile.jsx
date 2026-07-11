import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// TODO: replace with real logged-in user data — GET /me
const MOCK_USER = {
  fullName: "Sam Gdhdh",
  signupMethod: "mobile",
  mobileNumber: "9181074472",
  email: "",
  avatarUri: null,
};

export default function EditProfileScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? "#FBF3E7" : "#1F3D2B";

  const [form, setForm] = useState({
    fullName: MOCK_USER.fullName,
    mobileNumber: MOCK_USER.mobileNumber,
    email: MOCK_USER.email,
  });
  const [avatarUri, setAvatarUri] = useState(MOCK_USER.avatarUri);
  const [saving, setSaving] = useState(false);

  const isMobileUser = MOCK_USER.signupMethod === "mobile";

  const updateField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handlePickAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
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
      setAvatarUri(result.assets[0].uri);
      // TODO: upload result.assets[0].uri to your backend/storage,
      // then set avatarUri to the returned hosted URL instead of the local URI
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      // TODO: PATCH /me with { fullName, email or mobileNumber, avatarUri }
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.back();
    } catch (e) {
      // TODO: surface a real error message
    } finally {
      setSaving(false);
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
            onPress={handlePickAvatar}
            className="relative"
          >
            <View className="h-32 w-32 items-center justify-center rounded-full bg-cream p-2 dark:bg-ink">
              <View className="h-full w-full items-center justify-center overflow-hidden rounded-full bg-pine/60">
                {avatarUri ? (
                  <Image
                    source={{ uri: avatarUri }}
                    style={{ width: "100%", height: "100%" }}
                  />
                ) : (
                  <Ionicons name="person" size={54} color="#FBF3E799" />
                )}

                {/* Overlay */}
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

        {/* Form */}
        <View className="px-5">
          <Field label="Full Name">
            <TextInput
              value={form.fullName}
              onChangeText={(v) => updateField("fullName", v)}
              placeholder="Enter your full name"
              placeholderTextColor={isDark ? "#FBF3E766" : "#2A262066"}
              className="text-base text-pine dark:text-cream"
            />
          </Field>

          {isMobileUser && (
            <Field label="Mobile Number">
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-pine/50 dark:text-cream/50">
                  {form.mobileNumber}
                </Text>
                <Ionicons
                  name="lock-closed-outline"
                  size={16}
                  color={isDark ? "#FBF3E766" : "#2A262066"}
                />
              </View>
            </Field>
          )}

          {!isMobileUser && (
            <Field label="Email">
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-pine/50 dark:text-cream/50">
                  {form.email}
                </Text>
                <Ionicons
                  name="lock-closed-outline"
                  size={16}
                  color={isDark ? "#FBF3E766" : "#2A262066"}
                />
              </View>
            </Field>
          )}

          {isMobileUser ? (
            <Field label="Email">
              <TextInput
                value={form.email}
                onChangeText={(v) => updateField("email", v)}
                placeholder="Enter email"
                placeholderTextColor={isDark ? "#FBF3E766" : "#2A262066"}
                keyboardType="email-address"
                autoCapitalize="none"
                className="text-base text-pine dark:text-cream"
              />
            </Field>
          ) : (
            <Field label="Mobile Number">
              <TextInput
                value={form.mobileNumber}
                onChangeText={(v) => updateField("mobileNumber", v)}
                placeholder="Enter mobile number"
                placeholderTextColor={isDark ? "#FBF3E766" : "#2A262066"}
                keyboardType="phone-pad"
                className="text-base text-pine dark:text-cream"
              />
            </Field>
          )}

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
    </SafeAreaView>
  );
}

function Field({ label, children }) {
  return (
    <View className="mt-5">
      <Text className="mb-1.5 text-[15px] font-medium text-pine/80 dark:text-cream/80">
        {label}
      </Text>
      <View className="rounded-xl border border-fog-200 bg-cream px-4 py-3.5 dark:border-cream/10 dark:bg-pine">
        {children}
      </View>
    </View>
  );
}
