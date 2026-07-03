import Ionicons from "@expo/vector-icons/Ionicons";
// import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Thin radiating ticks around the paw seal — evokes a stamped kennel-club emblem
const SEAL_TICKS = Array.from({ length: 14 });

export default function SignUpScreen() {
  const [signupMethod, setSignupMethod] = useState("email"); // "email" | "phone"
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  //   const pickAvatar = async () => {
  //     const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  //     if (status !== "granted") {
  //       Alert.alert(
  //         "Permission needed",
  //         "We need access to your photos to set a profile picture.",
  //       );
  //       return;
  //     }

  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       allowsEditing: true,
  //       aspect: [1, 1],
  //       quality: 0.8,
  //     });

  //     if (!result.canceled) {
  //       setAvatar(result.assets[0].uri);
  //     }
  //   };

  const handleSignUp = () => {
    // TODO: wire up real account creation
    router.replace("/(tabs)");
  };

  return (
    <View className="flex-1 bg-[#1F3D2B]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* ---------- Compact hero seal ---------- */}
          <SafeAreaView edges={["top"]}>
            <View className="items-center px-8 pb-8 pt-6">
              <Text className="mb-4 text-xs font-semibold tracking-[4px] text-[#D9A441]">
                PAWTRAIL
              </Text>

              <View className="items-center justify-center">
                <View className="absolute h-28 w-28 items-center justify-center">
                  {SEAL_TICKS.map((_, i) => {
                    const angle = (360 / SEAL_TICKS.length) * i;
                    return (
                      <View
                        key={i}
                        style={{
                          position: "absolute",
                          width: 2,
                          height: 7,
                          backgroundColor: "#D9A441",
                          opacity: 0.5,
                          transform: [
                            { rotate: `${angle}deg` },
                            { translateY: -50 },
                          ],
                        }}
                      />
                    );
                  })}
                </View>

                <View className="h-16 w-16 items-center justify-center rounded-full border-2 border-[#D9A441]">
                  <Ionicons name="paw" size={26} color="#FBF3E7" />
                </View>
              </View>

              <Text className="mt-6 text-center text-3xl font-extrabold text-[#FBF3E7]">
                Join the pack.
              </Text>
              <Text className="mt-2 text-center text-[15px] text-[#FBF3E7]/60">
                Set up your tag in under a minute.
              </Text>
            </View>
          </SafeAreaView>

          {/* ---------- Cream sheet with the sign-up form ---------- */}
          <View className="flex-1 rounded-t-[32px] bg-[#FBF3E7] px-8 pt-8">
            {/* Profile picture picker */}
            {/* <View className="mb-7 items-center">
              <TouchableOpacity onPress={pickAvatar} activeOpacity={0.8}>
                <View className="h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-[#1F3D2B]/25 bg-white">
                  {avatar ? (
                    <Image
                      source={{ uri: avatar }}
                      style={{ width: 96, height: 96, borderRadius: 48 }}
                    />
                  ) : (
                    <Ionicons
                      name="camera-outline"
                      size={26}
                      color="#1F3D2B"
                      style={{ opacity: 0.35 }}
                    />
                  )}
                </View>

              
                <View className="absolute -bottom-1 -right-1 h-8 w-8 items-center justify-center rounded-full border-2 border-[#FBF3E7] bg-[#D9A441]">
                  <Ionicons name="add" size={18} color="#1F3D2B" />
                </View>
              </TouchableOpacity>

              <Text className="mt-3 text-xs font-semibold text-[#1F3D2B]/40">
                {avatar ? "Looking good!" : "Add a profile picture (optional)"}
              </Text>
            </View> */}

            {/* Name field */}
            <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#1F3D2B]/50">
              Full name
            </Text>
            <View className="mb-5 flex-row items-center rounded-xl border border-[#1F3D2B]/15 bg-white px-4 py-3.5">
              <Ionicons
                name="person-outline"
                size={18}
                color="#1F3D2B"
                style={{ opacity: 0.5 }}
              />
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Alex Rivera"
                placeholderTextColor="#1F3D2B55"
                autoCapitalize="words"
                className="ml-3 flex-1 text-[15px] text-[#1F3D2B]"
              />
            </View>

            {/* Email / Phone tab switcher */}
            <View className="mb-6 flex-row rounded-xl bg-[#1F3D2B]/[0.06] p-1">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSignupMethod("email")}
                className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-lg py-2.5 ${
                  signupMethod === "email" ? "bg-[#1F3D2B]" : ""
                }`}
              >
                <Ionicons
                  name="mail-outline"
                  size={15}
                  color={signupMethod === "email" ? "#FBF3E7" : "#1F3D2B99"}
                />
                <Text
                  className={`text-[13px] font-semibold ${
                    signupMethod === "email"
                      ? "text-[#FBF3E7]"
                      : "text-[#1F3D2B]/60"
                  }`}
                >
                  Email
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSignupMethod("phone")}
                className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-lg py-2.5 ${
                  signupMethod === "phone" ? "bg-[#1F3D2B]" : ""
                }`}
              >
                <Ionicons
                  name="call-outline"
                  size={15}
                  color={signupMethod === "phone" ? "#FBF3E7" : "#1F3D2B99"}
                />
                <Text
                  className={`text-[13px] font-semibold ${
                    signupMethod === "phone"
                      ? "text-[#FBF3E7]"
                      : "text-[#1F3D2B]/60"
                  }`}
                >
                  Phone
                </Text>
              </TouchableOpacity>
            </View>

            {/* Email or Phone field, depending on the selected tab */}
            {signupMethod === "email" ? (
              <>
                <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#1F3D2B]/50">
                  Email
                </Text>
                <View className="mb-5 flex-row items-center rounded-xl border border-[#1F3D2B]/15 bg-white px-4 py-3.5">
                  <Ionicons
                    name="mail-outline"
                    size={18}
                    color="#1F3D2B"
                    style={{ opacity: 0.5 }}
                  />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@email.com"
                    placeholderTextColor="#1F3D2B55"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    className="ml-3 flex-1 text-[15px] text-[#1F3D2B]"
                  />
                </View>
              </>
            ) : (
              <>
                <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#1F3D2B]/50">
                  Phone number
                </Text>
                <View className="mb-5 flex-row items-center rounded-xl border border-[#1F3D2B]/15 bg-white px-4 py-3.5">
                  <Ionicons
                    name="call-outline"
                    size={18}
                    color="#1F3D2B"
                    style={{ opacity: 0.5 }}
                  />
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="+1 (555) 000-0000"
                    placeholderTextColor="#1F3D2B55"
                    keyboardType="phone-pad"
                    className="ml-3 flex-1 text-[15px] text-[#1F3D2B]"
                  />
                </View>
              </>
            )}

            {/* Password field */}
            <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#1F3D2B]/50">
              Password
            </Text>
            <View className="mb-5 flex-row items-center rounded-xl border border-[#1F3D2B]/15 bg-white px-4 py-3.5">
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#1F3D2B"
                style={{ opacity: 0.5 }}
              />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#1F3D2B55"
                secureTextEntry={!showPassword}
                className="ml-3 flex-1 text-[15px] text-[#1F3D2B]"
              />
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color="#1F3D2B"
                  style={{ opacity: 0.5 }}
                />
              </TouchableOpacity>
            </View>

            {/* Confirm password field */}
            <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#1F3D2B]/50">
              Confirm password
            </Text>
            <View className="mb-6 flex-row items-center rounded-xl border border-[#1F3D2B]/15 bg-white px-4 py-3.5">
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#1F3D2B"
                style={{ opacity: 0.5 }}
              />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••"
                placeholderTextColor="#1F3D2B55"
                secureTextEntry={!showPassword}
                className="ml-3 flex-1 text-[15px] text-[#1F3D2B]"
              />
            </View>

            {/* The signature element: a rotated, engraved dog tag as the submit button */}
            <TouchableOpacity
              onPress={handleSignUp}
              activeOpacity={0.85}
              className="self-center"
              style={{ transform: [{ rotate: "-2deg" }] }}
            >
              <View className="relative w-[280px] rounded-2xl bg-[#D9A441] px-6 py-5 shadow-lg">
                <View className="absolute -top-3 left-6 h-6 w-6 items-center justify-center rounded-full border-2 border-[#1F3D2B] bg-[#FBF3E7]">
                  <View className="h-2 w-2 rounded-full bg-[#1F3D2B]" />
                </View>

                <View className="flex-row items-center justify-between pl-2">
                  <View>
                    <Text className="text-[11px] font-semibold tracking-widest text-[#1F3D2B]/60">
                      NEW TAG
                    </Text>
                    <Text className="mt-0.5 text-lg font-extrabold text-[#1F3D2B]">
                      Create Account
                    </Text>
                  </View>
                  <Ionicons
                    name="arrow-forward-circle"
                    size={30}
                    color="#1F3D2B"
                  />
                </View>
              </View>
            </TouchableOpacity>

            {/* Divider */}
            <View className="my-8 flex-row items-center">
              <View className="h-px flex-1 bg-[#1F3D2B]/10" />
              <Text className="mx-3 text-xs text-[#1F3D2B]/40">
                or continue with
              </Text>
              <View className="h-px flex-1 bg-[#1F3D2B]/10" />
            </View>

            {/* Social sign-up */}
            <View className="mb-8 flex-row justify-center gap-4">
              <TouchableOpacity
                activeOpacity={0.7}
                className="h-12 w-12 items-center justify-center rounded-full border border-[#1F3D2B]/15 bg-white"
              >
                <Ionicons name="logo-google" size={20} color="#1F3D2B" />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                className="h-12 w-12 items-center justify-center rounded-full border border-[#1F3D2B]/15 bg-white"
              >
                <Ionicons name="logo-apple" size={20} color="#1F3D2B" />
              </TouchableOpacity>
            </View>

            <SafeAreaView edges={["bottom"]}>
              <TouchableOpacity
                className="mb-6 items-center"
                activeOpacity={0.6}
                onPress={() => router.replace("/login")}
              >
                <Text className="text-sm text-[#2A2620]/60">
                  Already walking with us?{" "}
                  <Text className="font-semibold text-[#B5533C]">Log in</Text>
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
