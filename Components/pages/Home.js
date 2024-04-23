import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Home Page</Text>
      <Button
        title="나의 포트폴리오"
        onPress={() => navigation.navigate("ViewPortfolio")}
      />
      <Button
        title="포트폴리오 생성"
        onPress={() => navigation.navigate("MakePortfolio")}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
});
export default Home;
