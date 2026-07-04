import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const slides = [
  {
    key: "1",
    icon: "paw",
    title: "Welcome to PawTrail",
    description:
      "One trusted place to book walkers, groomers, trainers, sitters and vets for your dog.",
  },
  {
    key: "2",
    icon: "walk",
    title: "Everything Your Dog Needs",
    description:
      "Book walks, daycare, grooming sessions and home visits from verified professionals near you.",
  },
  {
    key: "3",
    icon: "shield-checkmark",
    title: "Trusted Dog Care",
    description:
      "Every caregiver is verified so your best friend always stays in safe and caring hands.",
  },
  {
    key: "4",
    icon: "heart",
    title: "Join The Pack",
    description:
      "Create your account and start giving your dog the love, care and adventures they deserve.",
  },
];

export default function HomeScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  const isLastSlide = activeIndex === slides.length - 1;

  const handleScroll = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const handleNext = () => {
    if (isLastSlide) {
      router.replace("/login");
      return;
    }

    flatListRef.current?.scrollToIndex({
      index: activeIndex + 1,
      animated: true,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-pine">
      {/* Brand */}
      <View className="items-center pt-8">
        <Text className="text-xs font-bold tracking-[5px] text-mustard">
          PAWTRAIL
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        onMomentumScrollEnd={handleScroll}
        renderItem={({ item }) => (
          <View
            style={{ width }}
            className="flex-1 items-center justify-center px-8"
          >
            {/* Hero Circle */}
            <View className="h-64 w-64 items-center justify-center rounded-full border-4 border-mustard bg-cream">
              <View className="h-52 w-52 items-center justify-center rounded-full border border-mustard/40">
                <Ionicons name={item.icon} size={95} color={"#1F3D2B"} />
              </View>
            </View>

            <Text className="mt-12 text-center text-4xl font-extrabold text-cream">
              {item.title}
            </Text>

            <Text className="mt-5 px-4 text-center text-[16px] leading-7 text-cream/70">
              {item.description}
            </Text>
          </View>
        )}
      />

      {/* Dots */}
      <View className="mb-8 flex-row justify-center">
        {slides.map((_, index) => (
          <View
            key={index}
            className={`mx-1 h-2 rounded-full ${
              index === activeIndex ? "w-8 bg-mustard" : "w-2 bg-mustard/30"
            }`}
          />
        ))}
      </View>

      {/* Button */}
      <View className="px-8 pb-10">
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.9}
          style={{ transform: [{ rotate: "-2deg" }] }}
        >
          <View className="relative rounded-2xl bg-mustard px-6 py-5">
            {/* Dog tag hole */}
            <View className="absolute -top-3 left-8 h-6 w-6 items-center justify-center rounded-full border-2 border-pine bg-cream">
              <View className="h-2 w-2 rounded-full bg-pine" />
            </View>

            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-[11px] font-bold tracking-[2px] text-pine/60">
                  PAWTRAIL
                </Text>

                <Text className="text-xl font-extrabold text-pine">
                  {isLastSlide ? "Get Started" : "Next"}
                </Text>
              </View>

              <Ionicons
                name="arrow-forward-circle"
                size={34}
                color={"#1F3D2B"}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
