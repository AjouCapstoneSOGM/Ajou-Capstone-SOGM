import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";

const FooterComponent = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.footer}>
      <View style={styles.buttonContainer}>
        <Button
          buttonStyle={styles.footerButton}
          titleStyle={styles.buttonTitle}
          title="내 정보"
          type="clear"
          onPress={() => {}}
          icon={{ name: "user", type: "font-awesome", color: "white" }}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          buttonStyle={styles.footerButton}
          titleStyle={styles.buttonTitle}
          title="홈"
          type="clear"
          onPress={() => {
            navigation.navigate("Home");
          }}
          icon={{ name: "home", type: "font-awesome", color: "white" }}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          buttonStyle={styles.footerButton}
          titleStyle={styles.buttonTitle}
          title="포트폴리오"
          type="clear"
          onPress={() => {
            navigation.navigate("ViewPortfolio");
          }}
          icon={{ name: "piechart", type: "antdesign", color: "white" }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 70,
    backgroundColor: "#333",
    borderTopColor: "#e1e1e1",
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttonContainer: {
    flex: 1,
  },
  footerButton: {
    flexDirection: "column",
  },
  buttonTitle: {
    color: "#fff",
  },
});

export default FooterComponent;
