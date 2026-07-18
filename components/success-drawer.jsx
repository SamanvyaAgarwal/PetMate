import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, Modal, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

/**
 * Lightweight bottom-sheet used for one-off success confirmations in the
 * auth flow (OTP sent, login/signup verified) — replaces Alert.alert for
 * these specific "good news" moments. No button, no tap required: it
 * slides up, sits for `holdMs`, then slides back down and calls
 * onContinue automatically — the caller's navigation runs right after,
 * so the whole thing reads as "brief confirmation, then redirect."
 *
 * Unlike BottomDrawer (used for the pet-profile Add Record forms), there's
 * no title bar, no close X, and no way to interact with it — it's purely
 * informational and self-dismissing.
 */
export function SuccessDrawer({ visible, onContinue, message, holdMs = 1400 }) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (!visible) {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 220,
        useNativeDriver: true,
      }).start();
      return;
    }

    // Slide up, hold, slide down, then hand off to the caller's navigation.
    Animated.timing(translateY, {
      toValue: 0,
      duration: 260,
      useNativeDriver: true,
    }).start();

    const holdTimer = setTimeout(() => {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 220,
        useNativeDriver: true,
      }).start(() => {
        onContinue?.();
      });
    }, holdMs);

    return () => clearTimeout(holdTimer);
  }, [visible, holdMs]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View className="flex-1 justify-end bg-pine/40">
        <Animated.View
          style={{ transform: [{ translateY }] }}
          className="overflow-hidden rounded-t-3xl bg-cream"
        >
          <SafeAreaView edges={["bottom"]}>
            <View className="items-center px-8 pb-10 pt-3">
              <View className="mb-1 h-1.5 w-10 rounded-full bg-pine/15" />

              <View className="my-5 h-16 w-16 items-center justify-center rounded-full bg-mustard/20">
                <Ionicons name="checkmark-circle" size={40} color="#D9A441" />
              </View>

              <Text className="text-center text-[15px] text-pine/80">
                {message}
              </Text>
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}
