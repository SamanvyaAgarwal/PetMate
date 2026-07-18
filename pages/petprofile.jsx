import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { deletePet, getPetById } from "../src/authApi";

import { BottomDrawer } from "@/components/bottom-drawer";
import { AllergyForm } from "@/components/forms/allergy-form";
import { HobbyForm } from "@/components/forms/hobby-form";
import { VaccineRecordForm } from "@/components/forms/vaccine-record-form";
import { WalkForm } from "@/components/forms/walk-form";
import { IMAGE_BASE_URL } from "../src/axios";

// Thin radiating ticks around the paw seal — reused from the auth screens
// so the pet's hero photo feels like part of the same visual family
const SEAL_TICKS = Array.from({ length: 14 });

// TODO: replace with a real fetch — GET /pets/:petId, using the petId param
// passed in from wherever this screen is opened (e.g. tapping a pet on Home)

const TABS = [
  { key: "vaccines", label: "Vaccines", icon: "flask-outline" },
  { key: "allergies", label: "Allergies", icon: "alert-circle-outline" },
  { key: "hobbies", label: "Hobbies", icon: "heart-outline" },
  { key: "walks", label: "Walks", icon: "footsteps-outline" },
  { key: "medical", label: "Medical Hx", icon: "medical-outline" },
];

// Tabs whose "Add Record" button opens a drawer — Medical Hx intentionally
// has none, since it's a read-only history view (no add button shown for it)
const DRAWER_TITLES = {
  vaccines: "Add Vaccine Record",
  allergies: "Add Allergy",
  hobbies: "Add Hobby",
  walks: "Start Walk",
};

const calculateAge = (dob) => {
  if (!dob) return "--";

  const birthDate = new Date(dob);
  const today = new Date();

  const diffTime = today - birthDate;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 30) {
    return `${diffDays} Day${diffDays !== 1 ? "s" : ""}`;
  }

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  if (today.getDate() < birthDate.getDate()) {
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years > 0) {
    return `${years} Year${years > 1 ? "s" : ""}`;
  }

  return `${months} Month${months > 1 ? "s" : ""}`;
};

