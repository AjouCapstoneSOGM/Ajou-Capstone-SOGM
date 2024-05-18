import React from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import { removeUsertoken } from "../utils/localStorageUtils.js";
import { useAuth } from "../utils/AuthContext.js";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

import PortfolioList from "./portfolio/ViewPortfolio.js";
import Icon from "react-native-vector-icons/AntDesign";
import AppText from "../utils/AppText.js";
import { usePortfolio } from "../utils/PortfolioContext.js";

const Home = ({ navigation }) => {
  const { isLoggedIn, logout } = useAuth();
  const { removePortfolios } = usePortfolio();

  const setLogout = () => {
    removeUsertoken();
    removePortfolios();
    logout();
  };

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <View style={styles.userContainer}>
          <AppText style={{ fontSize: 18, color: "white" }}>
            안녕하세요 테스트님
          </AppText>
          <Button title="로그아웃" onPress={setLogout} />
        </View>
      ) : (
        <View style={styles.userContainer}>
          <Button title="로그인" onPress={() => navigation.navigate("Login")} />
        </View>
      )}
      <View style={styles.buttonContainer}>
        <AppText
          style={{
            fontSize: 18,
            alignSelf: "flex-start",
            color: "white",
          }}
        >
          나의 포트폴리오
        </AppText>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => navigation.navigate("MakePortfolio")}
        >
          <AppText style={{ fontSize: 18, color: "white" }}>생성하기</AppText>
          <Icon
            style={{ alignSelf: "center", marginHorizontal: 4 }}
            name="right"
            size={15}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {isLoggedIn ? (
          <PortfolioList navigation={navigation}></PortfolioList>
        ) : (
          <View style={styles.errorContent}>
            <AppText style={{ fontSize: 17 }}>
              로그인이 필요한 서비스입니다
            </AppText>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    padding: 5,
    backgroundColor: "#f5f5f5",
  },
  errorContent: {
    height: 140,
    backgroundColor: "#e5e5e5",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: 10,
  },
  userContainer: {
    height: 180,
    backgroundColor: "#6495ED",
    justifyContent: "space-evenly",
    alignItems: "center",
    borderRadius: 5,
    padding: 18,
    marginVertical: 40,
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#6495ED",
    alignItems: "stretch",
    borderRadius: 5,
    padding: 13,
    marginHorizontal: 10,
  },
});
export default Home;
