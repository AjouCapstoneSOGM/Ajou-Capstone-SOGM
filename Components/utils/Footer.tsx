import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Button } from "@rneui/themed";
import {
  useNavigation,
  useNavigationState,
  NavigationProp,
} from "@react-navigation/native";
import { useAuth } from "./AuthContext";
import { height, width } from "./utils";
import { usePortfolio } from "./PortfolioContext";
import { RootStackParamList } from "../types/Navigations";

type NavigationProps = NavigationProp<RootStackParamList>;

const FooterComponent = () => {
  const navigation = useNavigation<NavigationProps>();
  const state = useNavigationState((state) => state);
  const currentRoute = state.routes[state.index];
  const { isLoggedIn } = useAuth();
  const { portfolios } = usePortfolio();

  const isPortfolioExist = (): boolean => {
    if (portfolios?.length > 0) return true;
    else return false;
  };

  const getButtonStyle = (page: string): ViewStyle => {
    const baseStyle = styles.buttonContainer;
    if (currentRoute.name === page) {
      return { ...baseStyle, backgroundColor: "#F0F0F0" };
    }
    return baseStyle;
  };

  return (
    <View style={styles.footer}>
      <Button
        containerStyle={getButtonStyle("MyPage")}
        buttonStyle={styles.footerButton}
        titleStyle={
          currentRoute.name == "MyPage"
            ? styles.selectedTitle
            : styles.buttonTitle
        }
        title="내 정보"
        type="clear"
        onPress={() => {
          isLoggedIn
            ? navigation.navigate("MyPage")
            : navigation.navigate("Login");
        }}
        icon={{
          name: "user",
          type: "font-awesome",
          color: currentRoute.name == "MyPage" ? "#333" : "#f0f0f0",
        }}
      />
      <Button
        containerStyle={getButtonStyle("Home")}
        buttonStyle={styles.footerButton}
        titleStyle={
          currentRoute.name == "Home"
            ? styles.selectedTitle
            : styles.buttonTitle
        }
        title="홈"
        type="clear"
        onPress={() => {
          navigation.navigate("Home");
        }}
        icon={{
          name: "home",
          type: "font-awesome",
          color: currentRoute.name == "Home" ? "#333" : "#f0f0f0",
        }}
      />
      <Button
        containerStyle={getButtonStyle("ViewPortfolio")}
        buttonStyle={styles.footerButton}
        titleStyle={
          currentRoute.name == "ViewPortfolio"
            ? styles.selectedTitle
            : styles.buttonTitle
        }
        title="포트폴리오"
        type="clear"
        onPress={() => {
          isLoggedIn
            ? isPortfolioExist()
              ? navigation.navigate("ViewPortfolio")
              : navigation.navigate("MakePortfolio")
            : navigation.navigate("Login");
        }}
        icon={{
          name: "piechart",
          type: "antdesign",
          color: currentRoute.name == "ViewPortfolio" ? "#333" : "#f0f0f0",
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    alignItems: "stretch",
    height: height * 60,
    backgroundColor: "#333",
    position: "absolute",
    bottom: height * 0,
    right: width * 0,
    left: width * 0,
  },
  buttonContainer: {
    flex: 1,
  },
  footerButton: {
    flex: 1,
    flexDirection: "column",
  },
  buttonTitle: {
    color: "#f0f0f0",
  },
  selectedTitle: {
    color: "#333",
  },
});

export default FooterComponent;
