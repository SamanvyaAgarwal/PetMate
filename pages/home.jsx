import { IMAGE_BASE_URL } from "@/src/axios";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { useCallback, useEffect, useRef, useState } from "react";
import { Linking } from "react-native";
import {
  Animated,
  Dimensions,
  Easing,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";
import { getBanners, getMyPets } from "../src/authApi";

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

// TODO: replace with a real fetch — GET /banners (offers, announcements, etc.)

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

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const AnimatedPath = Animated.createAnimatedComponent(Path);

function PetLoveSection({ isDark }) {
  const bounce = useRef(new Animated.Value(0)).current;
  const tailWag = useRef(new Animated.Value(0)).current;
  const paw1 = useRef(new Animated.Value(0)).current;
  const paw2 = useRef(new Animated.Value(0)).current;
  const paw3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Illustration gently hops, like a happy little bounce
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounce, {
          toValue: -14,
          duration: 700,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(bounce, {
          toValue: 0,
          duration: 700,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Tail wags continuously, independent of the bounce
    Animated.loop(
      Animated.sequence([
        Animated.timing(tailWag, {
          toValue: 1,
          duration: 240,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(tailWag, {
          toValue: -1,
          duration: 240,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Trailing paw prints rise + fade, staggered
    const makePawLoop = (anim, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      );

    makePawLoop(paw1, 0).start();
    makePawLoop(paw2, 550).start();
    makePawLoop(paw3, 1100).start();
  }, []);

  const tailRotate = tailWag.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-22deg", "22deg"],
  });

  const pawStyle = (anim) => ({
    opacity: anim.interpolate({
      inputRange: [0, 0.2, 0.8, 1],
      outputRange: [0, 1, 1, 0],
    }),
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [14, -8],
        }),
      },
      {
        scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }),
      },
    ],
  });

  const lineColor = "#FBF3E7";

  return (
    <View
      style={{ height: SCREEN_HEIGHT * 0.55 }}
      className="mx-3 mt-6 overflow-hidden rounded-3xl bg-pine dark:bg-ink"
    >
      {/* Decorative soft blobs */}
      <View className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-mustard/10" />
      <View className="absolute -bottom-12 -right-8 h-56 w-56 rounded-full bg-cream/5" />
      <View className="absolute right-6 top-8 h-16 w-16 rounded-full bg-clay/10" />

      <View className="flex-1 items-center justify-center px-6">
        {/* Headline */}
        <Text className="text-center text-2xl font-extrabold leading-8 text-cream">
          Made by people who{"\n"}love their pets{"\n"}as much as you do
        </Text>

        {/* Floating paw prints trailing behind the illustration */}
        <View className="mt-5 flex-row items-end gap-8">
          <Animated.View style={pawStyle(paw1)}>
            <Ionicons name="paw" size={16} color="#D9A44177" />
          </Animated.View>
          <Animated.View style={pawStyle(paw2)}>
            <Ionicons name="paw" size={20} color="#D9A441AA" />
          </Animated.View>
          <Animated.View style={pawStyle(paw3)}>
            <Ionicons name="paw" size={16} color="#D9A44177" />
          </Animated.View>
        </View>

        {/* Bouncing original line-art hug illustration */}
        <Animated.View
          style={{ transform: [{ translateY: bounce }] }}
          className="mt-3"
        >
          <Svg width={190} height={200} viewBox="0 0 150 170">
            {/* Person body */}
            <Path
              d="M55 170 L55 120 Q55 95 80 95 Q105 95 105 120 L105 170"
              fill={lineColor}
              opacity={0.95}
            />
            {/* Person head */}
            <Circle
              cx="82"
              cy="72"
              r="22"
              fill="none"
              stroke={lineColor}
              strokeWidth={3}
            />

            {/* Dog body leaning into the hug */}
            <Path
              d="M20 168 Q15 120 35 90 Q45 70 70 75 Q85 80 82 100 Q80 120 60 130 Q45 138 40 168 Z"
              fill="none"
              stroke={lineColor}
              strokeWidth={3}
            />
            {/* Dog ear */}
            <Path d="M35 88 Q22 78 26 60 Q40 65 46 82 Z" fill={lineColor} />
            {/* Dog closed happy eye */}
            <Path
              d="M50 92 Q54 96 58 92"
              fill="none"
              stroke={lineColor}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            {/* Dog nose */}
            <Circle cx="38" cy="103" r="4" fill={lineColor} />

            {/* Wagging tail */}
            <AnimatedPath
              d="M22 130 Q8 120 6 100"
              fill="none"
              stroke={lineColor}
              strokeWidth={4}
              strokeLinecap="round"
              style={{
                transform: [
                  { translateX: 22 },
                  { translateY: 130 },
                  { rotate: tailRotate },
                  { translateX: -22 },
                  { translateY: -130 },
                ],
              }}
            />

            {/* Arms wrapping around the dog */}
            <Path
              d="M60 130 Q75 140 95 132"
              fill="none"
              stroke="#1F3D2B"
              strokeWidth={4}
              strokeLinecap="round"
            />
          </Svg>
        </Animated.View>

        {/* CTA */}
        <TouchableOpacity
          activeOpacity={0.85}
          className="mt-6 rounded-full bg-mustard px-7 py-3.5"
        >
          <Text className="text-xs font-extrabold uppercase tracking-wide text-pine">
            Explore More
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const [pets, setPets] = useState([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [banners, setBanners] = useState([]);

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const bannerRef = useRef(null);

  const loadPets = async () => {
    try {
      const response = await getMyPets();

      const petList = response.data?.data?.pets || [];

      console.log("Fetched Pets:", petList);

      setPets(
        petList.map((pet) => ({
          id: pet.pet_uid,
          name: pet.pet_name,
          avatar: pet.pet_image ? `${IMAGE_BASE_URL}${pet.pet_image}` : null,
          breed: pet.breed,
          pet_type: pet.pet_type,
          gender: pet.gender,
        })),
      );
    } catch (error) {
      console.log("Load Pets Error:", error.response?.data || error);
    }
  };
  const loadBanners = async () => {
    try {
      const response = await getBanners();

      setBanners(response.data.data.banners);
    } catch (error) {
      console.log(error.response?.data || error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      loadPets();
      loadBanners();
    }, []),
  );

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
    if (category.key === "ngo") {
      router.push("/nearby-ngos");
      return;
    }
    setSelectedCategory(category);
  };

  const handleSelectPet = (pet) => {
    setSelectedCategory(null);
    router.push({
      pathname: "/service-listing",
      params: { category: selectedCategory.key, petId: pet.id },
    });
  };
  const handleBannerPress = (banner) => {

    switch (banner.banner_type) {

      case "service":
        router.push(`/services/${banner.target}`);
        break;

      case "screen":
        router.push(`/${banner.target}`);
        break;

      case "external":
        Linking.openURL(banner.target);
        break;

      default:
        break;

    }

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
                  onPress={() =>
                    router.push({
                      pathname: "/pet-profile",
                      params: { petId: pet.id },
                    })
                  }
                  className={`items-center ${
                    index === pets.length - 1 ? "" : "mr-2"
                  } pt-1`}
                >
                  {pet.avatar ? (
                    <Image
                      source={{ uri: pet.avatar }}
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 32,
                      }}
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
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleBannerPress(item)}
                style={{
                  width: BANNER_WIDTH,
                  height: 180,
                  marginRight: index === banners.length - 1 ? 0 : BANNER_GAP,
                }}
                className="overflow-hidden rounded-2xl"
              >
                {console.log("Banner URL:", `${IMAGE_BASE_URL}${item.image}`)}
                <Image
                  source={{
                    uri: `${IMAGE_BASE_URL}${item.image}`,
                  }}
                  contentFit="cover"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  
                />

                <View className="absolute inset-0 justify-end bg-black/25 p-5">
                  <Text className="text-2xl font-bold text-white">
                    {item.title}
                  </Text>

                  <Text className="mt-1 text-white/80">
                    {item.subtitle}
                  </Text>
                </View>
              </TouchableOpacity>
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
        {/* ---------- Original animated pet-love illustration ---------- */}
        <PetLoveSection isDark={isDark} />
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
