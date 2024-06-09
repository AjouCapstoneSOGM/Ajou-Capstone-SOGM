import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import urls from "../../utils/urls";
import AppText from "../../utils/AppText";
import { width, height } from "../../utils/utils";

const Signup = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [useremail, setUseremail] = useState("");
  const [password, setPassword] = useState("");
  const [pwcheck, setpwcheck] = useState("");

  const [checkEmail, setCheckEmail] = useState("");
  const [checkPw, setCheckPw] = useState("");
  const [checkPwLen, setCheckPwLen] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [signupToken, setSignupToken] = useState("");

  const MinPasswordLength = 10;

  const fetchSignupInfo = async () => {
    try {
      console.log(useremail, password, username, signupToken);
      const response = await fetch(`${urls.springUrl}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: useremail,
          password: password,
          name: username,
          signupToken: signupToken,
        }),
      });
      return response.status;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const sendVerificationCode = async () => {
    try {
      const response = await fetch(
        `${urls.springUrl}/api/auth/send-verification-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: useremail,
          }),
        }
      );
      if (response.status == 200) {
        Alert.alert("인증 코드 발송", "인증 코드가 이메일로 발송되었습니다.");
      } else if (response.status == 409) {
        Alert.alert("이미 가입된 이메일입니다.");
      } else {
        Alert.alert("잠시 후 다시 시도해 주세요.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const verifyCode = async () => {
    try {
      const response = await fetch(`${urls.springUrl}/api/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: useremail,
          code: verificationCode,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setIsEmailVerified(true);
        setSignupToken(data.signupToken);
        Alert.alert("인증 성공", "이메일 인증이 완료되었습니다.");
      } else if (response.status == 401) {
        Alert.alert("인증 실패", "인증번호가 만료되었습니다.");
      } else if (response.status == 403) {
        Alert.alert("인증 실패", "인증번호가 일치하지 않습니다.");
      } else if (response.status == 404) {
        Alert.alert(
          "인증 실패",
          "인증하기 버튼을 눌러 이메일 인증을 진행해 주세요."
        );
      } else {
        Alert.alert("인증 실패", "잠시 후 다시 시도해 주세요.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const isEmailValid = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  const isValueValid = () => {
    if (username && checkEmail && checkPw && checkPwLen && isEmailVerified)
      return true;
    return false;
  };

  const handleSignUp = async () => {
    if (isValueValid()) {
      const response = await fetchSignupInfo();
      if (response == 409) {
        Alert.alert("이미 가입된 이메일입니다.");
      } else if (response == 404) {
        Alert.alert("이메일 인증을 진행해 주세요.");
      } else if (response == 403) {
        Alert.alert("인증번호가 잘못되었습니다.");
      } else if (response == 200) {
        Alert.alert("회원가입 완료", "회원가입이 완료되었습니다.", [
          {
            text: "확인",
            onPress: () => {
              navigation.goBack();
            },
            style: "destructive",
          },
        ]);
      } else {
        Alert.alert("다시 시도해 주세요.");
      }
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
      <View style={styles.allContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputBox}
            value={username}
            placeholder="닉네임"
            onChangeText={setUsername}
            placeholderTextColor="gray"
          ></TextInput>
        </View>
        <View style={styles.verifyInputContainer}>
          <TextInput
            style={styles.verifyInputBox}
            value={useremail}
            onChangeText={setUseremail}
            placeholder="이메일"
            placeholderTextColor="gray"
          />
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={sendVerificationCode}
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
            value={verificationCode}
            onChangeText={setVerificationCode}
            placeholder="인증번호"
            style={styles.verifyInputBox}
            placeholderTextColor="grey"
            keyboardType="number-pad"
          ></TextInput>
          <TouchableOpacity style={styles.verifyButton} onPress={verifyCode}>
            <AppText style={styles.verifybuttonText}>인증번호 확인</AppText>
          </TouchableOpacity>
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
    backgroundColor: "#333",
  },
  HomeText: {
    paddingBottom: height * 15,
    fontSize: 40,
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff",
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
    backgroundColor: "#aaa",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
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
  verifybuttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
