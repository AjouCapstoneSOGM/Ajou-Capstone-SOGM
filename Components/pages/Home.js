import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { getUsertoken, removeUsertoken } from "../utils/localStorageUtils.js";
import { useAuth } from "../utils/AuthContext.js";
function Home({ navigation }) {
  const { isLoggedIn, logout } = useAuth();

  const setLogout = () => {
    removeUsertoken();
    logout();
  };

  const getToken = async () => {
    const token = await getUsertoken();
    console.log(token);
  };
  return (
    <View style={styles.container}>
      <Button
        title="나의 포트폴리오"
        onPress={() => navigation.navigate("ViewPortfolio")}
      />
      <Button
        title="포트폴리오 생성"
        onPress={() => navigation.navigate("MakePortfolio")}
      />
      {isLoggedIn ? (
        <Button title="로그아웃" onPress={setLogout} />
      ) : (
        <Button title="로그인" onPress={() => navigation.navigate("Login")} />
      )}
      <Button title="토큰 확인" onPress={() => getToken()} />
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
