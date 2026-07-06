import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react"; import { sendLoginOTP } from "../src/authApi";
import { Alert } from "react-native";

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

export default function LoginScreen() {
  const [loginMethod, setLoginMethod] = useState("email"); // "email" | "phone"
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  // const [password, setPassword] = useState("");
  // const [showPassword, setShowPassword] = useState(false);

  const isReady =
    loginMethod === "email" ? email.trim().length > 0 : phone.trim().length > 0;

  const handleLogin = async () => {

    try {

      const response = await sendLoginOTP({
        email,
      });

      Alert.alert("Success", response.data.message);

      router.push({
        pathname: "/otpscreen",
        params: {
          contact: email,
          method: "email",
          type: "login",
        },
      });

    } catch (error) {

      Alert.alert(
        "Error",
        error?.response?.data?.message || "Something went wrong"
      );

    }

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
            <View className="items-center px-8 pb-8 pt-6">
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
                  <Ionicons name="paw" size={26} color={"#FBF3E7"} />
                </View>
              </View>

              <Text className="mt-6 text-center text-3xl font-extrabold text-cream">
                Welcome back.
              </Text>
              <Text className="mt-2 text-center text-[15px] text-cream/60">
                Log in to keep the tails wagging.
              </Text>
            </View>
          </SafeAreaView>

          {/* ---------- Cream sheet with the login form ---------- */}
          <View className="flex-1 rounded-t-[32px] bg-cream px-8 pt-8">
            {/* Email / Phone tab switcher */}
            <View className="mb-6 flex-row rounded-xl bg-pine/[0.06] p-1">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setLoginMethod("email")}
                className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-lg py-2.5 ${
                  loginMethod === "email" ? "bg-pine" : ""
                }`}
              >
                <Ionicons
                  name="mail-outline"
                  size={15}
                  color={loginMethod === "email" ? "#FBF3E7" : `#1F3D2B99`}
                />
                <Text
                  className={`text-[13px] font-semibold ${
                    loginMethod === "email" ? "text-cream" : "text-pine/60"
                  }`}
                >
                  Email
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setLoginMethod("phone")}
                className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-lg py-2.5 ${
                  loginMethod === "phone" ? "bg-pine" : ""
                }`}
              >
                <Ionicons
                  name="call-outline"
                  size={15}
                  color={loginMethod === "phone" ? "#FBF3E7" : `#1F3D2B99`}
                />
                <Text
                  className={`text-[13px] font-semibold ${
                    loginMethod === "phone" ? "text-cream" : "text-pine/60"
                  }`}
                >
                  Phone
                </Text>
              </TouchableOpacity>
            </View>

            {/* Email or Phone field, depending on the selected tab */}
            {loginMethod === "email" ? (
              <>
                <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-pine/50">
                  Email
                </Text>
                <View className="mb-5 flex-row items-center rounded-xl border border-pine/15 bg-white px-4 py-3.5">
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
                <View className="mb-5 flex-row items-center rounded-xl border border-pine/15 bg-white px-4 py-3.5">
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

            {/* Password field */}
            {/* <Text className="mb-2 text-xs font-semibold uppercase tracking-widest text-pine/50">
              Password
            </Text>
            <View className="mb-2 flex-row items-center rounded-xl border border-pine/15 bg-white px-4 py-3.5">
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={"#1F3D2B"}
                style={{ opacity: 0.5 }}
              />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={`#1F3D2B55`}
                secureTextEntry={!showPassword}
                className="ml-3 flex-1 text-[15px] text-pine"
              />
              <TouchableOpacity onPress={() => setShowPassword((v) => !v)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color={"#1F3D2B"}
                  style={{ opacity: 0.5 }}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              className="mb-6 self-end"
              activeOpacity={0.6}
              onPress={() => router.push("/forgot-password")}
            >
              <Text className="text-xs font-semibold text-clay">
                Forgot password?
              </Text>
            </TouchableOpacity> */}

            {/* The signature element: a rotated, engraved dog tag as the submit button */}
            <TouchableOpacity
              onPress={handleLogin}
              activeOpacity={0.85}
              className="self-center"
              disabled={!isReady}
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
                      MEMBER TAG
                    </Text>
                    <Text className="mt-0.5 text-lg font-extrabold text-pine">
                      Log In
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

            {/* Divider */}
            <View className="my-8 flex-row items-center">
              <View className="h-px flex-1 bg-pine/10" />
              <Text className="mx-3 text-xs text-pine/40">
                or continue with
              </Text>
              <View className="h-px flex-1 bg-pine/10" />
            </View>

            {/* Social login */}
            <View className="mb-8 flex-row justify-center gap-4">
              <TouchableOpacity
                activeOpacity={0.7}
                className="h-12 w-12 items-center justify-center rounded-full border border-pine/15 bg-white"
              >
                <Ionicons name="logo-google" size={20} color={"#1F3D2B"} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                className="h-12 w-12 items-center justify-center rounded-full border border-pine/15 bg-white"
              >
                <Ionicons name="logo-apple" size={20} color={"#1F3D2B"} />
              </TouchableOpacity>
            </View>

            <SafeAreaView edges={["bottom"]}>
              <TouchableOpacity
                className="mb-6 items-center"
                activeOpacity={0.6}
                onPress={() => router.push("/sign-up")}
              >
                <Text className="text-sm text-ink/60">
                  New here?{" "}
                  <Text className="font-semibold text-clay">
                    Create an account
                  </Text>
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
