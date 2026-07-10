import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// TODO: replace `image` with a real backend-hosted photo URL — GET /categories/:key/services
// Using picsum.photos placeholder images for now (safe for dev use, not final assets)
const DEMO_SERVICES = {
  vet: [
    {
      id: "1",
      title: "General Checkup",
      description: "Routine health checkup to keep your pet in top shape",
      icon: "medkit",
      image: "https://picsum.photos/seed/vet-checkup/200/200",
    },
    {
      id: "2",
      title: "Vaccination",
      description: "Core and booster vaccines administered by licensed vets",
      icon: "shield-checkmark",
      image: "https://picsum.photos/seed/vet-vaccine/200/200",
    },
    {
      id: "3",
      title: "Emergency Visit",
      description: "Urgent care for sudden illness or injury",
      icon: "alert-circle",
      image: "https://picsum.photos/seed/vet-emergency/200/200",
    },
  ],
  grooming: [
    {
      id: "1",
      title: "Bath & Brush",
      description: "Gentle bathing and brushing to keep your pet clean",
      icon: "water",
      image: "https://picsum.photos/seed/groom-bath/200/200",
    },
    {
      id: "2",
      title: "Full Grooming",
      description: "Complete grooming including bath, haircut, and styling",
      icon: "cut",
      image: "https://picsum.photos/seed/groom-full/200/200",
    },
    {
      id: "3",
      title: "Hair Cutting",
      description: "Professional hair trimming for your pet",
      icon: "content-cut",
      image: "https://picsum.photos/seed/groom-cut/200/200",
    },
    {
      id: "4",
      title: "Nail Trimming",
      description: "Safe and precise nail care for comfort and hygiene",
      icon: "paw",
      image: "https://picsum.photos/seed/groom-nail/200/200",
    },
  ],
  shop: [
    {
      id: "1",
      title: "Food & Treats",
      description: "Premium nutrition and tasty treats for every pet",
      icon: "restaurant",
      image: "https://picsum.photos/seed/shop-food/200/200",
    },
    {
      id: "2",
      title: "Toys & Accessories",
      description: "Fun toys, leashes, collars and more",
      icon: "basketball",
      image: "https://picsum.photos/seed/shop-toys/200/200",
    },
    {
      id: "3",
      title: "Bedding & Comfort",
      description: "Cozy beds and blankets for a good night's sleep",
      icon: "bed",
      image: "https://picsum.photos/seed/shop-bed/200/200",
    },
  ],
  training: [
    {
      id: "1",
      title: "Basic Obedience",
      description: "Sit, stay, and come — the essentials every pet needs",
      icon: "school",
      image: "https://picsum.photos/seed/train-obedience/200/200",
    },
    {
      id: "2",
      title: "Behavior Correction",
      description: "Address barking, chewing, and other habits",
      icon: "construct",
      image: "https://picsum.photos/seed/train-behavior/200/200",
    },
    {
      id: "3",
      title: "Puppy Training",
      description: "Early socialization and foundational training",
      icon: "happy",
      image: "https://picsum.photos/seed/train-puppy/200/200",
    },
  ],
  funeral: [
    {
      id: "1",
      title: "Cremation Services",
      description: "Respectful and dignified cremation for your companion",
      icon: "flame",
      image: "https://picsum.photos/seed/funeral-cremation/200/200",
    },
    {
      id: "2",
      title: "Memorial Keepsakes",
      description: "Custom keepsakes to remember your pet by",
      icon: "flower",
      image: "https://picsum.photos/seed/funeral-keepsake/200/200",
    },
    {
      id: "3",
      title: "Home Pickup",
      description: "Compassionate pickup service, available 24/7",
      icon: "car",
      image: "https://picsum.photos/seed/funeral-pickup/200/200",
    },
  ],
  ngo: [
    {
      id: "1",
      title: "Adoption Drives",
      description: "Find loving homes for pets in need",
      icon: "home",
      image: "https://picsum.photos/seed/ngo-adoption/200/200",
    },
    {
      id: "2",
      title: "Donation Programs",
      description: "Support shelters and rescue operations",
      icon: "heart",
      image: "https://picsum.photos/seed/ngo-donation/200/200",
    },
    {
      id: "3",
      title: "Volunteer Opportunities",
      description: "Give your time to help animals in your community",
      icon: "people",
      image: "https://picsum.photos/seed/ngo-volunteer/200/200",
    },
  ],
};

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
  const services = DEMO_SERVICES[category] || [];

  const handleSelectService = (service) => {
    // TODO: navigate to booking flow with { category, petId, serviceId: service.id }
    router.push({
      pathname: "/booking",
      params: { category, petId, serviceId: service.id },
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
