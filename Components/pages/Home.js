import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import urls from "../utils/urls";

function Home({ navigation }) {
  const testFetch = async () => {
    fetch(`${urls.fastapiUrl}/getInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        test: "test",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
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
      <Button title="로그인" onPress={() => navigation.navigate("Login")} />
      <Button title="요청 테스트용" onPress={() => testFetch()} />
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
