import { View, Text, Button } from "react-native";
import { Link } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>오늘의 패션 홈</Text>
      <Link href="/(tabs)/grid" asChild>
        <Button title="코디 보러가기" />
      </Link>
    </View>
  );
}
