import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SocialLogin = () => {
  const navigation = useNavigation();

  return (
    <View style={Styles.container}>
      <Text style={Styles.HomeText}>소셜 로그인 화면</Text>

      <TouchableOpacity style={Styles.Inputbotton}>
        <Text style={Styles.BottomText}>네이버로 로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity style={Styles.Inputbotton}>
        <Text style={Styles.BottomText}>구글로 로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Login", { screen: "Login" })}
        style={Styles.NextBottom}
      >
        <Text style={Styles.BottomText}>돌아가기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SocialLogin;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  HomeText: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: "10%",
  },
  NextBottom: {
    backgroundColor: "purple",
    padding: 10,
    marginTop: "10%",
    width: "50%",
    alignSelf: "center",
    borderRadius: 10,
  },
  BottomText: {
    fontSize: 15,
    color: "white",
    textAlign: "center",
  },
  Inputbotton: {
    backgroundColor: "purple",
    width: "50%",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  Input: {
    width: "50%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
});
