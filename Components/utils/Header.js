import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "@rneui/base";
import AppText from "./AppText";
import { useAuth } from "./AuthContext";
import { useNavigation } from "@react-navigation/native";

const HeaderComponent = () => {
  const { isLoggedIn } = useAuth();
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      {isLoggedIn && (
        <AppText>
          <AppText
            style={[styles.title, { fontWeight: "bold" }]}
          >{`${"테스트"}`}</AppText>
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
          <Button
            type="clear"
            onPress={() => {
              navigation.navigate("AlertList");
            }}
            icon={{ name: "bell-fill", type: "octicon", color: "#333" }}
          />
        )}
        <Button
          type="clear"
          onPress={() => {}}
          icon={{ name: "settings-sharp", type: "ionicon", color: "#333" }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 10,
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
});

export default HeaderComponent;
