import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getVendors } from "../src/authApi";

export default function VendorsScreen() {
  const {
    category,
    petId,
    service_uid,
    serviceTitle,
  } = useLocalSearchParams();

  const { colorScheme } = useColorScheme();

  const isDark = colorScheme === "dark";

  const iconColor = isDark ? "#FBF3E7" : "#1F3D2B";

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const loadVendors = async () => {
    try {
      setLoading(true);

      const response = await getVendors(service_uid);

      console.log("Vendor Response:", response.data);

      setVendors(response.data.data.vendors || []);
    } catch (error) {
      console.log(error.response?.data || error);

      Alert.alert(
        "Error",
        "Unable to load vendors."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (service_uid) {
      loadVendors();
    }
  }, [service_uid]);

  const handleContinue = () => {
    if (!selectedVendor) {
      Alert.alert(
        "Select Vendor",
        "Please select a vendor first."
      );
      return;
    }

    router.push({
      pathname: "/booking",
      params: {
        pet_uid: petId,
        category,
        service_uid,
        vendor_uid: selectedVendor.vendor_uid,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-pine" edges={["top"]}>
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-fog-200 bg-cream px-4 py-4 dark:border-cream/10 dark:bg-pine">

        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons
            name="chevron-back"
            size={26}
            color={iconColor}
          />
        </TouchableOpacity>

        <Text className="text-lg font-bold text-pine dark:text-cream">
          Select Vendor
        </Text>

        <View style={{ width: 26 }} />
      </View>

      {/* Body */}

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#B8860B" />
          <Text className="mt-3 text-pine dark:text-cream">
            Loading Vendors...
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1 bg-fog-50 dark:bg-ink"
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
        >
          {vendors.length === 0 ? (
            <View className="items-center mt-20">
              <Ionicons
                name="storefront-outline"
                size={60}
                color={iconColor}
              />

              <Text className="mt-5 text-lg font-semibold text-pine dark:text-cream">
                No Vendors Found
              </Text>
            </View>
          ) : (
            vendors.map((vendor) => {
              const isSelected =
                selectedVendor?.vendor_uid === vendor.vendor_uid;

              return (
                <TouchableOpacity
                  key={vendor.vendor_uid}
                  activeOpacity={0.8}
                  onPress={() => setSelectedVendor(vendor)}
                  className={`mb-5 rounded-3xl overflow-hidden bg-cream dark:bg-pine ${isSelected
                      ? "border-2 border-mustard"
                      : "border border-fog-200 dark:border-cream/10"
                    }`}
                >
                  {/* Vendor Image */}

                  <Image
                    source={{
                      uri:
                        vendor.profile_image ||
                        "https://picsum.photos/700/500",
                    }}
                    style={{
                      width: "100%",
                      height: 220,
                    }}
                    contentFit="cover"
                  />

                  {/* Vendor Details */}

                  <View className="p-5">

                    <Text className="text-2xl font-bold text-pine dark:text-cream">
                      {vendor.vendor_name}
                    </Text>

                    <View className="flex-row items-center mt-3">

                      <Ionicons
                        name="star"
                        size={18}
                        color="#F4B400"
                      />

                      <Text className="ml-2 text-pine dark:text-cream">
                        {vendor.rating || "New Vendor"}
                      </Text>

                    </View>

                    <View className="flex-row items-center mt-4">

                      <Ionicons
                        name="location"
                        size={18}
                        color={iconColor}
                      />

                      <Text className="ml-2 text-pine dark:text-cream">
                        {vendor.city}, {vendor.state}
                      </Text>

                    </View>

                    <View className="flex-row mt-3">

                      <Ionicons
                        name="home"
                        size={18}
                        color={iconColor}
                      />

                      <Text
                        className="ml-2 flex-1 text-pine dark:text-cream"
                      >
                        {vendor.address}
                      </Text>

                    </View>

                    <View className="flex-row mt-3">

                      <Ionicons
                        name="call"
                        size={18}
                        color={iconColor}
                      />

                      <Text className="ml-2 text-pine dark:text-cream">
                        {vendor.phone}
                      </Text>

                    </View>

                    {isSelected && (
                      <View className="mt-5 flex-row items-center">

                        <Ionicons
                          name="checkmark-circle"
                          size={22}
                          color="green"
                        />

                        <Text className="ml-2 font-bold text-green-700">
                          Selected
                        </Text>

                      </View>
                    )}

                  </View>

                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}

      {/* Fixed bottom CTA — mirrors "Select a Package" from the reference */}
      <SafeAreaView
        edges={["bottom"]}
        className="border-t border-fog-200 bg-cream px-4 pt-3 dark:border-cream/10 dark:bg-pine"
      >
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={!selectedVendor}
          onPress={handleContinue}
          className={`mb-3 items-center justify-center rounded-2xl py-4 ${selectedVendor
              ? "bg-mustard"
              : "bg-gray-300 dark:bg-gray-700"
            }`}
        >
          <Text
            className={`text-lg font-bold ${selectedVendor
                ? "text-pine"
                : "text-gray-500 dark:text-gray-400"
              }`}
          >
            {selectedVendor
              ? `Continue with ${selectedVendor.vendor_name}`
              : "Select a Vendor"}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
}
