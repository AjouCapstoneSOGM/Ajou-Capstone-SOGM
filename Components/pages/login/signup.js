import React, { useState } from "react";
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

  const handleSignUp = () => {
    MinPasswordLength = 10;

    let IsThereEmptyInput = ![username, useremail, password, pwcheck].every(
      (str) => str.length > 0
    );

    const isWrongEmail = (email) => {
      return email.indexOf("@") < 1 || email.split("@")[1].indexOf(".") < 1;
    };

    if (IsThereEmptyInput) {
      Alert.alert("빈칸이 있습니다.");
      return;
    } else if (isWrongEmail(useremail)) {
      Alert.alert("이메일 서식이 올바르지 않습니다.");
      return;
    } else if (password.length < MinPasswordLength) {
      Alert.alert(
        "비밀번호를 " + MinPasswordLength + "자리 이상으로 설정해 주세요"
      );
      return;
    } else if (password != pwcheck) {
      Alert.alert("비밀번호 확인이 일치하지 않습니다.");
      return;
    }
    fetchSignupInfo();
    navigation.navigate("Home", { screen: "Home" });
  };
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
        <TextInput
          onChangeText={setPassword}
          value={password}
          placeholder="비밀번호"
          style={styles.inputBox}
          secureTextEntry
        ></TextInput>
        <TextInput
          onChangeText={setpwcheck}
          value={pwcheck}
          placeholder="비밀번호 확인"
          style={styles.inputBox}
          secureTextEntry
        ></TextInput>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSignUp} style={styles.button}>
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
    padding: 20,
    paddingBottom: 10,
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
  buttonText: {
    color: "white",
    fontSize: 17,
  },
});
