import { View } from "react-native";
import Header from "../components/header";

export default function Home() {
  return (
    <View className="flex-1 bg-cream">
      <Header userName="Alex Rivera" />
      {/* rest of the screen content */}
    </View>
  );
}
