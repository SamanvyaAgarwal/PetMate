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
    icon: "medkit-outline",
    title: "Professional Veterinary Care",
    description:
      "We provide experienced and compassionate pet doctors to keep your pets healthy and safe.",
  },
  {
    key: "2",
    icon: "calendar-outline",
    title: "Book Appointments Easily",
    description:
      "Schedule visits with trusted vets near you in just a few taps, anytime you need.",
  },
  {
    key: "3",
    icon: "document-text-outline",
    title: "Track Health Records",
    description:
      "Keep vaccination history, prescriptions, and checkups organized in one place.",
  },
  {
    key: "4",
    icon: "notifications-outline",
    title: "Get Reminders & Alerts",
    description:
      "Never miss a vaccination, medication, or grooming appointment for your pet again.",
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
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        renderItem={({ item }) => (
          <View style={{ width }} className="flex-1 items-center px-8 pt-16">
            <View className="h-56 w-56 items-center justify-center rounded-full bg-blue-50">
              <Ionicons name={item.icon} size={100} color="#3B82F6" />
            </View>

            <Text className="mt-12 text-center text-3xl font-bold text-orange-500">
              {item.title}
            </Text>

            <Text className="mt-4 text-center text-base leading-6 text-gray-500">
              {item.description}
            </Text>
          </View>
        )}
      />

      <View className="flex-row items-center justify-center gap-2">
        {slides.map((_, index) => (
          <View
            key={index}
            className={`h-2 rounded-full ${
              index === activeIndex ? "w-6 bg-orange-500" : "w-2 bg-orange-200"
            }`}
          />
        ))}
      </View>

      <View className="flex-row justify-end px-8 py-8">
        <TouchableOpacity onPress={handleNext} activeOpacity={0.7}>
          <Text className="text-lg font-semibold text-orange-500">
            {isLastSlide ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