export default function PetProfileScreen() {
  const { petId } = useLocalSearchParams();
  const [pet, setPet] = useState(null);
  const [activeTab, setActiveTab] = useState("vaccines");
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  // Which "Add Record" drawer is open, if any: one of the DRAWER_TITLES
  // keys, or null when every drawer is closed.
  const [openDrawer, setOpenDrawer] = useState(null);
  const insets = useSafeAreaInsets();

  const petName = pet?.pet_name || pet?.name || "Pet";
  const petImageUri = pet?.pet_image
    ? {
        uri: `${IMAGE_BASE_URL}${pet.pet_image}`,
      }
    : null;
  const petWeight = pet?.weight ?? "—";
  const petBirthDate = pet?.dob
    ? new Date(pet.dob).toLocaleDateString()
    : "Unknown";

  const loadPet = async () => {
    try {
      const response = await getPetById(petId);
      console.log(response.data);
      setPet(response.data.data.pet);
    } catch (error) {
      console.log(error.response?.data || error);
    }
  };
  const activeTabData = TABS.find((t) => t.key === activeTab);

  const handleEdit = () => {
    setShowOptionsMenu(false);
    router.push({ pathname: "/edit-pet", params: { petId } });
  };

  const handleDeletePress = () => {
    setShowOptionsMenu(false);
    Alert.alert(
      `Delete ${petName}'s profile?`,
      "This will permanently remove this pet and all of its records. This can't be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: handleConfirmDelete },
      ],
    );
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deletePet(petId);

      Alert.alert("Success", response.data.message, [
        {
          text: "OK",
          onPress: () => router.replace("/home"),
        },
      ]);
    } catch (error) {
      console.log(error.response?.data || error);

      Alert.alert(
        "Error",
        error.response?.data?.message || "Unable to delete pet.",
      );
    }
  };
  const closeDrawer = () => setOpenDrawer(null);
  const handleBookServices = () => {
    // TODO: route into service booking with this pet pre-selected,
    // e.g. router.push({ pathname: "/service-listing", params: { petId } })
  };

  const handleAddRecord = () => {
    if (!DRAWER_TITLES[activeTab]) return;
    setOpenDrawer(activeTab);
  };

  useFocusEffect(
    useCallback(() => {
      if (petId) {
        loadPet();
      }
    }, [petId]),
  );

  if (!pet) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  console.log("Pet Image Path:", pet.pet_image);
  console.log("Full URL:", `${IMAGE_BASE_URL}${pet.pet_image}`);
  console.log("petImageUri:", petImageUri);
  console.log("DOB:", pet.dob);
  console.log("Calculated Age:", calculateAge(pet.dob));
  return (
    <View className="flex-1 bg-cream">
      {/* ---------- Header ---------- */}
      <SafeAreaView
        edges={["top"]}
        className="border-b border-pine/10 bg-cream"
      >
        <View className="flex-row items-center justify-between px-4 py-3">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color="#1F3D2B" />
          </TouchableOpacity>

          <Text className="text-base font-extrabold text-pine">
            Pet Profile
          </Text>

          <TouchableOpacity
            onPress={() => setShowOptionsMenu(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color="#1F3D2B" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* ---------- Options menu: Edit / Delete ---------- */}
      <Modal
        visible={showOptionsMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOptionsMenu(false)}
      >
        <Pressable className="flex-1" onPress={() => setShowOptionsMenu(false)}>
          <View
            style={{ position: "absolute", top: insets.top + 15, right: 16 }}
            className="w-48 overflow-hidden rounded-2xl border border-pine/10 bg-white shadow-lg"
          >
            <TouchableOpacity
              onPress={handleEdit}
              activeOpacity={0.7}
              className="flex-row items-center gap-2.5 px-4 py-3.5"
            >
              <Ionicons name="pencil-outline" size={17} color="#1F3D2B" />
              <Text className="text-sm font-semibold text-pine">
                Edit Profile
              </Text>
            </TouchableOpacity>

            <View className="mx-3 h-px bg-pine/10" />

            <TouchableOpacity
              onPress={handleDeletePress}
              activeOpacity={0.7}
              className="flex-row items-center gap-2.5 px-4 py-3.5"
            >
              <Ionicons name="trash-outline" size={17} color="#B5533C" />
              <Text className="text-sm font-semibold text-clay">
                Delete Profile
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* ---------- Hero ---------- */}
        <View className="items-center bg-pine pb-10 pt-8">
          <View className="items-center justify-center">
            <View className="absolute h-40 w-40 items-center justify-center">
              {SEAL_TICKS.map((_, i) => {
                const angle = (360 / SEAL_TICKS.length) * i;
                return (
                  <View
                    key={i}
                    style={{
                      position: "absolute",
                      width: 2,
                      height: 8,
                      backgroundColor: "#D9A441",
                      opacity: 0.5,
                      transform: [
                        { rotate: `${angle}deg` },
                        { translateY: -70 },
                      ],
                    }}
                  />
                );
              })}
            </View>

            {petImageUri ? (
              <Image
                source={petImageUri}
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 70,
                }}
                contentFit="cover"
                onLoad={() => console.log("✅ Pet image loaded")}
                onError={(error) => console.log("❌ Pet image error:", error)}
              />
            ) : (
              <View className="h-28 w-28 items-center justify-center rounded-full border-[3px] border-mustard bg-cream">
                <Ionicons name="paw" size={44} color="#1F3D2B" />
              </View>
            )}
          </View>

          {/* Floating name + breed tag */}
          <View
            className="mt-4 flex-row items-center gap-2 rounded-2xl bg-cream px-4 py-2 shadow-md"
            style={{ transform: [{ rotate: "-1.5deg" }] }}
          >
            <Text className="text-base font-extrabold text-pine">
              {pet?.pet_name}
            </Text>
            <View className="h-3 w-px bg-pine/20" />
            <Text className="text-sm text-pine/60">{pet?.breed}</Text>
          </View>
        </View>

        {/* ---------- Stat cards ---------- */}
        <View className="mt-4 flex-row gap-3 px-4">
          <View className="flex-1 rounded-2xl bg-mustard/15 p-4">
            <Text className="text-sm text-pine/60">Weight</Text>
            <Text className="mt-1 text-2xl font-extrabold text-pine">
              {petWeight} kg
            </Text>
            <Text className="mt-1 text-xs text-pine/50">
              Track {petName}
              {`'`}s weight
            </Text>
          </View>
          <View className="flex-1 rounded-2xl bg-clay/15 p-4">
            <Text className="text-sm text-pine/60">Age</Text>
            <Text className="mt-1 text-2xl font-extrabold text-pine">
              {calculateAge(pet?.dob)}
            </Text>
            <Text className="mt-1 text-xs text-pine/50">
              Born on {new Date(pet?.dob).toLocaleDateString("en-GB")}
            </Text>
          </View>
        </View>

        {/* ---------- Tabs ---------- */}
        <View className="mt-6 px-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {TABS.map((tab) => {
              const isActive = tab.key === activeTab;
              return (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => setActiveTab(tab.key)}
                  activeOpacity={0.8}
                  style={{ marginRight: 10 }}
                  className={`rounded-xl px-5 py-2.5 ${isActive ? "bg-mustard" : "bg-white"}`}
                >
                  <Text
                    className={`text-sm font-semibold ${isActive ? "text-pine" : "text-pine/50"}`}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ---------- Tab content (empty state for now) ---------- */}
        <View className="mt-10 items-center px-4 py-10">
          <Ionicons
            name={activeTabData.icon}
            size={56}
            color="#1F3D2B"
            style={{ opacity: 0.2 }}
          />
          <Text className="mt-4 text-sm text-pine/40">
            No{" "}
            {activeTabData.key === "medical"
              ? "medical history"
              : activeTabData.label.toLowerCase()}{" "}
            records yet.
          </Text>
        </View>
      </ScrollView>

      {/* ---------- Fixed Add Record button — hidden on Medical Hx ---------- */}
      {activeTab !== "medical" && (
        <SafeAreaView
          edges={["bottom"]}
          className="border-t border-pine/10 bg-cream px-4 pt-3"
        >
          <TouchableOpacity
            onPress={handleAddRecord}
            activeOpacity={0.85}
            className="mb-3 flex-row items-center justify-center gap-2 rounded-2xl bg-mustard py-4"
          >
            <Ionicons name="add" size={20} color="#1F3D2B" />
            <Text className="text-base font-extrabold text-pine">
              {activeTabData.key === "walks" ? "Start Walking" : "Add Record"}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      )}

      {/* ---------- Add Record drawers ---------- */}
      <BottomDrawer
        visible={openDrawer === "vaccines"}
        onClose={closeDrawer}
        title={DRAWER_TITLES.vaccines}
      >
        <VaccineRecordForm petId={petId} onClose={closeDrawer} />
      </BottomDrawer>

      <BottomDrawer
        visible={openDrawer === "allergies"}
        onClose={closeDrawer}
        title={DRAWER_TITLES.allergies}
      >
        <AllergyForm petId={petId} onClose={closeDrawer} />
      </BottomDrawer>

      <BottomDrawer
        visible={openDrawer === "hobbies"}
        onClose={closeDrawer}
        title={DRAWER_TITLES.hobbies}
      >
        <HobbyForm petId={petId} onClose={closeDrawer} />
      </BottomDrawer>

      <BottomDrawer
        visible={openDrawer === "walks"}
        onClose={closeDrawer}
        title={DRAWER_TITLES.walks}
      >
        <WalkForm petId={petId} onClose={closeDrawer} />
      </BottomDrawer>
    </View>
  );
}
