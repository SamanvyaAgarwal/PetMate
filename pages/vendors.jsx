import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// TODO: replace with a real fetch — GET /services/:serviceId/vendors?lat=...&lng=...
// Shape mirrors the "Select Package" reference: image, optional discount,
// price (+ optional struck-through original), business type, service mode
// (Home / At Shop), and a row of tag chips.
const DEMO_VENDORS = [
  {
    id: "1",
    name: "Handsome Groomer",
    businessType: "Demo business",
    serviceMode: "Home",
    discount: "10% OFF",
    price: 499,
    originalPrice: 549,
    tags: [
      { icon: "calendar-outline", label: "5 slots/day" },
      { icon: "hourglass-outline", label: "Book 7d ahead" },
      { icon: "paw-outline", label: "SMALL" },
    ],
    image: "https://picsum.photos/seed/vendor-groomer/600/400",
  },
  {
    id: "2",
    name: "Full Grooming Studio",
    businessType: "Demo Individual",
    serviceMode: "Home",
    discount: null,
    price: 649,
    originalPrice: null,
    tags: [
      { icon: "hourglass-outline", label: "Book 7d ahead" },
      { icon: "paw-outline", label: "SMALL" },
      { icon: "paw-outline", label: "MEDIUM" },
      { icon: "paw-outline", label: "LARGE" },
    ],
    image: "https://picsum.photos/seed/vendor-full-groom/600/400",
  },
  {
    id: "3",
    name: "The Pet Care Co.",
    businessType: "Demo business",
    serviceMode: "At Shop",
    discount: "15% OFF",
    price: 399,
    originalPrice: 549,
    tags: [
      { icon: "calendar-outline", label: "3 slots/day" },
      { icon: "paw-outline", label: "MEDIUM" },
    ],
    image: "https://picsum.photos/seed/vendor-shop/600/400",
  },
];

