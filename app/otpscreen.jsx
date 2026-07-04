import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
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
const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function OtpScreen() {
  const {
    contact = "",
    method = "email",
    purpose = "signup",
  } = useLocalSearchParams();

  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (secondsLeft === 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleChangeDigit = (value, index) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    const next = [...digits];
    next[index] = cleaned.slice(-1);
    setDigits(next);

    if (cleaned && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (secondsLeft > 0) return;
    // TODO: trigger real OTP resend
    setSecondsLeft(RESEND_SECONDS);
    setDigits(Array(CODE_LENGTH).fill(""));
    inputRefs.current[0]?.focus();
  };

  const handleVerify = () => {
    // TODO: verify code with backend
    if (purpose === "reset") {
      router.replace("/reset-password");
      return;
    }
    router.replace("/(tabs)");
  };

  const isComplete = digits.every((d) => d !== "");
  const destinationLabel =
    method === "phone" ? contact || "your phone" : contact || "your email";

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
                    <Ionicons
                      name={
                        method === "phone"
                          ? "chatbox-ellipses-outline"
                          : "mail-open-outline"
                      }
                      size={24}
                      color={"#FBF3E7"}
                    />
                  </View>
                </View>

                <Text className="mt-6 text-center text-3xl font-extrabold text-cream">
                  Verify it's you.
                </Text>
                <Text className="mt-2 max-w-[280px] text-center text-[15px] text-cream/60">
                  We sent a {CODE_LENGTH}-digit code to{" "}
                  <Text className="font-semibold text-cream/90">
                    {destinationLabel}
                  </Text>
                </Text>
              </View>
            </View>
          </SafeAreaView>

          {/* ---------- Cream sheet with the code entry ---------- */}
          <View className="flex-1 rounded-t-[32px] bg-cream px-8 pt-10">
            <Text className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-pine/50">
              Enter verification code
            </Text>

            <View className="mb-6 flex-row justify-center gap-2.5">
              {digits.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  value={digit}
                  onChangeText={(value) => handleChangeDigit(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  className={`h-14 w-11 rounded-xl border bg-white text-center text-xl font-bold text-pine ${
                    digit ? "border-mustard" : "border-pine/15"
                  }`}
                />
              ))}
            </View>

            <View className="mb-8 items-center">
              {secondsLeft > 0 ? (
                <Text className="text-xs text-pine/40">
                  Resend code in 0:{String(secondsLeft).padStart(2, "0")}
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResend} activeOpacity={0.6}>
                  <Text className="text-xs font-semibold text-clay">
                    Resend code
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* The signature element: a rotated, engraved dog tag as the submit button */}
            <TouchableOpacity
              onPress={handleVerify}
              activeOpacity={0.85}
              disabled={!isComplete}
              className="self-center"
              style={{
                transform: [{ rotate: "-2deg" }],
                opacity: isComplete ? 1 : 0.4,
              }}
            >
              <View className="relative w-[280px] rounded-2xl bg-mustard px-6 py-5 shadow-lg">
                <View className="absolute -top-3 left-6 h-6 w-6 items-center justify-center rounded-full border-2 border-pine bg-cream">
                  <View className="h-2 w-2 rounded-full bg-pine" />
                </View>

                <View className="flex-row items-center justify-between pl-2">
                  <View>
                    <Text className="text-[11px] font-semibold tracking-widest text-pine/60">
                      VERIFIED TAG
                    </Text>
                    <Text className="mt-0.5 text-lg font-extrabold text-pine">
                      Verify
                    </Text>
                  </View>
                  <Ionicons
                    name="checkmark-circle"
                    size={30}
                    color={"#1F3D2B"}
                  />
                </View>
              </View>
            </TouchableOpacity>

            <SafeAreaView edges={["bottom"]}>
              <TouchableOpacity
                className="mb-6 mt-8 items-center"
                activeOpacity={0.6}
                onPress={() => router.back()}
              >
                <Text className="text-sm text-ink/60">
                  Wrong {method === "phone" ? "number" : "email"}?{" "}
                  <Text className="font-semibold text-clay">Go back</Text>
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
