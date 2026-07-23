import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DAYS_TO_SHOW = 7;

const SLOT_PERIODS = [
  {
    key: "morning",
    label: "Morning",
    icon: "sunny-outline",
    tint: "bg-mustard/10",
    hours: [9, 10, 11],
  },
  {
    key: "afternoon",
    label: "Afternoon",
    icon: "sunny",
    tint: "bg-clay/10",
    hours: [12, 13, 14, 15],
  },
  {
    key: "evening",
    label: "Evening",
    icon: "moon-outline",
    tint: "bg-pine/10",
    hours: [16, 17, 18, 19, 20],
  },
];

function formatHour(hour) {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(displayHour).padStart(2, "0")}:00${period}`;
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getNextDays(count) {
  const days = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function AppointmentTimeSlotScreen() {
  // Was: only { category, petId, serviceId } — silently dropped the
  // vendorId/vendorName/serviceTitle that vendors.jsx already sends here,
  // so order-summary.jsx had nothing to show for "Package" / provider name.
  const {
    category,
    pet_uid,
    service_uid,
    serviceTitle,
    vendor_uid,
    vendorName,
  } = useLocalSearchParams();

  const petUid = Array.isArray(pet_uid) ? pet_uid[0] : pet_uid;
  const serviceUid = Array.isArray(service_uid) ? service_uid[0] : service_uid;
  const vendorUid = Array.isArray(vendor_uid) ? vendor_uid[0] : vendor_uid;

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const iconColor = isDark ? "#FBF3E7" : "#1F3D2B";

  const days = useMemo(() => getNextDays(DAYS_TO_SHOW), []);
  const [selectedDate, setSelectedDate] = useState(days[0]);
  const [selectedTime, setSelectedTime] = useState(null);

  const now = new Date();
  const isToday = isSameDay(selectedDate, now);

  // Build periods with hours filtered: if selected day is today, drop any hour
  // at or before the current hour so only upcoming slots remain.
  const periods = useMemo(() => {
    return SLOT_PERIODS.map((period) => {
      const hours = isToday
        ? period.hours.filter((hour) => hour > now.getHours())
        : period.hours;
      return { ...period, hours };
    });
  }, [selectedDate, isToday]);

  const hasAnySlotsToday = periods.some((p) => p.hours.length > 0);

  const handleSelectDate = (date) => {
    setSelectedDate(date);
    setSelectedTime(null); // reset time when day changes
  };

  const handleContinue = () => {
    if (!selectedTime) return;
    // Was: pushed to "/booking-confirm". Now goes to the new order-summary
    // checkout screen, forwarding along the vendor/service context this
    // screen already had in its params but wasn't using.
    router.push({
      pathname: "/order-summary",
      params: {
        category,
        pet_uid: petUid,
        service_uid: serviceUid,
        vendor_uid: vendorUid,
        serviceTitle,
        vendorName,
        booking_date: selectedDate.toISOString(),
        booking_time: selectedTime,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-pine" edges={["top"]}>
      {/* Top bar */}
      <View className="relative flex-row items-center justify-center border-b border-fog-200 bg-cream px-4 py-3.5 dark:border-cream/10 dark:bg-pine">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="absolute left-3 z-10 h-9 w-9 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={26} color={iconColor} />
        </TouchableOpacity>
        <Text className="text-[17px] font-semibold text-pine dark:text-cream">
          Select Time Slot
        </Text>
      </View>

      <ScrollView
        className="flex-1 bg-fog-50 dark:bg-ink"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Day selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 16,
            gap: 10,
          }}
        >
          {days.map((date, index) => {
            const active = isSameDay(date, selectedDate);
            const weekday = date.toLocaleDateString("en-US", {
              weekday: "short",
            });
            const month = date.toLocaleDateString("en-US", { month: "short" });
            const dayNum = date.getDate();
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                onPress={() => handleSelectDate(date)}
                className={`items-center rounded-2xl border px-5 py-3.5 ${
                  active
                    ? "border-mustard bg-mustard/20"
                    : "border-fog-200 bg-cream dark:border-cream/10 dark:bg-pine"
                }`}
              >
                <Text
                  className={`text-base font-bold ${
                    active
                      ? "text-pine dark:text-cream"
                      : "text-pine dark:text-cream"
                  }`}
                >
                  {weekday}
                </Text>
                <Text className="mt-0.5 text-sm text-pine/60 dark:text-cream/60">
                  {index === 0 ? `${month} ${dayNum}` : month}
                  {index !== 0 && index < 3 ? "" : ""}
                </Text>
                {index !== 0 && (
                  <Text className="text-sm text-pine/60 dark:text-cream/60">
                    {dayNum}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Time slot sections */}
        <View className="px-4">
          {periods.map((period) => (
            <View
              key={period.key}
              className={`mb-5 overflow-hidden rounded-2xl ${period.tint}`}
            >
              <View className="flex-row items-center gap-2 px-4 pt-4">
                <Ionicons name={period.icon} size={20} color="#D9A441" />
                <Text className="text-lg font-bold text-pine dark:text-cream">
                  {period.label}
                </Text>
              </View>

              {period.hours.length === 0 ? (
                <Text className="px-4 pb-5 pt-3 text-sm text-pine/50 dark:text-cream/50">
                  No slots available
                </Text>
              ) : (
                <View className="flex-row flex-wrap gap-3 px-4 pb-5 pt-3">
                  {period.hours.map((hour) => {
                    const label = formatHour(hour);
                    const active = selectedTime === label;
                    return (
                      <TouchableOpacity
                        key={hour}
                        activeOpacity={0.7}
                        onPress={() => setSelectedTime(label)}
                        className={`rounded-xl border px-4 py-3 ${
                          active
                            ? "border-mustard bg-mustard"
                            : "border-pine/30 bg-cream dark:border-cream/20 dark:bg-pine"
                        }`}
                      >
                        <Text
                          className={`text-sm font-semibold ${
                            active ? "text-pine" : "text-pine dark:text-cream"
                          }`}
                        >
                          {label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          ))}

          {isToday && !hasAnySlotsToday && (
            <View className="items-center py-8">
              <Ionicons name="time-outline" size={32} color={iconColor} />
              <Text className="mt-3 text-center text-sm text-pine/60 dark:text-cream/60">
                No more slots available today.{"\n"}Try selecting another day
                above.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Continue button */}
      <View className="border-t border-fog-200 bg-cream px-5 py-4 dark:border-cream/10 dark:bg-pine">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleContinue}
          disabled={!selectedTime}
          className={`items-center rounded-full py-4 ${
            selectedTime ? "bg-mustard" : "bg-mustard/40"
          }`}
        >
          <Text className="text-base font-bold text-pine">Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
