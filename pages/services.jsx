import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getServices } from "../src/authApi";
import { useEffect, useState } from "react";

// TODO: replace `image` with a real backend-hosted photo URL — GET /categories/:key/services
// Using picsum.photos placeholder images for now (safe for dev use, not final assets)


const CATEGORY_META = {
  vet: {
    label: "Pet Vet",
    badge: "Trusted by 5000+ pet parents!",
    icon: "medkit",
  },
  grooming: {
    label: "Pet Grooming",
    badge: "Over 1000+ Grooming Sessions Delivered!",
    icon: "cut",
  },
  shop: {
    label: "Pet Shop",
    badge: "New arrivals every week!",
    icon: "storefront",
  },
  training: {
    label: "Pet Trainer",
    badge: "200+ pets trained this year!",
    icon: "ribbon",
  },
  funeral: {
    label: "Funeral Services",
    badge: "Caring for your companion, always",
    icon: "flower",
  },
  ngo: {
    label: "NGO",
    badge: "Together, we've helped 800+ pets!",
    icon: "people",
  },
};

export default function ServiceListingScreen() {
  const { category, petId } = useLocalSearchParams();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? "#FBF3E7" : "#1F3D2B";

  const meta = CATEGORY_META[category] || {
    label: "Services",
    badge: "Quality care for your pet",
    icon: "paw",
  };
  const [services, setServices] = useState([]);

  const loadServices = async () => {
    try {
      const categoryMap = {
        vet: "Veterinary",
        grooming: "Grooming",
        training: "Training",
        walking: "Walking",
        boarding: "Boarding",
      };

      const apiCategory = categoryMap[category];

      const response = await getServices(apiCategory);

      console.log("Services API:", response.data);

      setServices(response.data.data.services);
    } catch (error) {
      console.log(
        "Service Error:",
        error.response?.data || error
      );
    }
  };
  useEffect(() => {
    console.log("Service Screen Loaded");
    loadServices();
  }, []);

  // Was: navigated straight into /booking. Now routes into a vendors list for
  // the chosen service first — vendor selection is what actually kicks off
  // /booking (see handleSelectVendor in vendors.jsx).
  const handleSelectService = (service) => {
    router.push({
      pathname: "/vendors",
      params: {
        category,
        petId,
        service_uid: service.service_uid,
        serviceTitle: service.title,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-pine" edges={["top"]}>
      {/* Top bar */}
      <View className="relative flex-row items-center justify-between border-b border-fog-200 bg-cream px-4 py-3.5 dark:border-cream/10 dark:bg-pine">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="h-9 w-9 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={26} color={iconColor} />
        </TouchableOpacity>

        <Text className="text-[17px] font-semibold text-pine dark:text-cream">
          {meta.label}
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/home")}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="h-9 w-9 items-center justify-center"
        >
          <Ionicons name="home-outline" size={22} color={iconColor} />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 bg-fog-50 dark:bg-ink"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero banner */}
        <View className="relative h-52 justify-end overflow-hidden bg-pine dark:bg-ink">
          <Ionicons
            name={meta.icon}
            size={220}
            color="#FBF3E7"
            style={{
              position: "absolute",
              right: -40,
              top: -20,
              opacity: 0.12,
              transform: [{ rotate: "-8deg" }],
            }}
          />
          <View className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-mustard/15" />

          <View className="mx-5 mb-6 flex-row items-center gap-3 self-start rounded-2xl border border-mustard/40 bg-pine/80 px-4 py-3">
            <Text className="text-xl">⭐</Text>
            <Text className="max-w-[220px] text-[15px] font-semibold leading-5 text-cream">
              {meta.badge}
            </Text>
          </View>
        </View>

        {/* Preference list */}
        <View className="px-5 pt-6">
          <Text className="mb-4 text-xl font-extrabold text-pine dark:text-cream">
            Select your Preference
          </Text>

          <View className="gap-4">
            {services.map((service, index) => (
              <TouchableOpacity
                key={service.id}
                activeOpacity={0.8}
                onPress={() => handleSelectService(service)}
                className="flex-row items-center justify-between rounded-2xl border border-fog-200 bg-cream px-5 py-5 shadow-sm dark:border-cream/10 dark:bg-pine"
              >
                <View className="flex-1 pr-4">
                  <Text className="text-lg font-bold text-pine dark:text-cream">
                    {service.title}
                  </Text>
                  <Text className="mt-1.5 text-[13px] leading-[18px] text-ink/60 dark:text-cream/60">
                    {service.description}
                  </Text>
                </View>

                <View className="h-16 w-16 items-center justify-center rounded-full border-2 border-cream shadow-sm dark:border-ink">
                  <Image
                    source={{ uri: service.image }}
                    style={{ width: 64, height: 64, borderRadius: 32 }}
                    contentFit="cover"
                    transition={200}
                    placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {services.length === 0 && (
            <View className="items-center py-16">
              <Ionicons name="paw-outline" size={40} color={iconColor} />
              <Text className="mt-4 text-center text-pine/60 dark:text-cream/60">
                No services available for this category yet.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
