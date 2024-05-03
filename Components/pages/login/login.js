import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, Alert, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import urls from "../../utils/urls";
import {setUsertoken, getUsertoken} from "../../utils/localStorageUtils.js"


const Login = () => {
  const navigation = useNavigation();

  const [useremail, setUseremail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() =>{
    getUsertoken().then((res) => {
      if (res == null){ // 저장된 유저 토큰이 없음
        console.log("로그인 토큰 없음. 로그인 화면 진행")
        return;
      }
      console.log("현재 로그인 " + res);
      navigation.navigate("Home", { screen: "Home" });
    });
    
  }, []);

  const handleLogin = () => {
    fetchLoginInfo();
    navigation.navigate("Home", { screen: "Home" });
  };

  const fetchLoginInfo = async () => {
    fetch(`${urls.springUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: useremail,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setUsertoken(data['token']);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.HomeText}>로그인 화면</Text>

      <TextInput
        style={styles.inputbox}
        value={useremail}
        placeholder="Email"
        onChangeText={setUseremail}
      ></TextInput>
      <TextInput
        style={styles.inputbox}
        value={password}
        placeholder="Password"
        onChangeText={setPassword}
        secureTextEntry
      ></TextInput>

      <TouchableOpacity onPress={handleLogin} style={styles.Inputbotton}>
        <Text style={styles.BottomText}>로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("SocialLogin", { screen: "SocialLogin" })
        }
        style={styles.Inputbotton}
      >
        <Text style={styles.BottomText}>소셜 로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Signup", { screen: "Signup" })}
        style={styles.NextBottom}
      >
        <Text style={styles.BottomText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
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
  inputbox: {
    width: "50%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
});