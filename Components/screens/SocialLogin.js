import React, { useState } from "react";
/*
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
*/
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const SocialLogin = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>



    
      <Text style={styles.HomeText}>소셜 로그인 화면</Text>
      <TouchableOpacity
          onPress={() => navigation.navigate("Login", { screen: 'Login' })}
          style={styles.NextBottom}
        >
          <Text style={styles.BottomText}>돌아가기</Text>
      </TouchableOpacity>
    </View>
  )
}

export default SocialLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: '#fff',
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
    color: 'white',
    textAlign: "center",
  },
  Inputbotton: {
    backgroundColor: "purple",
    width: "50%",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10
  },
  inputbox: {
    width: "50%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10
  }
})