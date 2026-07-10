import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// TODO: replace with a real fetch — GET /ngos/nearby?lat=...&lng=...
const DEMO_NGOS = [
  {
    id: "1",
    name: "Paws & Hearts Rescue",
    distance: "1.2 km away",
    description: "Shelter and adoption drives for abandoned dogs and cats",
    tags: ["Adoption", "Shelter"],
    icon: "home",
  },
  {
    id: "2",
    name: "Second Chance Animal Trust",
    distance: "2.8 km away",
    description: "Rescue, rehabilitation, and rehoming of injured strays",
    tags: ["Rescue", "Medical"],
    icon: "medkit",
  },
  {
    id: "3",
    name: "Furry Friends Foundation",
    distance: "4.1 km away",
    description: "Community feeding programs and sterilization drives",
    tags: ["Feeding", "Sterilization"],
    icon: "restaurant",
  },
  {
    id: "4",
    name: "Whiskers Welfare Society",
    distance: "5.6 km away",
    description: "Volunteer-run cat rescue and foster care network",
    tags: ["Foster Care", "Cats"],
    icon: "heart",
  },
];

const TINTS = ["bg-mustard/30", "bg-clay/20", "bg-pine/15"];

export default function NearbyNgosScreen() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? "#FBF3E7" : "#1F3D2B";

  const [ngos, setNgos] = useState(DEMO_NGOS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: fetch real nearby NGOs here, e.g.:
    // setLoading(true);
    // fetchNearbyNgos({ lat, lng }).then(setNgos).finally(() => setLoading(false));
  }, []);

  const handleSelectNgo = (ngo) => {
    // TODO: navigate to an NGO detail page, e.g. router.push({ pathname: "/ngo-detail", params: { ngoId: ngo.id } })
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
          Nearby NGOs
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/(tabs)")}
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
        <View className="relative h-44 justify-end overflow-hidden bg-pine dark:bg-ink">
          <Ionicons
            name="people"
            size={200}
            color="#FBF3E7"
            style={{
              position: "absolute",
              right: -30,
              top: -10,
              opacity: 0.12,
              transform: [{ rotate: "-8deg" }],
            }}
          />
          <View className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-mustard/15" />

          <View className="mx-5 mb-6 flex-row items-center gap-3 self-start rounded-2xl border border-mustard/40 bg-pine/80 px-4 py-3">
            <Text className="text-xl">🐾</Text>
            <Text className="max-w-[240px] text-[15px] font-semibold leading-5 text-cream">
              Helping animals in need, together
            </Text>
          </View>
        </View>

        <View className="px-5 pt-6">
          <Text className="mb-4 text-xl font-extrabold text-pine dark:text-cream">
            NGOs Near You
          </Text>

          {loading ? (
            <Text className="py-10 text-center text-pine/50 dark:text-cream/50">
              Finding NGOs near you…
            </Text>
          ) : ngos.length === 0 ? (
            <View className="items-center py-16">
              <Ionicons name="location-outline" size={40} color={iconColor} />
              <Text className="mt-4 text-center text-pine/60 dark:text-cream/60">
                No NGOs found near your location yet.
              </Text>
            </View>
          ) : (
            <View className="gap-4">
              {ngos.map((ngo, index) => (
                <TouchableOpacity
                  key={ngo.id}
                  activeOpacity={0.8}
                  onPress={() => handleSelectNgo(ngo)}
                  className="flex-row items-start gap-4 rounded-2xl border border-fog-200 bg-cream px-5 py-5 shadow-sm dark:border-cream/10 dark:bg-pine"
                >
                  <View
                    className={`h-14 w-14 items-center justify-center rounded-full border-2 border-cream shadow-sm dark:border-ink ${TINTS[index % TINTS.length]}`}
                  >
                    <Ionicons name={ngo.icon} size={24} color="#1F3D2B" />
                  </View>

                  <View className="flex-1">
                    <View className="flex-row items-center justify-between">
                      <Text
                        className="flex-1 pr-2 text-base font-bold text-pine dark:text-cream"
                        numberOfLines={1}
                      >
                        {ngo.name}
                      </Text>
                      <Text className="text-xs font-semibold text-clay">
                        {ngo.distance}
                      </Text>
                    </View>

                    <Text className="mt-1.5 text-[13px] leading-[18px] text-ink/60 dark:text-cream/60">
                      {ngo.description}
                    </Text>

                    <View className="mt-3 flex-row flex-wrap gap-2">
                      {ngo.tags.map((tag) => (
                        <View
                          key={tag}
                          className="rounded-full bg-mustard/20 px-2.5 py-1"
                        >
                          <Text className="text-[11px] font-semibold text-clay">
                            {tag}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
