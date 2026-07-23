import {
  getBookingSummary,
  createBooking,
} from "@/src/authApi";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// TODO: replace with a real fetch — GET /vendors/:vendorId (business contact card)


// TODO: replace with a real fetch — GET /services/:serviceId (title + duration
// + package name), or read this off whatever vendors.jsx already fetched.


// TODO: replace with a real fetch/computation — GET /services/:serviceId/pricing,
// ideally computed server-side once vendor + package + coupon are all known.


function calculateAge(dob) {
  if (!dob) return "—";
  const birthDate = new Date(dob);
  const today = new Date();
  const diffDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));

  if (diffDays < 30) return `${diffDays} Day${diffDays !== 1 ? "s" : ""}`;

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  if (today.getDate() < birthDate.getDate()) months--;
  if (months < 0) {
    years--;
    months += 12;
  }

  if (years > 0) return `${years} Year${years > 1 ? "s" : ""}`;
  if (months === 0) return "Less than 1 Month";
  return `${months} Month${months > 1 ? "s" : ""}`;
}

function formatDateLabel(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function OrderSummaryScreen() {
  // Forwarded from appointment-time-slot.jsx
  const {
    pet_uid,
    service_uid,
    vendor_uid,
    booking_date,
    booking_time,
  } = useLocalSearchParams();

  const petUid = Array.isArray(pet_uid) ? pet_uid[0] : pet_uid;
  const serviceUid = Array.isArray(service_uid) ? service_uid[0] : service_uid;
  const vendorUid = Array.isArray(vendor_uid) ? vendor_uid[0] : vendor_uid;

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? "#FBF3E7" : "#1F3D2B";

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [notes, setNotes] = useState("");

  const loadBookingSummary = async () => {
    try {
      const response = await getBookingSummary({
        pet_uid: petUid,
        service_uid: serviceUid,
        vendor_uid: vendorUid,
        booking_date,
        booking_time,
      });
      setSummary(response.data.data);
      console.log("Booking Summary:", response.data.data);
    } catch (error) {
      console.log(error.response?.data || error);
      Alert.alert("Unable to load order summary", error.response?.data?.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!petUid || !serviceUid || !vendorUid || !booking_date || !booking_time) {
      setLoading(false);
      return;
    }

    loadBookingSummary();
  }, [petUid, serviceUid, vendorUid, booking_date, booking_time]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-cream dark:bg-pine">
        <Text className="text-pine dark:text-cream">
          Loading Order Summary...
        </Text>
      </SafeAreaView>
    );
  }

  const total = Number(summary?.pricing?.total || 0);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    // TODO: call the real coupon-validation API with couponCode + the order context
    Alert.alert(
      "Coupon",
      "Coupon validation isn't wired up to a real API yet.",
    );
  };

  const handlePay = async () => {
    console.log("PAY BUTTON CLICKED");
    if (!pickupAddress.trim()) {
      Alert.alert("Address Required", "Please enter pickup address.");
      return;
    }

    if (!phoneNumber.trim()) {
      Alert.alert("Phone Required", "Please enter your phone number.");
      return;
    }

    try {
      setBookingLoading(true);

      const response = await createBooking({
        pet_uid: petUid,
        service_uid: serviceUid,
        vendor_uid: vendorUid,
        booking_date,
        booking_time,
        address: pickupAddress,
        notes,
      });

      Alert.alert(
        "Success",
        "Booking created successfully!",
        [
          {
            text: "OK",
            onPress: () =>
              router.replace({
                pathname: "/booking-success",
                params: {
                  booking_uid:
                    response.data.data.booking.booking_uid,
                },
              }),
          },
        ]
      );
    } catch (error) {
      console.log("BOOKING ERROR:", error);
      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);

      Alert.alert(
        "Booking Failed",
        error.response?.data?.message ||
        error.message ||
        "Something went wrong."
      );
    } finally {
      setBookingLoading(false);
    }
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

        <Text className="text-[17px] font-semibold text-pine dark:text-cream">
          Service Order Summary
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/home")}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="h-9 w-9 items-center justify-center"
        >
          <Ionicons name="home-outline" size={22} color={iconColor} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1 bg-fog-50 dark:bg-ink"
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="gap-4 px-4 pt-4">
            {/* Pet hero card */}
            <View className="relative overflow-hidden rounded-2xl border border-fog-200 bg-cream px-5 py-5 dark:border-cream/10 dark:bg-pine">
              {/* Soft decorative blobs — echoes the pet-love illustration used elsewhere */}
              <View className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-mustard/10" />
              <View className="absolute -bottom-8 left-10 h-20 w-20 rounded-full bg-clay/10" />

              <Text className="text-xl font-extrabold text-clay">
                {summary?.pet?.pet_name || summary?.pet?.name || "Your Pet"}
              </Text>
              <Text className="mt-1.5 text-[15px] text-pine dark:text-cream">
                Breed: {summary?.pet?.breed || "—"}
              </Text>
              <Text className="mt-1 text-[15px] text-pine dark:text-cream">
                Type: {summary?.pet?.pet_type || "—"}
              </Text>
            </View>

            {/* Service Provider */}
            <View className="overflow-hidden rounded-2xl border border-fog-200 bg-cream px-5 py-5 dark:border-cream/10 dark:bg-pine">
              <View className="flex-row items-center gap-2">
                <Ionicons
                  name="storefront-outline"
                  size={19}
                  color={iconColor}
                />
                <View>
                  <Text>Service Provider</Text>
                </View>
              </View>
              <View className="my-3 h-px bg-fog-200 dark:bg-cream/10" />

              <ProviderRow
                label="Business"
                value={summary?.vendor?.vendor_name}
                bold
              />
              <ProviderRow
                icon="call-outline"
                label="Phone"
                value={summary?.vendor?.phone}
                iconColor={iconColor}
              />
              <ProviderRow
                icon="mail-outline"
                label="Email"
                value={summary?.vendor?.email || "—"}
                iconColor={iconColor}
              />
              <ProviderRow
                icon="location-outline"
                label="Address"
                value={summary?.vendor?.address}
                iconColor={iconColor}
                last
              />
            </View>

            {/* Package / service */}
            <View className="overflow-hidden rounded-2xl border border-fog-200 bg-cream px-5 py-5 dark:border-cream/10 dark:bg-pine">
              <Text className="text-lg font-extrabold text-pine dark:text-cream">
                {summary?.service?.title || "Selected Service"}
              </Text>
              <Text className="mt-1.5 text-[15px] font-semibold text-clay">
                Package: {summary?.vendor?.vendor_name || "—"}
              </Text>
              <Text className="mt-1 text-[13px] text-ink/50 dark:text-cream/50">
                Duration: {summary?.pricing?.duration} minutes
              </Text>
            </View>

            {/* Order summary */}
            <View className="overflow-hidden rounded-2xl border border-fog-200 bg-cream px-5 py-5 dark:border-cream/10 dark:bg-pine">
              <Text className="text-lg font-extrabold text-pine dark:text-cream">
                Order Summary
              </Text>
              <View className="my-3 h-px bg-fog-200 dark:bg-cream/10" />

              <SummaryRow
                label="Appointment Date"
                value={formatDateLabel(summary?.booking?.booking_date)}
                pill
              />
              <SummaryRow label="Time Slot" value={summary?.booking?.booking_time || "—"} pill />

              <View className="my-3 h-px bg-fog-200 dark:bg-cream/10" />
              <Text className="mb-2 text-sm font-semibold text-pine/70 dark:text-cream/70">
                Price breakdown
              </Text>

              <PriceRow
                label="Service fee"
                amount={Number(summary?.pricing?.service_fee || 0)}
              />
              <PriceRow
                label="Platform fee"
                amount={Number(summary?.pricing?.platform_fee || 0)}
              />
              <View className="my-2 h-px bg-fog-200 dark:bg-cream/10" />
              
              <View className="my-2 h-px bg-fog-200 dark:bg-cream/10" />
              <PriceRow
                label="Total payable"
                amount={Number(summary?.pricing?.total || 0)}
                bold
              />

              {/* Coupons */}
              <View className="mt-4 flex-row items-center justify-between">
                <View className="flex-row items-center gap-1.5">
                  <Ionicons
                    name="pricetag-outline"
                    size={16}
                    color={iconColor}
                  />
                  <Text className="text-sm font-semibold text-pine dark:text-cream">
                    Coupons & Offers
                  </Text>
                </View>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text className="text-xs font-semibold text-pine/60 underline dark:text-cream/60">
                    View my offers
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="mt-3 flex-row gap-2.5">
                <TextInput
                  value={couponCode}
                  onChangeText={setCouponCode}
                  placeholder="Enter coupon code"
                  placeholderTextColor="#1F3D2B55"
                  className="flex-1 rounded-xl border border-pine/15 bg-fog-50 px-4 py-3 text-[15px] text-pine dark:bg-ink dark:text-cream"
                />
                <TouchableOpacity
                  onPress={handleApplyCoupon}
                  disabled={!couponCode.trim()}
                  activeOpacity={0.85}
                  className={`items-center justify-center rounded-xl px-5 ${
                    couponCode.trim()
                      ? "bg-mustard"
                      : "bg-pine/10 dark:bg-cream/10"
                  }`}
                >
                  <Text
                    className={`text-sm font-bold ${
                      couponCode.trim()
                        ? "text-pine"
                        : "text-pine/30 dark:text-cream/30"
                    }`}
                  >
                    Apply
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Delivery / contact details */}
            <View className="overflow-hidden rounded-2xl border border-fog-200 bg-cream px-5 py-5 dark:border-cream/10 dark:bg-pine">
              <DetailField
                label="Pickup Address"
                value={pickupAddress}
                onChangeText={setPickupAddress}
                placeholder="Enter pickup address"
              />
              <DetailField
                label="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
              <DetailField
                label="Drop-off Address"
                value={dropoffAddress}
                onChangeText={setDropoffAddress}
                placeholder="Enter drop-off address"
              />
              <DetailField
                label="Special Instructions"
                value={specialInstructions}
                onChangeText={setSpecialInstructions}
                placeholder="Special Instructions"
              />
              <DetailField
                label="Notes"
                value={notes}
                onChangeText={setNotes}
                placeholder="notes"
                multiline
                last
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Fixed Pay button */}
      <View className="border-t border-fog-200 bg-cream px-5 py-4 dark:border-cream/10 dark:bg-pine">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handlePay}
          disabled={bookingLoading}
          className="items-center rounded-full bg-mustard py-4"
        >
          <Text className="text-base font-bold text-pine">
            {bookingLoading
              ? "Creating Booking..."
              : `Pay ₹${total.toFixed(2)}`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function ProviderRow({ icon, label, value, bold, last, iconColor }) {
  return (
    <View className={`flex-row items-center gap-2.5 ${last ? "" : "mb-2.5"}`}>
      {icon ? (
        <Ionicons
          name={icon}
          size={15}
          color={iconColor}
          style={{ opacity: 0.5, width: 18 }}
        />
      ) : (
        <View style={{ width: 18 }} />
      )}
      <Text className="w-[70px] text-[13px] text-ink/50 dark:text-cream/50">
        {label}
      </Text>
      <Text
        className={`flex-1 text-[15px] ${
          bold
            ? "font-bold text-pine dark:text-cream"
            : "text-pine/80 dark:text-cream/80"
        }`}
      >
        {value}
      </Text>
    </View>
  );
}

function SummaryRow({ label, value, pill }) {
  return (
    <View className="mb-2.5 flex-row items-center justify-between">
      <Text className="text-[15px] text-pine dark:text-cream">{label}:</Text>
      {pill ? (
        <View className="rounded-lg bg-clay/10 px-3 py-1.5">
          <Text className="text-sm font-semibold text-pine dark:text-cream">
            {value}
          </Text>
        </View>
      ) : (
        <Text className="text-sm font-semibold text-pine dark:text-cream">
          {value}
        </Text>
      )}
    </View>
  );
}

function PriceRow({ label, amount, bold }) {
  return (
    <View className="mb-1.5 flex-row items-center justify-between">
      <Text
        className={`text-[15px] ${
          bold
            ? "font-extrabold text-pine dark:text-cream"
            : "text-pine/70 dark:text-cream/70"
        }`}
      >
        {label}
      </Text>
      <Text
        className={`text-[15px] ${
          bold
            ? "font-extrabold text-pine dark:text-cream"
            : "text-pine/70 dark:text-cream/70"
        }`}
      >
        ₹{Number(amount || 0).toFixed(2)}
      </Text>
    </View>
  );
}

function DetailField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
  last,
}) {
  return (
    <View className={last ? "" : "mb-4"}>
      <Text className="mb-1.5 text-[13px] font-semibold text-ink/50 dark:text-cream/50">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#1F3D2B55"
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
        textAlignVertical={multiline ? "top" : "center"}
        className={`rounded-xl border border-pine/15 bg-fog-50 px-4 py-3.5 text-[15px] text-pine dark:bg-ink dark:text-cream ${
          multiline ? "h-24" : ""
        }`}
      />
    </View>
  );
}
