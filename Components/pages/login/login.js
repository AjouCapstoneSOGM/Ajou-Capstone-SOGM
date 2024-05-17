import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import urls from "../../utils/urls";
import { setUsertoken } from "../../utils/localStorageUtils.js";
import { useAuth } from "../../utils/AuthContext.js";
import AppText from "../../utils/AppText.js";

const Login = ({ navigation }) => {
  const [useremail, setUseremail] = useState("test@test.com");
  const [password, setPassword] = useState("1234");
  const { login } = useAuth();

  const fetchLoginInfo = async () => {
    try {
      const response = await fetch(`${urls.springUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: useremail,
          password: password,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setUsertoken(data.token);
        login();
        navigation.navigate("Home", { screen: "Home" });
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      <AppText style={styles.HomeText}>로그인</AppText>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputBox}
          value={useremail}
          placeholder="이메일"
          onChangeText={setUseremail}
        ></TextInput>
        <TextInput
          style={styles.inputBox}
          value={password}
          placeholder="비밀번호"
          onChangeText={setPassword}
          secureTextEntry
        ></TextInput>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={fetchLoginInfo} style={styles.button}>
          <AppText style={styles.buttonText}>로그인</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Signup")}
          style={styles.button}
        >
          <AppText style={styles.buttonText}>회원가입</AppText>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("SocialLogin", { screen: "SocialLogin" })
        }
        style={styles.socialButton}
      >
        <Image
          source={require("../../assets/images/kakao_login_medium_wide.png")}
          style={styles.image}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    backgroundColor: "#fff",
  },
  HomeText: {
    paddingBottom: "15%",
    fontSize: 30,
    textAlign: "center",
  },
  inputContainer: {
    alignItems: "stretch",
    padding: 20,
    paddingBottom: 10,
  },
  buttonContainer: {
    alignItems: "stretch",
    padding: 20,
    paddingTop: 10,
  },
  inputBox: {
    backgroundColor: "#eee",
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#6495ED",
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  socialButton: {
    alignSelf: "center",
    marginTop: 20,
    marginBottom: "25%",
  },
  buttonText: {
    color: "white",
    fontSize: 17,
  },
});
