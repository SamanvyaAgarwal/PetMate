import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Image } from "expo-image";
import { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ---------- Shared label ----------
export function FieldLabel({ children, required }) {
  return (
    <Text className="mb-2 text-xs font-bold uppercase tracking-widest text-pine/60">
      {children}
      {required && <Text className="text-clay"> *</Text>}
    </Text>
  );
}

// ---------- Dropdown-style field (opens an external picker, e.g. OptionPickerModal) ----------
export function DropdownField({
  label,
  required,
  value,
  placeholder,
  onPress,
}) {
  return (
    <View className="mb-5">
      <FieldLabel required={required}>{label}</FieldLabel>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className="flex-row items-center justify-between rounded-xl border border-pine/10 bg-white px-4 py-3.5"
      >
        <Text
          className={value ? "text-base text-pine" : "text-base text-pine/40"}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#1F3D2B" />
      </TouchableOpacity>
    </View>
  );
}

// ---------- Date field with native picker ----------
export function DateField({
  label,
  required,
  value,
  onChangeText,
  placeholder = "Select date",
}) {
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const handleChange = (event, selectedDate) => {
    if (Platform.OS === "android") setShowPicker(false);
    if (event.type === "dismissed") return;
    if (selectedDate) onChangeText(formatDate(selectedDate));
  };

  return (
    <View className="mb-5">
      <FieldLabel required={required}>{label}</FieldLabel>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
        className="flex-row items-center justify-between rounded-xl border border-pine/10 bg-white px-4 py-3.5"
      >
        <Text
          className={value ? "text-base text-pine" : "text-base text-pine/40"}
        >
          {value || placeholder}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#1F3D2B" />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          maximumDate={new Date()}
          onChange={handleChange}
        />
      )}
      {Platform.OS === "ios" && showPicker && (
        <TouchableOpacity
          onPress={() => setShowPicker(false)}
          className="mt-2 items-center rounded-full bg-mustard/20 py-2.5"
        >
          <Text className="font-semibold text-clay">Done</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ---------- Multiline text area ----------
export function TextAreaField({
  label,
  required,
  value,
  onChangeText,
  placeholder,
}) {
  return (
    <View className="mb-5">
      <FieldLabel required={required}>{label}</FieldLabel>
      <View className="rounded-xl border border-pine/10 bg-white px-4 py-3.5">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#1F3D2B55"
          multiline
          numberOfLines={4}
          className="text-base text-pine"
          style={{ minHeight: 90, textAlignVertical: "top" }}
        />
      </View>
    </View>
  );
}

// ---------- Image upload with thumbnails ----------
export function ImageUploadField({ images = [], onAdd, onRemove }) {
  return (
    <View className="mb-5">
      <FieldLabel>Photos</FieldLabel>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          onPress={onAdd}
          activeOpacity={0.7}
          className="mr-3 h-24 w-24 items-center justify-center rounded-xl border border-dashed border-pine/25 bg-white"
        >
          <Ionicons name="camera-outline" size={26} color="#D9A441" />
          <Text className="mt-1 text-[11px] font-semibold text-pine/60">
            Add Photo
          </Text>
        </TouchableOpacity>

        {images.map((uri, index) => (
          <View key={`${uri}-${index}`} className="relative mr-3">
            <Image
              source={{ uri }}
              style={{ width: 96, height: 96, borderRadius: 12 }}
              contentFit="cover"
            />
            <TouchableOpacity
              onPress={() => onRemove(index)}
              activeOpacity={0.7}
              className="absolute -right-1.5 -top-1.5 h-6 w-6 items-center justify-center rounded-full bg-clay"
            >
              <Ionicons name="close" size={14} color="#FBF3E7" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

// ---------- Bottom-sheet option picker ----------
export function OptionPickerModal({
  visible,
  title,
  options,
  selected,
  onSelect,
  onClose,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-pine/40">
        <Pressable className="absolute inset-0" onPress={onClose} />

        <View className="max-h-[70%] rounded-t-3xl bg-cream pb-6 pt-2">
          <View className="items-center py-3">
            <View className="h-1.5 w-12 rounded-full bg-pine/10" />
          </View>

          <Text className="px-6 pb-3 text-lg font-extrabold text-pine">
            {title}
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                activeOpacity={0.7}
                onPress={() => onSelect(option)}
                className="flex-row items-center justify-between px-6 py-3.5"
              >
                <Text className="text-base text-pine">{option}</Text>
                {selected === option && (
                  <Ionicons name="checkmark" size={18} color="#D9A441" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
