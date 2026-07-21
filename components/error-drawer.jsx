import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

/**
 * Bottom-sheet used for error confirmations — replaces Alert.alert("Error", ...)
 * across the auth and pet-management screens. Unlike SuccessDrawer, this does
 * NOT auto-dismiss: errors need to actually be read and acknowledged, not
 * flash by. Tapping the backdrop or the button both call onDismiss.
 */
export function ErrorDrawer({
  visible,
  onDismiss,
  message,
  buttonLabel = "OK",
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
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <View className="flex-1 justify-end bg-pine/40">
        <Pressable
          onPress={onDismiss}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />

        <Animated.View
          style={{ transform: [{ translateY }] }}
          className="overflow-hidden rounded-t-3xl bg-cream"
        >
          <SafeAreaView edges={["bottom"]}>
            <View className="items-center px-8 pb-8 pt-3">
              <View className="mb-1 h-1.5 w-10 rounded-full bg-pine/15" />

              <View className="my-5 h-16 w-16 items-center justify-center rounded-full bg-clay/15">
                <Ionicons name="alert-circle" size={40} color="#B5533C" />
              </View>

              <Text className="text-center text-[15px] text-pine/80">
                {message}
              </Text>

              <TouchableOpacity
                onPress={onDismiss}
                activeOpacity={0.85}
                className="mt-6 w-full items-center rounded-2xl bg-clay/90 py-4"
              >
                <Text className="text-base font-extrabold text-cream">
                  {buttonLabel}
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}
