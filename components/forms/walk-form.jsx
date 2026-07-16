import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TextAreaField } from "@/components/form-fields";

// Renders inside <BottomDrawer title="Start Walk">.
// `onClose` dismisses the drawer (replaces the old router.back()).
export function WalkForm({ petId, onClose }) {
  const insets = useSafeAreaInsets();

  const [walkName, setWalkName] = useState("Morning Walk");
  const [notes, setNotes] = useState("");
  const [isWalking, setIsWalking] = useState(false);

  const handleToggleWalk = () => {
    if (!isWalking) {
      // TODO: start real GPS tracking here (needs expo-location + a map library
      // like react-native-maps — this still just mocks the UI state)
      setIsWalking(true);
      return;
    }

    Alert.alert(
      `End "${walkName}"?`,
      "This will stop tracking and save the walk.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End Walk",
          style: "destructive",
          onPress: () => {
            // TODO: save the completed walk record via the real API
            onClose();
          },
        },
      ],
    );
  };

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        className="px-6 pt-5"
      >
        <TextInput
          value={walkName}
          onChangeText={setWalkName}
          placeholder="Walk name"
          placeholderTextColor="#1F3D2B55"
          className="mb-4 text-center text-2xl font-extrabold text-pine/70"
        />

        {/* Mock map preview — TODO: replace with a real map (react-native-maps) */}
        <View className="mb-5 h-64 overflow-hidden rounded-2xl border border-pine/10 bg-white">
          {/* faint grid lines */}
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "33%",
              width: 1,
            }}
            className="bg-pine/5"
          />
          <View
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "66%",
              width: 1,
            }}
            className="bg-pine/5"
          />
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "33%",
              height: 1,
            }}
            className="bg-pine/5"
          />
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "66%",
              height: 1,
            }}
            className="bg-pine/5"
          />

          {/* decorative "green space" block */}
          <View
            style={{
              position: "absolute",
              top: 24,
              right: 20,
              width: 70,
              height: 60,
            }}
            className="rounded-xl border border-mustard/30 bg-mustard/10"
          />

          {/* center pin */}
          <View className="flex-1 items-center justify-center">
            <View className="h-14 w-14 items-center justify-center rounded-full border-4 border-cream bg-mustard shadow-md">
              <Ionicons name="paw" size={20} color="#1F3D2B" />
            </View>
            <View
              style={{
                width: 0,
                height: 0,
                borderLeftWidth: 6,
                borderRightWidth: 6,
                borderTopWidth: 10,
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderTopColor: "#D9A441",
                marginTop: -2,
              }}
            />
          </View>

          <View className="absolute bottom-3 left-3 flex-row items-center gap-1.5 rounded-full bg-pine/80 px-3 py-1.5">
            <Ionicons name="location" size={12} color="#D9A441" />
            <Text className="text-xs font-semibold text-cream">
              {isWalking ? "Walking..." : "Ready to start"}
            </Text>
          </View>
        </View>

        <TextAreaField
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="notes"
        />
      </ScrollView>

      <View
        style={{ paddingBottom: insets.bottom || 12 }}
        className="border-t border-pine/10 bg-cream px-6 pt-3"
      >
        <TouchableOpacity
          onPress={handleToggleWalk}
          activeOpacity={0.85}
          className={`items-center justify-center rounded-2xl py-4 ${isWalking ? "bg-clay" : "bg-mustard"}`}
        >
          <Text
            className={`text-base font-extrabold ${isWalking ? "text-cream" : "text-pine"}`}
          >
            {isWalking ? "End Walk" : "Start Walk"}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
