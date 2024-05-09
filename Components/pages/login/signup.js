import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
} from "react-native";
import urls from "../../utils/urls";

const Signup = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [useremail, setUseremail] = useState("");
  const [password, setPassword] = useState("");
  const [pwcheck, setpwcheck] = useState("");

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
    <View style={Styles.container}>
      <Text style={Styles.HomeText}>회원가입 화면</Text>

      <TextInput
        style={Styles.Input}
        value={username}
        placeholder="이름"
        onChangeText={setUsername}
      ></TextInput>
      <TextInput
        onChangeText={setUseremail}
        value={useremail}
        placeholder="이메일"
        style={Styles.Input}
      ></TextInput>
      <TextInput
        onChangeText={setPassword}
        value={password}
        placeholder="비밀번호"
        style={Styles.Input}
        secureTextEntry
      ></TextInput>
      <TextInput
        onChangeText={setpwcheck}
        value={pwcheck}
        placeholder="비밀번호 확인"
        style={Styles.Input}
        secureTextEntry
      ></TextInput>

      <TouchableOpacity onPress={handleSignUp} style={Styles.Inputbotton}>
        <Text style={Styles.BottomText}>가입하기</Text>
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

export default Signup;

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