export default function VendorsScreen() {
  // Passed forward from service-listing.jsx's handleSelectService
  const { category, petId, serviceId, serviceTitle } = useLocalSearchParams();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? "#FBF3E7" : "#1F3D2B";

  const [vendors, setVendors] = useState(DEMO_VENDORS);
  const [loading, setLoading] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState(null);

  useEffect(() => {
    // TODO: fetch real vendors offering this service, e.g.:
    // setLoading(true);
    // fetchVendorsForService({ serviceId, lat, lng }).then(setVendors).finally(() => setLoading(false));
  }, [serviceId]);

  const selectedVendor = vendors.find((v) => v.id === selectedVendorId);

  // Kicks off booking with whichever vendor card is currently selected.
  const handleContinue = () => {
    if (!selectedVendor) return;
    router.push({
      pathname: "/booking",
      params: {
        category,
        petId,
        serviceId,
        serviceTitle,
        vendorId: selectedVendor.id,
        vendorName: selectedVendor.name,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-pine" edges={["top"]}>
      {/* Top bar */}
      <View className="relative flex-row items-center justify-between border-b border-fog-200 bg-cream px-4 py-3.5 dark:border-cream/10 dark:bg-pine">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="h-9 w-9 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={26} color={iconColor} />
        </TouchableOpacity>

        <Text
          className="max-w-[220px] text-[17px] font-semibold text-pine dark:text-cream"
          numberOfLines={1}
        >
          {serviceTitle ? `Select Vendor` : "Select Vendor"}
        </Text>

        <TouchableOpacity
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="h-9 w-9 items-center justify-center"
        >
          <Ionicons name="search-outline" size={22} color={iconColor} />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 bg-fog-50 dark:bg-ink"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-4 pt-5">
          {loading ? (
            <Text className="py-10 text-center text-pine/50 dark:text-cream/50">
              Finding vendors near you…
            </Text>
          ) : vendors.length === 0 ? (
            <View className="items-center py-16">
              <Ionicons name="storefront-outline" size={40} color={iconColor} />
              <Text className="mt-4 text-center text-pine/60 dark:text-cream/60">
                No vendors available for this service yet.
              </Text>
            </View>
          ) : (
            <View className="gap-5">
              {vendors.map((vendor) => {
                const isSelected = vendor.id === selectedVendorId;
                return (
                  <TouchableOpacity
                    key={vendor.id}
                    activeOpacity={0.9}
                    onPress={() => setSelectedVendorId(vendor.id)}
                    className={`overflow-hidden rounded-3xl bg-cream shadow-sm dark:bg-pine ${
                      isSelected
                        ? "border-2 border-mustard"
                        : "border border-fog-200 dark:border-cream/10"
                    }`}
                  >
                    {/* Image with overlay */}
                    <View className="relative h-52">
                      <Image
                        source={{ uri: vendor.image }}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                        transition={200}
                        placeholder={{
                          blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4",
                        }}
                      />

                      {/* Dark scrim so the bottom text stays legible over any photo */}
                      <View className="absolute inset-x-0 bottom-0 h-24 bg-pine/70" />

                      {/* Discount badge */}
                      {vendor.discount && (
                        <View className="absolute left-3 top-3 rounded-full bg-clay px-3 py-1.5">
                          <Text className="text-xs font-extrabold uppercase tracking-wide text-cream">
                            {vendor.discount}
                          </Text>
                        </View>
                      )}

                      {/* Price badge */}
                      <View className="absolute right-3 top-3 items-end rounded-xl bg-pine px-3 py-2 dark:bg-ink">
                        <Text className="text-[11px] font-semibold text-cream/70">
                          INR{" "}
                          <Text className="text-base font-extrabold text-cream">
                            {vendor.price}
                          </Text>
                        </Text>
                        {vendor.originalPrice &&
                          vendor.originalPrice !== vendor.price && (
                            <Text className="text-[11px] text-cream/50 line-through">
                              ₹{vendor.originalPrice}
                            </Text>
                          )}
                      </View>

                      {/* Selected check */}
                      {isSelected && (
                        <View className="absolute bottom-[92px] right-3 h-7 w-7 items-center justify-center rounded-full bg-mustard">
                          <Ionicons
                            name="checkmark"
                            size={18}
                            color="#1F3D2B"
                          />
                        </View>
                      )}

                      {/* Business type / name / service-mode row */}
                      <View className="absolute inset-x-0 bottom-0 flex-row items-end justify-between px-4 pb-3.5">
                        <View className="flex-1 pr-2">
                          <View className="flex-row items-center gap-1.5">
                            <Ionicons
                              name="person-circle-outline"
                              size={15}
                              color="#FBF3E7CC"
                            />
                            <Text className="text-xs text-cream/80">
                              {vendor.businessType}
                            </Text>
                          </View>
                          <Text
                            className="mt-0.5 text-xl font-extrabold text-cream"
                            numberOfLines={1}
                          >
                            {vendor.name}
                          </Text>
                        </View>

                        <View className="flex-row items-center gap-1 rounded-full bg-pine/70 px-3 py-1.5 dark:bg-ink/70">
                          <Ionicons
                            name={
                              vendor.serviceMode === "Home"
                                ? "home"
                                : "storefront"
                            }
                            size={13}
                            color="#FBF3E7"
                          />
                          <Text className="text-xs font-semibold text-cream">
                            {vendor.serviceMode}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Tag chips */}
                    <View className="flex-row flex-wrap gap-2 px-4 py-4">
                      {vendor.tags.map((tag, i) => (
                        <View
                          key={i}
                          className="flex-row items-center gap-1.5 rounded-full bg-fog-100 px-3 py-1.5 dark:bg-ink"
                        >
                          <Ionicons
                            name={tag.icon}
                            size={13}
                            color={iconColor}
                            style={{ opacity: 0.6 }}
                          />
                          <Text className="text-xs font-medium text-ink/70 dark:text-cream/70">
                            {tag.label}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed bottom CTA — mirrors "Select a Package" from the reference */}
      <SafeAreaView
        edges={["bottom"]}
        className="border-t border-fog-200 bg-cream px-4 pt-3 dark:border-cream/10 dark:bg-pine"
      >
        <TouchableOpacity
          onPress={handleContinue}
          activeOpacity={0.85}
          disabled={!selectedVendor}
          className={`mb-3 items-center justify-center rounded-2xl py-4 ${
            selectedVendor ? "bg-mustard" : "bg-pine/10 dark:bg-cream/10"
          }`}
        >
          <Text
            className={`text-base font-extrabold ${
              selectedVendor ? "text-pine" : "text-pine/30 dark:text-cream/30"
            }`}
          >
            {selectedVendor
              ? `Continue with ${selectedVendor.name}`
              : "Select a Vendor"}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
}
