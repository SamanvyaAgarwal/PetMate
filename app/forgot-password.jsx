import Ionicons from "@expo/vector-icons/Ionicons";
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

export default function ForgotPasswordScreen() {
  const [resetMethod, setResetMethod] = useState("email"); // "email" | "phone"
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const isReady =
    resetMethod === "email" ? email.trim().length > 0 : phone.trim().length > 0;

  const handleSendCode = () => {
    if (!isReady) return;
    // TODO: trigger real password-reset code send
    router.push({
      pathname: "/otp",
      params: {
        contact: resetMethod === "email" ? email : phone,
        method: resetMethod,
        purpose: "reset",
      },
    });
  };

  return (
    <View className="flex-1 bg-pine">
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
            <View className="px-6 pb-8 pt-4">
              <TouchableOpacity
                onPress={() => router.back()}
                activeOpacity={0.7}
                className="mb-4 h-9 w-9 items-center justify-center rounded-full border border-mustard/40"
              >
                <Ionicons name="chevron-back" size={18} color={"#D9A441"} />
              </TouchableOpacity>

              <View className="items-center px-2">
                <Text className="mb-4 text-xs font-semibold tracking-[4px] text-mustard">
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

                  <View className="h-16 w-16 items-center justify-center rounded-full border-2 border-mustard">
                    <Ionicons name="key-outline" size={24} color={"#FBF3E7"} />
                  </View>
                </View>

                <Text className="mt-6 text-center text-3xl font-extrabold text-cream">
                  Forgot your{"\n"}password?
                </Text>
                <Text className="mt-2 max-w-[280px] text-center text-[15px] text-cream/60">
                  No worries — happens to the best of us. We'll send you a code
                  to reset it.
                </Text>
              </View>
            </View>
          </SafeAreaView>

          {/* ---------- Cream sheet with the reset form ---------- */}
          <View className="flex-1 rounded-t-[32px] bg-cream px-8 pt-10">
            {/* Email / Phone tab switcher */}
            <View className="mb-6 flex-row rounded-xl bg-pine/[0.06] p-1">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setResetMethod("email")}
                className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-lg py-2.5 ${
                  resetMethod === "email" ? "bg-pine" : ""
                }`}
              >
                <Ionicons
                  name="mail-outline"
                  size={15}
                  color={resetMethod === "email" ? "#FBF3E7" : `#1F3D2B99`}
                />
                <Text
                  className={`text-[13px] font-semibold ${
                    resetMethod === "email" ? "text-cream" : "text-pine/60"
                  }`}
                >
                  Email
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setResetMethod("phone")}
                className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-lg py-2.5 ${
                  resetMethod === "phone" ? "bg-pine" : ""
                }`}
              >
                <Ionicons
                  name="call-outline"
                  size={15}
                  color={resetMethod === "phone" ? "#FBF3E7" : `#1F3D2B99`}
                />
                <Text
                  className={`text-[13px] font-semibold ${
                    resetMethod === "phone" ? "text-cream" : "text-pine/60"
                  }`}
                >
                  Phone
                </Text>
              </TouchableOpacity>
            </View>

            {/* Email or Phone field, depending on the selected tab */}
            {resetMethod === "email" ? (
              <>
                <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-pine/50">
                  Email
                </Text>
                <View className="mb-6 flex-row items-center rounded-xl border border-pine/15 bg-white px-4 py-3.5">
                  <Ionicons
                    name="mail-outline"
                    size={18}
                    color={"#1F3D2B"}
                    style={{ opacity: 0.5 }}
                  />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@email.com"
                    placeholderTextColor={`#1F3D2B55`}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    className="ml-3 flex-1 text-[15px] text-pine"
                  />
                </View>
              </>
            ) : (
              <>
                <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-pine/50">
                  Phone number
                </Text>
                <View className="mb-6 flex-row items-center rounded-xl border border-pine/15 bg-white px-4 py-3.5">
                  <Ionicons
                    name="call-outline"
                    size={18}
                    color={"#1F3D2B"}
                    style={{ opacity: 0.5 }}
                  />
                  <TextInput
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="+1 (555) 000-0000"
                    placeholderTextColor={`#1F3D2B55`}
                    keyboardType="phone-pad"
                    className="ml-3 flex-1 text-[15px] text-pine"
                  />
                </View>
              </>
            )}

            {/* The signature element: a rotated, engraved dog tag as the submit button */}
            <TouchableOpacity
              onPress={handleSendCode}
              activeOpacity={0.85}
              disabled={!isReady}
              className="mt-4 self-center"
              style={{
                transform: [{ rotate: "-2deg" }],
                opacity: isReady ? 1 : 0.4,
              }}
            >
              <View className="relative w-[280px] rounded-2xl bg-mustard px-6 py-5 shadow-lg">
                <View className="absolute -top-3 left-6 h-6 w-6 items-center justify-center rounded-full border-2 border-pine bg-cream">
                  <View className="h-2 w-2 rounded-full bg-pine" />
                </View>

                <View className="flex-row items-center justify-between pl-2">
                  <View>
                    <Text className="text-[11px] font-semibold tracking-widest text-pine/60">
                      RESET TAG
                    </Text>
                    <Text className="mt-0.5 text-lg font-extrabold text-pine">
                      Send Code
                    </Text>
                  </View>
                  <Ionicons
                    name="arrow-forward-circle"
                    size={30}
                    color={"#1F3D2B"}
                  />
                </View>
              </View>
            </TouchableOpacity>

            <SafeAreaView edges={["bottom"]}>
              <TouchableOpacity
                className="mb-6 mt-10 items-center"
                activeOpacity={0.6}
                onPress={() => router.back()}
              >
                <Text className="text-sm text-ink/60">
                  Remembered it?{" "}
                  <Text className="font-semibold text-clay">Log in</Text>
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
