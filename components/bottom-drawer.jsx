import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

/**
 * Generic bottom-sheet drawer: dimmed backdrop + slide-up panel with a
 * drag handle, a header (title + close X), and whatever content/footer
 * you pass as children. Used in place of router.push for the pet-profile
 * "Add Record" flows (vaccines, allergies, hobbies, walks).
 *
 * Tapping the backdrop or the X calls onClose — the caller owns the
 * open/closed state (e.g. `openDrawer === "vaccines"`).
 */
export function BottomDrawer({
  visible,
  onClose,
  title,
  children,
  maxHeightPct = 0.92,
}) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: visible ? 0 : SCREEN_HEIGHT,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [visible, translateY]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View className="flex-1 justify-end bg-pine/40">
        <Pressable
          onPress={onClose}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />

        <Animated.View
          style={{
            transform: [{ translateY }],
            maxHeight: SCREEN_HEIGHT * maxHeightPct,
          }}
          className="overflow-hidden rounded-t-3xl bg-cream"
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            {/* Drag handle */}
            <View className="items-center pt-2.5">
              <View className="h-1.5 w-10 rounded-full bg-pine/15" />
            </View>

            {/* Header */}
            <View className="flex-row items-center justify-between border-b border-pine/10 px-5 py-4">
              <Text className="text-base font-extrabold text-pine">
                {title}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.7}
                hitSlop={8}
              >
                <Ionicons name="close" size={22} color="#1F3D2B" />
              </TouchableOpacity>
            </View>

            {children}
          </KeyboardAvoidingView>
        </Animated.View>
      </View>
    </Modal>
  );
}
