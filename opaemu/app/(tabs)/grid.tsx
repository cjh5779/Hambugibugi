import { View, Text, FlatList, StyleSheet } from "react-native";

export default function GridScreen() {
  const data = Array.from({ length: 12 }, (_, i) => i); // 0~11 임시 데이터

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        numColumns={2}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <View style={styles.box}>
            <Text style={styles.boxText}>#{item}</Text>
          </View>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  list: {
    padding: 10,
  },
  box: {
    flex: 1,
    aspectRatio: 1, // 정사각형
    margin: 8,
    backgroundColor: "#e5e5e5", // 회색 배경
    borderWidth: 2,
    borderColor: "#e5e5e5", // 회색 테두리
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  boxText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
