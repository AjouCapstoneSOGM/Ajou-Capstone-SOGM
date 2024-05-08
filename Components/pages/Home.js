import React, { useEffect, useState } from "react";
import { View, Button, StyleSheet, Text, Touchable } from "react-native";
import { getUsertoken, removeUsertoken } from "../utils/localStorageUtils.js";
import { useAuth } from "../utils/AuthContext.js";
import { TouchableOpacity } from "react-native-gesture-handler";
import PortfolioList from "./ViewPortfolio.js";
import { setCustomText } from "react-native-global-props";
import * as Font from "expo-font";
import Icon from "react-native-vector-icons/AntDesign";

const Home = ({ navigation }) => {
  const [isFont, setIsFont] = useState(false);
  const { isLoggedIn, logout } = useAuth();

  const setLogout = () => {
    removeUsertoken();
    logout();
  };

  const getToken = async () => {
    const token = await getUsertoken();
    console.log(token);
  };

  useEffect(() => {
    const loadFont = async () => {
      await Font.loadAsync({
        pretendard: require("../assets/fonts/Pretendard-Medium.ttf"),
      });
      setIsFont(true);
    };
    loadFont();
  }, []);

  if (!isFont) {
    return null;
  }

  const customTextProps = {
    style: {
      fontFamily: "pretendard",
    },
  };
  setCustomText(customTextProps);

  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        {isLoggedIn ? (
          <View style={styles.userInfo}>
            <Text style={{ fontSize: 18, color: "white" }}>
              안녕하세요 테스트님
            </Text>
            <Button title="로그아웃" onPress={setLogout} />
          </View>
        ) : (
          <View style={styles.userInfo}>
            <Button
              title="로그인"
              onPress={() => navigation.navigate("Login")}
            />
          </View>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <Text style={{ fontSize: 18, alignSelf: "flex-start", color: "white" }}>
          나의 포트폴리오
        </Text>
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          onPress={() => navigation.navigate("MakePortfolio")}
        >
          <Text style={{ fontSize: 16, color: "white" }}>생성하기</Text>
          <Icon
            style={{ alignSelf: "center", marginHorizontal: 4 }}
            name="right"
            size={15}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.portfolioContainer}>
        {isLoggedIn ? (
          <PortfolioList navigation={navigation}></PortfolioList>
        ) : (
          <Text>로그인 필요</Text>
        )}
      </View>
      {/* <Button title="토큰 확인" onPress={() => getToken()} />
      <Button
        title="뉴스 테스트"
        onPress={() => navigation.navigate("NewsSummary", { ticker: "005930" })}
      /> */}
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
  userContainer: {
    flex: 1.5,
    justifyContent: "center",
    alignItems: "stretch",
  },
  userInfo: {
    height: 180,
    backgroundColor: "#6495ED",
    justifyContent: "center",
    alignItems: "stretch",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4, // 상자 그림자로 입체감 주기
    padding: 18,
    margin: 10,
  },
  portfolioContainer: {
    flex: 2.5,
    justifyContent: "flex-start",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#6495ED",
    alignItems: "stretch",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4, // 상자 그림자로 입체감 주기
    padding: 13,
    marginHorizontal: 10,
  },
  buttonLowerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#777",
  },
  button: {
    width: 150,
    alignItems: "center",
  },
});
export default Home;
