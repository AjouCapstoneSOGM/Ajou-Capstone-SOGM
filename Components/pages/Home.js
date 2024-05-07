import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { getUsertoken, removeUsertoken } from "../utils/localStorageUtils.js";
import { useAuth } from "../utils/AuthContext.js";
const Home = ({ navigation }) => {
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
      {isLoggedIn ? (
        <View>
          <Button
            title="나의 포트폴리오"
            onPress={() => navigation.navigate("ViewPortfolio")}
          />
          <Button
            title="포트폴리오 생성"
            onPress={() => navigation.navigate("MakePortfolio")}
          />
          <Button title="로그아웃" onPress={setLogout} />
        </View>
      ) : (
        <View>
          <Button title="로그인" onPress={() => navigation.navigate("Login")} />
        </View>
      )}
      <Button title="토큰 확인" onPress={() => getToken()} />
      <Button
        title="뉴스 테스트"
        onPress={() => navigation.navigate("NewsSummary", { ticker: "005930" })}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
});
export default Home;
