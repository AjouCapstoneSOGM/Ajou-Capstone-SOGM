import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "@rneui/base";
import AppText from "./AppText";
import { useAuth } from "./AuthContext";
import { useNavigation } from "@react-navigation/native";
import { height, width } from "./utils";
import { usePortfolio } from "./PortfolioContext";

const HeaderComponent = () => {
  const { isLoggedIn, userName } = useAuth();
  const { rebalances } = usePortfolio();
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {isLoggedIn && (
        <AppText>
          <AppText style={[styles.title, { fontWeight: "bold" }]}>
            {userName}
          </AppText>
          <AppText style={styles.title}>님 안녕하세요!</AppText>
        </AppText>
      )}
      {!isLoggedIn && (
        <Button
          titleStyle={{ fontSize: 20, color: "#333" }}
          title="로그인"
          type="clear"
          onPress={() => {
            navigation.navigate("Login");
          }}
        />
      )}
      <View style={styles.buttonContainer}>
        {isLoggedIn && (
          <View>
            <Button
              type="clear"
              onPress={() => {
                navigation.navigate("AlertList");
              }}
              icon={{
                name: "bell-fill",
                type: "octicon",
                color: rebalances.length > 0 ? "#ffa800" : "#333",
              }}
            />
            {rebalances.length > 0 && <View style={styles.redDot}></View>}
          </View>
        )}
        <Button
          type="clear"
          onPress={() => {
            navigation.navigate("Settings");
          }}
          icon={{ name: "settings-sharp", type: "ionicon", color: "#333" }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: height * 60,
    backgroundColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: width * 15,
  },
  title: {
    fontSize: 20,
  },
  leftContainer: {
    flexDirection: "row",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  redDot: {
    position: "absolute",
    right: "30%",
    top: "10%",
    height: 7,
    width: 7,
    backgroundColor: "red",
    borderRadius: 30,
  },
});

export default HeaderComponent;
