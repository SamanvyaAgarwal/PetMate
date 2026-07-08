import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/header";

const { width } = Dimensions.get("window");
const SCREEN_PADDING = 16; // matches px-4
const BANNER_GAP = 12;
const BANNER_WIDTH = width - SCREEN_PADDING * 2;

const GRID_GAP = 12;
const GRID_COLUMNS = 3;
const CARD_WIDTH =
  (width - SCREEN_PADDING * 2 - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

// TODO: replace with a real fetch — GET /me/pets, populated at login
const MOCK_PETS = [
  { id: "1", name: "Bruno", breed: "Labrador", avatar: null },
  { id: "2", name: "Milo", breed: "Beagle", avatar: null },
];

// TODO: replace with a real fetch — GET /banners (offers, announcements, etc.)
const MOCK_BANNERS = [
  {
    id: "1",
    title: "20% off Grooming",
    subtitle: "This week only — book before Sunday",
    cta: "Book Grooming",
    icon: "cut",
    tint: "bg-mustard",
  },
  {
    id: "2",
    title: "Home Vet Visits",
    subtitle: "Now available near you",
    cta: "Book a Visit",
    icon: "medkit",
    tint: "bg-clay",
  },
  {
    id: "3",
    title: "Refer a friend",
    subtitle: "You both get $10 credit",
    cta: "Invite Now",
    icon: "gift",
    tint: "bg-pine",
  },
];

// TODO: consider fetching this list too, if categories can change server-side
const CATEGORIES = [
  { key: "vet", label: "Pet Vet", icon: "medkit-outline" },
  { key: "grooming", label: "Grooming", icon: "cut-outline" },
  { key: "shop", label: "Pet Shop", icon: "storefront-outline" },
  { key: "training", label: "Pet Trainer", icon: "ribbon-outline" },
  { key: "funeral", label: "Funeral", icon: "flower-outline" },
  { key: "ngo", label: "NGO", icon: "people-outline" },
];

// Rotates behind each category icon so the grid reads with more visual variety,
// echoing a multi-color card style without needing custom illustrations
const CATEGORY_TINTS = ["bg-mustard/20", "bg-clay/15", "bg-pine/10"];

export default function HomeScreen() {
  const [pets, setPets] = useState(MOCK_PETS);
  const [banners, setBanners] = useState(MOCK_BANNERS);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const bannerRef = useRef(null);

  useEffect(() => {
    // TODO: fetch real pets + banners here, e.g.:
    // fetchPets().then(setPets);
    // fetchBanners().then(setBanners);
  }, []);

  // Auto-advance the banner carousel every 3.5s
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setBannerIndex((prev) => {
        const next = (prev + 1) % banners.length;
        bannerRef.current?.scrollToOffset({
          offset: next * (BANNER_WIDTH + BANNER_GAP),
          animated: true,
        });
        return next;
      });
    }, 3500);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handleBannerScroll = (e) => {
    const index = Math.round(
      e.nativeEvent.contentOffset.x / (BANNER_WIDTH + BANNER_GAP),
    );
    setBannerIndex(index);
  };

  const handleAddPet = () => {
    router.push("/addPet");
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

  const handleSelectPet = (pet) => {
    setSelectedCategory(null);
    router.push({
      pathname: "/service-listing",
      params: { category: selectedCategory.key, petId: pet.id },
    });
  };

  return (
    <View className="flex-1 bg-cream dark:bg-pine">
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* ---------- My Pets ---------- */}
        <View className="mt-8 px-4">
          <Text className="mb-3 text-lg font-extrabold text-pine dark:text-cream">
            My Pets
          </Text>

          <View className="rounded-2xl border border-pine/10 bg-white px-4 py-5 shadow-sm dark:border-cream/10 dark:bg-ink">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TouchableOpacity
                onPress={handleAddPet}
                activeOpacity={0.7}
                className="mr-2.5 items-center"
              >
                <View className="h-16 w-16 items-center justify-center rounded-full bg-mustard/25">
                  <View className="h-[52px] w-[52px] items-center justify-center rounded-full bg-mustard">
                    <Ionicons name="add" size={26} color="#1F3D2B" />
                  </View>
                </View>
                <Text className="mt-2.5 text-xs font-semibold text-pine/60 dark:text-cream/60">
                  Add Pet
                </Text>
              </TouchableOpacity>

              {pets.map((pet, index) => (
                <TouchableOpacity
                  key={pet.id}
                  activeOpacity={0.7}
                  className={`items-center ${
                    index === pets.length - 1 ? "" : "mr-2"
                  }`}
                >
                  {pet.avatar ? (
                    <Image
                      source={{ uri: pet.avatar }}
                      style={{ width: 64, height: 64, borderRadius: 32 }}
                    />
                  ) : (
                    <View className="h-16 w-16 items-center justify-center rounded-full border-2 border-mustard bg-cream shadow-sm dark:bg-pine">
                      <Ionicons
                        name="paw"
                        size={24}
                        color={isDark ? "#FBF3E7" : "#1F3D2B"}
                      />
                    </View>
                  )}
                  <Text
                    className="mt-2.5 max-w-[70px] text-center text-xs font-semibold text-pine dark:text-cream"
                    numberOfLines={1}
                  >
                    {pet.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* ---------- Auto-sliding banners ---------- */}
        <View className="mt-8">
          <FlatList
            ref={bannerRef}
            data={banners}
            keyExtractor={(item) => item.id}
            horizontal
            snapToInterval={BANNER_WIDTH + BANNER_GAP}
            decelerationRate="fast"
            snapToAlignment="start"
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleBannerScroll}
            contentContainerStyle={{ paddingHorizontal: SCREEN_PADDING }}
            renderItem={({ item, index }) => (
              <View
                style={{
                  width: BANNER_WIDTH,
                  height: 176,
                  marginRight: index === banners.length - 1 ? 0 : BANNER_GAP,
                }}
                className={`justify-between overflow-hidden rounded-2xl ${item.tint} px-6 py-5 shadow-md`}
              >
                {/* Decorative oversized watermark icon */}
                <Ionicons
                  name={item.icon}
                  size={128}
                  color="#FBF3E7"
                  style={{
                    position: "absolute",
                    right: -24,
                    bottom: -24,
                    opacity: 0.15,
                    transform: [{ rotate: "-12deg" }],
                  }}
                />

                <View>
                  <Text className="text-2xl font-extrabold leading-7 text-cream">
                    {item.title}
                  </Text>
                  <Text className="mt-2 text-[15px] leading-5 text-cream/75">
                    {item.subtitle}
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  className="self-start rounded-full bg-cream px-5 py-2.5"
                >
                  <Text className="text-center text-xs font-extrabold uppercase tracking-wide text-pine">
                    {item.cta}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />

          <View className="mt-3 flex-row items-center justify-center gap-1.5">
            {banners.map((_, index) => (
              <View
                key={index}
                className={`h-1.5 rounded-full ${
                  index === bannerIndex
                    ? "w-5 bg-mustard"
                    : "w-1.5 bg-pine/20 dark:bg-cream/20"
                }`}
              />
            ))}
          </View>
        </View>

        {/* ---------- Services grid ---------- */}
        <View className="mt-8 px-4">
          <Text className="mb-3 text-lg font-extrabold text-pine dark:text-cream">
            Our Pet Care Services
          </Text>

          <View className="flex-row flex-wrap justify-between">
            {CATEGORIES.map((category, index) => {
              const isLastInRow = index % GRID_COLUMNS === GRID_COLUMNS - 1;
              return (
                <TouchableOpacity
                  key={category.key}
                  activeOpacity={0.75}
                  onPress={() => handleCategoryPress(category)}
                  style={{
                    width: CARD_WIDTH,
                    marginRight: isLastInRow ? 0 : GRID_GAP,
                    marginBottom: GRID_GAP,
                  }}
                  className="items-center rounded-2xl border border-pine/10 bg-white py-5 shadow-sm dark:border-cream/10 dark:bg-ink"
                >
                  <View
                    className={`h-14 w-14 items-center justify-center rounded-full ${
                      CATEGORY_TINTS[index % CATEGORY_TINTS.length]
                    }`}
                  >
                    <Ionicons
                      name={category.icon}
                      size={26}
                      color={isDark ? "#FBF3E7" : "#1F3D2B"}
                    />
                  </View>
                  <Text
                    className="mt-2.5 text-center text-xs font-semibold text-pine dark:text-cream"
                    numberOfLines={2}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* ---------- Select-pet modal ---------- */}
      <Modal
        visible={!!selectedCategory}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedCategory(null)}
      >
        <View className="flex-1 bg-pine/40">
          {/* Backdrop */}
          <Pressable
            className="absolute inset-0"
            onPress={() => setSelectedCategory(null)}
          />

          {/* Bottom Sheet */}
          <View
            className="mt-auto rounded-t-[30px] bg-cream shadow-lg dark:bg-ink"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -6 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 20,
            }}
          >
            <SafeAreaView edges={["bottom"]}>
              {/* Handle */}
              <View className="items-center py-3">
                <View className="h-1.5 w-12 rounded-full bg-fog-200 dark:bg-cream/20" />
              </View>

              <View className="px-6 pb-6">
                <View className="mb-5 flex-row items-center justify-between">
                  <Text className="text-xl font-bold text-pine dark:text-cream">
                    Select your pet
                  </Text>

                  <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                    <Ionicons
                      name="close"
                      size={22}
                      color={isDark ? "#FBF3E7" : "#1F3D2B"}
                    />
                  </TouchableOpacity>
                </View>

                {selectedCategory && (
                  <Text className="mb-5 text-sm text-pine/60 dark:text-cream/60">
                    Booking{" "}
                    <Text className="font-semibold text-pine dark:text-cream">
                      {selectedCategory.label}
                    </Text>{" "}
                    for:
                  </Text>
                )}

                {pets.length === 0 ? (
                  <View className="items-center py-10">
                    <Ionicons
                      name="paw-outline"
                      size={40}
                      color={isDark ? "#FBF3E7" : "#1F3D2B"}
                    />

                    <Text className="mt-4 text-pine/60 dark:text-cream/60">
                      You haven't added a pet yet.
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        setSelectedCategory(null);
                        handleAddPet();
                      }}
                      className="mt-6"
                    >
                      <View className="h-16 w-16 items-center justify-center rounded-full bg-mustard/25">
                        <View className="h-[52px] w-[52px] items-center justify-center rounded-full bg-mustard">
                          <Ionicons name="add" size={26} color="#1F3D2B" />
                        </View>
                      </View>
                      <Text className="mt-2.5 text-center text-xs font-semibold text-pine/60 dark:text-cream/60">
                        Add Pet
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View className="mt-2.5 flex-row justify-around">
                    {pets.map((pet) => (
                      <TouchableOpacity
                        key={pet.id}
                        onPress={() => handleSelectPet(pet)}
                        className="items-center"
                      >
                        {pet.avatar ? (
                          <Image
                            source={{ uri: pet.avatar }}
                            style={{ width: 70, height: 70, borderRadius: 35 }}
                          />
                        ) : (
                          <View className="h-[70px] w-[70px] items-center justify-center rounded-full border-2 border-mustard bg-cream dark:bg-pine">
                            <Ionicons
                              name="paw"
                              size={26}
                              color={isDark ? "#FBF3E7" : "#1F3D2B"}
                            />
                          </View>
                        )}

                        <Text className="mt-2 font-semibold text-pine dark:text-cream">
                          {pet.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </SafeAreaView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
