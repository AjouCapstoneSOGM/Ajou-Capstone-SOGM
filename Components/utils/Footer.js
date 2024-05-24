import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const Footer = () => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity
        onPress={() => alert("홈으로 이동!")}
        style={styles.button}
      >
        <Text>홈</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => alert("설정으로 이동!")}
        style={styles.button}
      >
        <Text>설정</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => alert("프로필로 이동!")}
        style={styles.button}
      >
        <Text>프로필</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 50,
    backgroundColor: "#f8f8f8",
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    padding: 10,
  },
});

export default Footer;
