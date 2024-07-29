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

const ResetPW = ({ navigation }) => {
  const [useremail, setUseremail] = useState("");
  const [checkEmail, setCheckEmail] = useState("");

  const fetchSendResetPassword = async () => {
    try {
      const response = await fetch(
        `${urls.springUrl}/api/auth/reset-password`,
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
        Alert.alert("메일 발송", "초기화를 위한 메일을 발송하였습니다.");
        navigation.goBack();
      } else {
        Alert.alert("잠시 후 다시 시도해 주세요.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleResetPassword = async () => {
    await fetchSendResetPassword()
  }

  const isEmailValid = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  useEffect(() => {
    if (!useremail) setCheckEmail("");
    else {
      if (isEmailValid(useremail)) setCheckEmail(true);
      else setCheckEmail(false);
    }
  }, [useremail]);

  return (
    <View style={styles.container}>
      <View style={styles.textWrapper}>
        <AppText style={styles.largeText}>비밀번호 초기화</AppText>
        <AppText style={styles.smallText}>비밀번호 초기화 이메일 발송</AppText>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputBox}
          value={useremail}
          onChangeText={setUseremail}
          placeholder="이메일"
          placeholderTextColor="gray"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleResetPassword}
          style={[styles.button]}
        >
          <AppText style={styles.buttonText}>비밀번호 초기화</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ResetPW;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    backgroundColor: "#333",
  },
  textWrapper: {
    alignItems: "center",
    paddingVertical: 20,
  },
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
    marginVertical: height * 5,
    marginHorizontal: 10,
    borderRadius: 40,
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
    fontWeight: "bold",
  },
  largeText: {
    fontSize: 35,
    justifyContent: "center",
    fontWeight: "bold",
    color: "#6495ed",
    paddingVertical: 25,
  },
  smallText: {
    fontSize: 15,
    justifyContent: "center",
    color: "white",
  },
});
