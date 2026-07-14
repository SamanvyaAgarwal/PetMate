import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProfile } from "@/src/authApi";

const DRAWER_WIDTH = 300;

const MENU_ITEMS = [
  { key: "home", label: "Home", icon: "home-outline", route: "/home" },
  {
    key: "profile",
    label: "Profile",
    icon: "person-outline",
    route: "/profile",
  },
  {
    key: "friends",
    label: "Connect Friends",
    icon: "people-outline",
    route: "/connect-friends",
  },
  {
    key: "activity",
    label: "My Activity",
    icon: "footsteps-outline",
    route: "/my-activity",
  },
  {
    key: "terms",
    label: "Terms & Conditions",
    icon: "document-text-outline",
    route: "/terms",
  },
  {
    key: "privacy",
    label: "Privacy Policy",
    icon: "shield-checkmark-outline",
    route: "/privacy",
  },
  {
    key: "settings",
    label: "Settings",
    icon: "settings-outline",
    route: "/settings",
  },
];

export default function Header({ userName = "Alex Rivera", avatarUri }) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  const { colorScheme, setColorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else if (mounted) {
      Animated.timing(translateX, {
        toValue: -DRAWER_WIDTH,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setMounted(false));
    }
  }, [isOpen]);

  const handleNavigate = (route) => {
    closeMenu();
    router.push(route);
  };

  const handleLogout = () => {
    closeMenu();
    // TODO: clear auth/session state here before redirecting
    router.replace("/login");
  };
  const loadProfile = async () => {
    try {
      const response = await getProfile();

      console.log(response.data);

      setUser(response.data.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <>
      {/* ---------- Top bar ---------- */}
      <SafeAreaView
        edges={["top"]}
        className="border-b border-pine/10 bg-cream dark:border-cream/10 dark:bg-pine"
      >
        <View className="flex-row items-center justify-between px-4 py-2">
          <View className="flex-row items-center gap-2.5">
            <TouchableOpacity
              onPress={openMenu}
              activeOpacity={0.7}
              className="h-9 w-9 items-center justify-center rounded-full"
            >
              <Ionicons
                name="menu-outline"
                size={24}
                color={isDark ? "#FBF3E7" : "#1F3D2B"}
              />
            </TouchableOpacity>

            <Text className="text-lg font-extrabold tracking-wide text-pine dark:text-cream">
              PawTrail
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/profile")}
            className="flex-row items-center gap-2 rounded-full border border-pine/10 bg-white py-1 pl-1 pr-3 dark:border-cream/10 dark:bg-pine"
          >
            {avatarUri ? (
              <Image
                source={{ uri: avatarUri }}
                style={{ width: 28, height: 28, borderRadius: 14 }}
              />
            ) : (
              <View className="h-7 w-7 items-center justify-center rounded-full bg-mustard">
                <Ionicons name="paw" size={14} color="#1F3D2B" />
              </View>
            )}

            <Text
              className="max-w-[100px] text-sm font-semibold text-pine dark:text-cream"
              numberOfLines={1}
            >
              {user?.name || userName}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* ---------- Sliding drawer overlay ---------- */}
      {mounted && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 50,
          }}
        >
          <Pressable
            onPress={closeMenu}
            className="absolute inset-0 bg-pine/50"
          />

          <Animated.View
            style={{
              width: DRAWER_WIDTH,
              height: "100%",
              transform: [{ translateX }],
            }}
            className="bg-pine dark:bg-ink"
          >
            <SafeAreaView className="flex-1" edges={["top", "bottom"]}>
              {/* Profile block */}
              <View className="px-6 pb-5 pt-4">
                <View className="flex-row items-center gap-3">
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleNavigate("/profile")}
                    className="flex-row items-center gap-3"
                  >
                    {avatarUri ? (
                      <Image
                        source={{ uri: avatarUri }}
                        style={{ width: 52, height: 52, borderRadius: 26 }}
                      />
                    ) : (
                      <View className="h-[52px] w-[52px] items-center justify-center rounded-full border-2 border-mustard">
                        <Ionicons name="paw" size={22} color="#FBF3E7" />
                      </View>
                    )}
                    <View className="flex-1">
                      <Text
                        className="text-base font-bold text-cream"
                        numberOfLines={1}
                      >
                        {userName}
                      </Text>
                      <Text className="text-xs text-cream/50">
                        View profile
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Light / dark toggle */}
                <View className="mt-5 flex-row rounded-xl bg-cream/10 p-1">
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setColorScheme("light")}
                    className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-lg py-2 ${
                      !isDark ? "bg-mustard" : ""
                    }`}
                  >
                    <Ionicons
                      name="sunny-outline"
                      size={15}
                      color={!isDark ? "#1F3D2B" : "#FBF3E799"}
                    />
                    <Text
                      className={`text-xs font-semibold ${!isDark ? "text-pine" : "text-cream/60"}`}
                    >
                      Light
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setColorScheme("dark")}
                    className={`flex-1 flex-row items-center justify-center gap-1.5 rounded-lg py-2 ${
                      isDark ? "bg-mustard" : ""
                    }`}
                  >
                    <Ionicons
                      name="moon-outline"
                      size={15}
                      color={isDark ? "#1F3D2B" : "#FBF3E799"}
                    />
                    <Text
                      className={`text-xs font-semibold ${isDark ? "text-pine" : "text-cream/60"}`}
                    >
                      Dark
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="h-px bg-cream/10" />

              {/* Menu items */}
              <View className="flex-1 px-3 pt-3">
                {MENU_ITEMS.map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    activeOpacity={0.7}
                    onPress={() => handleNavigate(item.route)}
                    className="mb-1 flex-row items-center gap-3 rounded-xl px-3 py-3"
                  >
                    <Ionicons
                      name={item.icon}
                      size={19}
                      color="#FBF3E7"
                      style={{ opacity: 0.85 }}
                    />
                    <Text className="text-[15px] font-medium text-cream/90">
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View className="h-px bg-cream/10" />
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleLogout}
                className="flex-row items-center gap-3 px-6 py-4"
              >
                <Ionicons name="log-out-outline" size={19} color="#B5533C" />
                <Text className="text-[15px] font-semibold text-clay">
                  Logout
                </Text>
              </TouchableOpacity>
            </SafeAreaView>
          </Animated.View>
        </View>
      )}
    </>
  );
}
