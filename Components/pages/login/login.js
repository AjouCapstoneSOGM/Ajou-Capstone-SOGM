import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { Divider } from "react-native-elements";

import urls from "../../utils/urls";
import { setUserName, setUsertoken } from "../../utils/localStorageUtils.js";
import { useAuth } from "../../utils/AuthContext.js";
import AppText from "../../utils/AppText.js";
import { usePortfolio } from "../../utils/PortfolioContext.js";
import Loading from "../../utils/Loading.js";
import { usePushNotifications } from "../../utils/PushNotificationContext.js";
import { width, height } from "../../utils/utils";

const Login = ({ navigation }) => {
  const [useremail, setUseremail] = useState(""); //
  const [password, setPassword] = useState(""); //
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { loadData } = usePortfolio();
  const { expoPushToken } = usePushNotifications();

  const fetchLoginInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${urls.springUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: useremail,
          password: password,
          expoPushToken: expoPushToken,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        await setUsertoken(data.token);
        await setUserName(data.name);
        login();
        await loadData();
        setLoading(false);
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const handleSocialLogin = () => {
    setLoading(true);
    navigation.navigate("SocialLogin");

    const unsubscribe = navigation.addListener("focus", () => {
      login();
      loadData();
      setLoading(false);
      navigation.goBack();
      unsubscribe();
    });
  };

  if (loading) return <Loading />;
  return (
    <View style={styles.container}>
      <View style={styles.textWrapper}>
        <View style={styles.textContainer}>
          <AppText style={styles.largeText}>E </AppText>
          <AppText style={styles.smallText}>asiest</AppText>
        </View>
        <View style={styles.textContainer}>
          <AppText style={styles.largeText}>T </AppText>
          <AppText style={styles.smallText}>rading</AppText>
        </View>
        <View style={styles.textContainer}>
          <AppText style={styles.largeText}>A </AppText>
          <AppText style={styles.smallText}>ssistance</AppText>
        </View>
      </View>
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
      <View style={styles.loginButtonContainer}>
        <TouchableOpacity onPress={fetchLoginInfo} style={styles.loginButton}>
          <AppText style={styles.buttonText}>로그인</AppText>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonWrapper}>
        <TouchableOpacity
          onPress={fetchLoginInfo}
          style={styles.passwordButton}
        >
          <AppText style={styles.buttonText}>비밀번호 찾기</AppText>
        </TouchableOpacity>
        <View style={styles.dividerWrapper}>
          <Divider style={styles.divider} />
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("Signup")}
          style={styles.signupButton}
        >
          <AppText style={styles.buttonText}>회원가입</AppText>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleSocialLogin} style={styles.socialButton}>
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
    backgroundColor: "#333",
  },
  HomeText: {
    paddingBottom: "15%",
    fontSize: 30,
    textAlign: "center",
    color: "white",
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: height * -10,
  },
  textWrapper: {
    alignItems: "flex-start",
    marginLeft: width * 70,
  },
  buttonWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  dividerWrapper: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  inputContainer: {
    alignItems: "stretch",
    padding: width * 15,
    paddingHorizontal: width * 20,
    paddingBottom: height * 10,
  },
  loginButtonContainer: {
    alignItems: "stretch",
    justifyContent: "center",
    paddingVertical: height,
    paddingHorizontal: width * 30,
  },
  inputBox: {
    backgroundColor: "#eee",
    padding: 10,
    marginVertical: height * 5,
    marginHorizontal: 10,
    borderRadius: 40,
  },
  passwordButton: {
    backgroundColor: "transparent",
    marginVertical: height * 5,
    marginLeft: width * -30,
    marginHorizontal: width * 0,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  signupButton: {
    backgroundColor: "transparent",
    marginVertical: height * 5,
    marginLeft: width * 80,
    borderRadius: 30,
    alignItems: "flex-end",
    justifyContent: "flex-end",
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
  divider: {
    width: 1,
    height: height * 40,
    backgroundColor: "gray",
    marginHorizontal: 10,
  },
  loginButton: {
    backgroundColor: "#6495ed",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 40,
  },
  largeText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#6495ed",
  },
  smallText: {
    fontSize: 20,
    color: "white",
  },
});
