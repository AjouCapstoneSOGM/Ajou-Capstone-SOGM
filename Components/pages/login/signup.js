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
import { width, height } from "../../utils/utils";

const Signup = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [useremail, setUseremail] = useState("");
  const [verifyNum, setVerifynum] = useState(""); // api 설정 필요
  const [password, setPassword] = useState("");
  const [pwcheck, setpwcheck] = useState("");

  const [checkEmail, setCheckEmail] = useState("");
  const [checkNum, setChecknum] = useState("");
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

  const handleSendverify = () => {
    // 버튼이 눌렸을 때 처리할 로직을 작성합니다.
    console.log("Button pressed");
  };
  const handleCenkverify = () => {
    // 버튼이 눌렸을 때 처리할 로직을 작성합니다.
    console.log("Button pressed");
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
      <View style={styles.allContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputBox}
            value={username}
            placeholder="닉네임"
            onChangeText={setUsername}
            placeholderTextColor="grey"
          ></TextInput>
        </View>
        <View style={styles.verifyInputContainer}>
          <TextInput
            style={styles.verifyInputBox}
            value={useremail}
            onChangeText={setUseremail}
            placeholder="이메일"
            placeholderTextColor="grey"
          />
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleSendverify}
          >
            <AppText style={styles.verifybuttonText}>인증번호 전송</AppText>
          </TouchableOpacity>
        </View>
        {!checkEmail && useremail && (
          <AppText style={styles.notificationText}>
            올바른 형식을 입력해주세요
          </AppText>
        )}
        <View style={styles.verifyInputContainer}>
          <TextInput
            value={checkNum}
            onChangeText={setChecknum}
            placeholder="인증번호"
            style={styles.verifyInputBox}
            placeholderTextColor="grey"
            keyboardType="number-pad"
          ></TextInput>
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={handleCenkverify}
          >
            <AppText style={styles.verifybuttonText}>인증번호 확인</AppText>
          </TouchableOpacity>
          {!checkNum && verifyNum && (
            <AppText style={styles.notificationText}>
              인증번호가 틀렸습니다.
            </AppText> // api 필요
          )}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={setPassword}
            value={password}
            placeholder="비밀번호"
            style={styles.inputBox}
            secureTextEntry
            placeholderTextColor="grey"
          ></TextInput>
          {!checkPwLen && password && (
            <AppText style={styles.notificationText}>
              비밀번호는 {MinPasswordLength}자리 이상이어야 합니다
            </AppText>
          )}
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={setpwcheck}
            value={pwcheck}
            placeholder="비밀번호 확인"
            style={styles.inputBox}
            secureTextEntry
            placeholderTextColor="grey"
          ></TextInput>
          {!checkPw && pwcheck && (
            <AppText style={styles.notificationText}>
              비밀번호를 정확히 입력해주세요
            </AppText>
          )}
        </View>
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
    paddingBottom: height * 15,
    fontSize: 40,
    textAlign: "center",
    color: "#333",
  },
  allContainer: { alignItems: "stretch", padding: 10, paddingBottom: 10 },
  inputContainer: {
    alignItems: "stretch",
    padding: 5,
    paddingBottom: 5,
  },
  verifyInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    paddingBottom: 5,
  },
  notificationText: {
    marginBottom: 4,
    fontSize: 12,
    color: "red",
  },
  buttonContainer: {
    alignItems: "stretch",
    padding: 10,
    paddingTop: 5,
    marginBottom: "25%",
  },
  inputBox: {
    backgroundColor: "#eee",
    padding: 10,
    height: height * 50,
    marginVertical: 0,
    paddingHorizontal: 10,
    borderRadius: 20,
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
  verifyInputBox: {
    flex: 1,
    width: width * 10,
    height: height * 50,
    borderWidth: 0,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: -20,
    backgroundColor: "#eee",
  },
  verifyButton: {
    width: width * 100,
    height: height * 50,
    backgroundColor: "#6495ED",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  verifybuttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
