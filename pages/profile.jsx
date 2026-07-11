import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// TODO: replace with real logged-in user data — GET /me
// Shape mirrors the `users` table columns
const MOCK_USER = {
  name: "Sam Gdhdh",
  login_method: "phone", // enum('email','phone')
  email: "",
  phone: "9181074472",
  profile_image: null,
  address: "",
  city: "",
  state: "",
  district: "",
  country: "",
  pincode: "",
};

export default function ProfileScreen() {
  const [user] = useState(MOCK_USER);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? "#FBF3E7" : "#1F3D2B";

  const isPhoneUser = user.login_method === "phone";
  const contactLabel = isPhoneUser ? "Phone Number" : "Email";
  const contactValue = isPhoneUser ? user.phone : user.email;
  const contactIcon = isPhoneUser ? "call-outline" : "mail-outline";

  // All address fields always shown — empty ones display a placeholder dash
  const addressFields = [
    { icon: "home-outline", label: "Address", value: user.address },
    { icon: "business-outline", label: "City", value: user.city },
    { icon: "map-outline", label: "State", value: user.state },
    { icon: "location-outline", label: "District", value: user.district },
    { icon: "earth-outline", label: "Country", value: user.country },
    { icon: "mail-open-outline", label: "Pincode", value: user.pincode },
  ];

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
          My Profile
        </Text>
      </View>

      <ScrollView
        className="flex-1 bg-fog-50 dark:bg-ink"
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar block */}
        <View className="items-center pb-7 pt-9">
          <View className="relative">
            <View className="h-32 w-32 items-center justify-center rounded-full bg-cream p-2 dark:bg-ink">
              <View className="h-full w-full items-center justify-center rounded-full bg-fog-100 dark:bg-pine">
                {user.profile_image ? (
                  <Image
                    source={{ uri: user.profile_image }}
                    style={{ width: 108, height: 108, borderRadius: 54 }}
                  />
                ) : (
                  <Ionicons
                    name="person"
                    size={62}
                    color={isDark ? "#FBF3E799" : "#C9C6C0"}
                  />
                )}
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/edit-page")}
              className="absolute -right-1.5 -top-1.5 h-10 w-10 items-center justify-center rounded-full bg-mustard shadow-sm"
            >
              <Ionicons name="create-outline" size={18} color="#1F3D2B" />
            </TouchableOpacity>
          </View>

          <Text className="mt-[18px] text-[22px] font-bold text-pine dark:text-cream">
            {user.name}
          </Text>
        </View>

        {/* Personal info */}
        <View className="mt-2 px-5">
          <Text className="mb-2 ml-1 text-[13px] font-bold tracking-wide text-ink/50 dark:text-cream/50">
            PERSONAL INFO
          </Text>

          <View className="overflow-hidden rounded-[18px] bg-cream shadow-sm dark:bg-pine">
            <InfoRow
              icon="person-outline"
              label="Full Name"
              value={user.name}
            />
            <View className="ml-16 h-px bg-fog-200 dark:bg-cream/10" />
            <InfoRow
              icon={contactIcon}
              label={contactLabel}
              value={contactValue}
            />
          </View>
        </View>

        {/* Address — always rendered, empty fields show a dash */}
        <View className="mt-6 px-5">
          <Text className="mb-2 ml-1 text-[13px] font-bold tracking-wide text-ink/50 dark:text-cream/50">
            ADDRESS
          </Text>

          <View className="overflow-hidden rounded-[18px] bg-cream shadow-sm dark:bg-pine">
            {addressFields.map((field, index) => (
              <View key={field.label}>
                <InfoRow
                  icon={field.icon}
                  label={field.label}
                  value={field.value}
                />
                {index !== addressFields.length - 1 && (
                  <View className="ml-16 h-px bg-fog-200 dark:bg-cream/10" />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* My Pets */}
        <View className="mt-6 px-5">
          <Text className="mb-2 ml-1 text-[13px] font-bold tracking-wide text-ink/50 dark:text-cream/50">
            MY PETS
          </Text>

          <View className="mt-1 flex-row flex-wrap gap-3">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/addPet")}
              className="w-40 overflow-hidden rounded-[18px] border border-fog-200 bg-cream dark:border-cream/10 dark:bg-pine"
            >
              <View className="h-[130px] items-center justify-center bg-fog-50 dark:bg-ink">
                <View className="h-16 w-16 items-center justify-center rounded-full bg-mustard/25">
                  <View className="h-[52px] w-[52px] items-center justify-center rounded-full bg-mustard">
                    <Ionicons name="add" size={26} color="#1F3D2B" />
                  </View>
                </View>
              </View>
              <View className="px-3.5 pb-3.5 pt-2.5">
                <Text className="text-base font-bold text-pine dark:text-cream">
                  Add Pet
                </Text>
                <Text className="mt-0.5 text-[13px] text-ink/50 dark:text-cream/50">
                  Tap to add
                </Text>
                <View className="mt-2 self-start rounded-full bg-mustard/20 px-2.5 py-1">
                  <Text className="text-[11px] font-semibold text-clay">
                    New
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ icon, label, value }) {
  const displayValue = value && value.trim() !== "" ? value : "—";
  const isEmpty = displayValue === "—";

  return (
    <View className="flex-row items-center gap-3 px-4 py-3.5">
      <View className="h-10 w-10 items-center justify-center rounded-xl bg-mustard/15">
        <Ionicons name={icon} size={17} color="#B5533C" />
      </View>
      <View className="flex-1">
        <Text className="text-[13px] text-ink/50 dark:text-cream/50">
          {label}
        </Text>
        <Text
          className={`mt-0.5 text-base font-semibold ${
            isEmpty
              ? "text-pine/30 dark:text-cream/30"
              : "text-pine dark:text-cream"
          }`}
        >
          {displayValue}
        </Text>
      </View>
    </View>
  );
}
