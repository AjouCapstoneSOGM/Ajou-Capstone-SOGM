import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import urls from "../../utils/urls";
import AppText from "../../utils/AppText";

const Signup = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [useremail, setUseremail] = useState("");
  const [password, setPassword] = useState("");
  const [pwcheck, setpwcheck] = useState("");

  const [checkEmail, setCheckEmail] = useState("");
  const [checkPw, setCheckPw] = useState("");
  const [checkPwLen, setCheckPwLen] = useState("");

  const MinPasswordLength = 10;

  const fetchSignupInfo = async () => {
    fetch(`${urls.springUrl}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: useremail,
        password: password,
        name: username,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  const isEmailValid = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const isValueValid = () => {
    if (username && checkEmail && checkPw && checkPwLen) return true;
    return false;
  };

  const handleSignUp = async () => {
    if (isValueValid()) {
      await fetchSignupInfo();
      Alert.alert("회원가입 완료", "회원가입이 완료되었습니다.", [
        {
          text: "확인",
          onPress: () => {
            navigation.navigate("Login");
          },
          style: "destructive",
        },
      ]);
    }
  };

  useEffect(() => {
    if (!useremail) setCheckEmail("");
    else {
      if (isEmailValid(useremail)) setCheckEmail(true);
      else setCheckEmail(false);
    }
  }, [useremail]);

  useEffect(() => {
    if (!password) setCheckPwLen("");
    else {
      if (password.length < 10) setCheckPwLen(false);
      else setCheckPwLen(true);
    }
  }, [password]);

  useEffect(() => {
    if (!pwcheck) setCheckPw("");
    else {
      if (password !== pwcheck) setCheckPw(false);
      else setCheckPw(true);
    }
  }, [pwcheck]);
  return (
    <View style={styles.container}>
      <AppText style={styles.HomeText}>회원가입</AppText>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputBox}
          value={username}
          placeholder="이름"
          onChangeText={setUsername}
        ></TextInput>
        <TextInput
          onChangeText={setUseremail}
          value={useremail}
          placeholder="이메일"
          style={styles.inputBox}
        ></TextInput>
        {!checkEmail && useremail && (
          <AppText style={styles.notificationText}>
            올바른 형식을 입력해주세요
          </AppText>
        )}
        <TextInput
          onChangeText={setPassword}
          value={password}
          placeholder="비밀번호"
          style={styles.inputBox}
          secureTextEntry
        ></TextInput>
        {!checkPwLen && password && (
          <AppText style={styles.notificationText}>
            비밀번호는 {MinPasswordLength}자리 이상이어야 합니다
          </AppText>
        )}
        <TextInput
          onChangeText={setpwcheck}
          value={pwcheck}
          placeholder="비밀번호 확인"
          style={styles.inputBox}
          secureTextEntry
        ></TextInput>
        {!checkPw && pwcheck && (
          <AppText style={styles.notificationText}>
            비밀번호를 정확히 입력해주세요
          </AppText>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, isValueValid() ? "" : styles.disabled]}
        >
          <AppText style={styles.buttonText}>가입하기</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Signup;

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
    padding: 30,
    paddingBottom: 10,
  },
  notificationText: {
    marginBottom: 4,
    fontSize: 12,
    color: "red",
  },
  buttonContainer: {
    alignItems: "stretch",
    padding: 20,
    paddingTop: 10,
    marginBottom: "25%",
  },
  inputBox: {
    backgroundColor: "#eee",
    padding: 10,
    marginVertical: 5,
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
  disabled: {
    backgroundColor: "#ddd",
  },
  buttonText: {
    color: "white",
    fontSize: 17,
  },
});
