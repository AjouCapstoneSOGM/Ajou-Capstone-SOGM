import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Divider, color } from "@rneui/base";
import AppText from "../utils/AppText";
import urls from "../utils/urls";
import { getUsertoken } from "../utils/localStorageUtils";
import { useAuth } from "../utils/AuthContext";
import ModalComponent from "../utils/Modal";
import { TextInput } from "react-native-gesture-handler";

const Settings = ({ navigation }) => {
  const { logout } = useAuth();
  const [pwModalVisible, setPwModalVisible] = useState(false);
  const [nameModalVisible, setNameModalVisible] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [password, setPassword] = useState("");
  const [prevPw, setPrevPw] = useState("");
  const [pwCheck, setPwCheck] = useState("");
  const [pwValid, setPwValid] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    createdDate: "",
    socialType: null,
  });

  const togglePwModalVisible = () => {
    setPwModalVisible(!pwModalVisible);
  };

  const toggleNameModalVisible = () => {
    setNameModalVisible(!nameModalVisible);
  };

  const handleLogout = async () => {
    await logout();
    navigation.popToTop();
  };

  useEffect(() => {
    if (password.length >= 10 && pwCheck == password) setPwValid(true);
    else setPwValid(false);
  }, [password, pwCheck]);

  const fetchChangePw = async () => {
    try {
      const token = await getUsertoken();
      const response = await fetch(`${urls.springUrl}/api/info/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          password: password,
        }),
      });
      if (response.ok) {
        return { result: "success" };
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log(error);
      return { result: "fail" };
    }
  };  

  const fetchUserInfo = async () => {
    try {
      const token = await getUsertoken();
      const response = await fetch(`${urls.springUrl}/api/info`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        return data;
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log(error);
      return {};
    }
  };

  const fetchChangeName = async () => {
    try {
      const token = await getUsertoken();
      const response = await fetch(`${urls.springUrl}/api/info/name`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newUserName,
        }),
      });
      if (response.ok) {
        return { result: "success" };
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log(error);
      return { result: "fail" };
    }
  };

  const fetchUserDelete = async () => {
    try {
      const token = await getUsertoken();
      const response = await fetch(`${urls.springUrl}/api/info`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        return { result: "success" };
      }
    } catch (error) {
      console.log(error);
      return { result: "fail" };
    }
  };

  const handleChangedName = async () => {
    const result = await fetchChangeName();
    if (result.result === "success") {
      Alert.alert(
        "닉네임 변경 완료",
        "닉네임 변경이 완료되었습니다. 정보 재설정을 위해 로그아웃 됩니다.",
        [
          {
            text: "확인",
            onPress: async () => {
              await logout();
              navigation.popToTop();
            },
            style: "cancel",
          },
        ]
      );
    } else {
      Alert.alert("닉네임 변경 실패", "닉네임 변경에 실패하였습니다.", [
        {
          text: "확인",
          onPress: () => {},
          style: "cancel",
        },
      ]);
    }
  };

  const handleChangedPassword = async () => {
    const result = await fetchChangePw();
    if (result.result === "success") {
      Alert.alert(
        "비밀번호 변경 완료",
        "비밀번호 변경이 완료되었습니다. 정보 재설정을 위해 로그아웃 됩니다.",
        [
          {
            text: "확인",
            onPress: async () => {
              await logout();
              navigation.popToTop();
            },
            style: "cancel",
          },
        ]
      );
    } else {
      Alert.alert("비밀번호 변경 실패", "비밀번호 변경에 실패하였습니다.", [
        {
          text: "확인",
          onPress: () => {},
          style: "cancel",
        },
      ]);
    }
  };

  
  const handleUserDelete = async () => {
    const result = await fetchUserDelete();
    if (result.result === "success") {
      Alert.alert("탈퇴 완료", "탈퇴가 완료되었습니다.", [
        {
          text: "확인",
          onPress: async () => {
            await logout();
            navigation.popToTop();
          },
          style: "cancel",
        },
      ]);
    } else {
      Alert.alert("탈퇴 실패", "탈퇴에 실패하였습니다.", [
        {
          text: "확인",
          onPress: () => {},
          style: "cancel",
        },
      ]);
    }
  };

  const alertUserDelete = async () => {
    Alert.alert("탈퇴 확인", "정말로 탈퇴하실건가요? 모든 정보가 삭제됩니다.", [
      {
        text: "취소",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "탈퇴",
        onPress: async () => {
          await handleUserDelete();
          logout();
          navigation.popToTop();
        },
        style: "destructive", // iOS에서만 적용되는 스타일 옵션
      },
    ]);
  };

  useEffect(() => {
    const loadUserInfo = async () => {
      const data = await fetchUserInfo();
      if (data) setUserInfo(data);
    };
    loadUserInfo();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button
          type="clear"
          onPress={() => {
            navigation.goBack();
          }}
          icon={{ name: "left", type: "antdesign", color: "#333" }}
        />
      </View>
      <View style={styles.textContainer}>
        <AppText style={{ fontSize: 30, fontWeight: "bold" }}>내 정보</AppText>
      </View>
      <ScrollView style={styles.settingList}>
        <View style={styles.settingItem}>
          <AppText style={{ alignItems: "center" }}>
            <AppText style={{ color: "#f0f0f0", fontSize: 18 }}>
              닉네임{"  "}
            </AppText>
            <AppText style={{ color: "#999", fontSize: 15 }}>
              {userInfo?.name}
            </AppText>
          </AppText>
          <TouchableOpacity onPress={toggleNameModalVisible}>
            {userInfo?.socialType == null && (
              <AppText style={{ color: "#aaa" }}>변경하기 &gt;</AppText>
            )}
          </TouchableOpacity>
        </View>
        <Divider />
        <View style={styles.settingItem}>
          <AppText style={{ alignItems: "center" }}>
            <AppText style={{ color: "#f0f0f0", fontSize: 18 }}>
              {userInfo?.socialType == "KAKAO" ? "소셜ID" : "이메일"}
              {"  "}
            </AppText>
            <AppText style={{ color: "#999", fontSize: 15 }}>
              {userInfo?.email}
            </AppText>
          </AppText>
        </View>
        <Divider />
        <View style={styles.settingItem}>
          <AppText style={{ alignItems: "center" }}>
            <AppText style={{ color: "#f0f0f0", fontSize: 18 }}>
              소셜 로그인 여부{"  "}
            </AppText>
            <AppText style={{ color: "#999", fontSize: 15 }}>
              {userInfo?.socialType === null ? "X" : userInfo?.socialType}
            </AppText>
          </AppText>
        </View>
        <Divider />
        <View style={styles.settingItem}>
          <AppText style={{ alignItems: "center" }}>
            <AppText style={{ color: "#f0f0f0", fontSize: 18 }}>
              가입일자{"  "}
            </AppText>
            <AppText style={{ color: "#999", fontSize: 15 }}>
              {userInfo?.createdDate}
            </AppText>
          </AppText>
        </View>
        <Divider />
        {userInfo?.socialType == null && (
          <React.Fragment>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={togglePwModalVisible}
            >
              <AppText style={{ color: "#f0f0f0", fontSize: 18 }}>
                비밀번호 변경
              </AppText>
            </TouchableOpacity>
            <Divider />
          </React.Fragment>
        )}
        <TouchableOpacity style={styles.settingItem}>
          <AppText style={{ color: "#f0f0f0", fontSize: 18 }}>문의하기</AppText>
        </TouchableOpacity>
        <Divider />
        <Divider />
        <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
          <AppText style={{ color: "#f0f0f0", fontSize: 18 }}>로그아웃</AppText>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity style={styles.settingItem} onPress={alertUserDelete}>
          <AppText style={{ color: "#ff5858", fontSize: 18 }}>회원탈퇴</AppText>
        </TouchableOpacity>
        <Divider />
      </ScrollView>
      <ModalComponent
        isVisible={pwModalVisible}
        onToggle={togglePwModalVisible}
      >
        {/* <View style={styles.textInputContainer}>
          <AppText style={{ flex: 1, fontSize: 11, color: "#f0f0f0" }}>
            현재 비밀번호
          </AppText>
          <TextInput
            secureTextEntry
            style={styles.passwordInput}
            onChangeText={setPrevPw}
            value={prevPw}
          ></TextInput>
        </View> */}
        <View style={styles.textInputContainer}>
          <AppText style={{ flex: 1, fontSize: 11, color: "#f0f0f0" }}>
            새 비밀번호
          </AppText>
          <TextInput
            secureTextEntry
            style={styles.passwordInput}
            onChangeText={setPassword}
            value={password}
          ></TextInput>
        </View>
        {password && password.length < 10 && (
          <AppText style={{ fontSize: 12, color: "#ff5858" }}>
            비밀번호는 10자리 이상이어야 합니다.
          </AppText>
        )}
        <View style={styles.textInputContainer}>
          <AppText style={{ flex: 1, fontSize: 11, color: "#f0f0f0" }}>
            새 비밀번호 확인
          </AppText>
          <TextInput
            secureTextEntry
            style={styles.passwordInput}
            onChangeText={setPwCheck}
            value={pwCheck}
          ></TextInput>
        </View>
        {pwCheck && pwCheck != password && (
          <AppText style={{ fontSize: 12, color: "#ff5858" }}>
            비밀번호를 정확히 입력해주세요.
          </AppText>
        )}
        <Button
          buttonStyle={styles.submitButton}
          title="변경"
          onPress={handleChangedPassword}
          disabled={!pwValid}
        />
      </ModalComponent>
      <ModalComponent
        isVisible={nameModalVisible}
        onToggle={toggleNameModalVisible}
      >
        <View style={styles.textInputContainer}>
          <AppText style={{ flex: 1, fontSize: 11, color: "#f0f0f0" }}>
            새 닉네임
          </AppText>
          <TextInput
            style={styles.passwordInput}
            onChangeText={setNewUserName}
            value={newUserName}
          ></TextInput>
        </View>
        <Button
          buttonStyle={styles.submitButton}
          title="변경"
          onPress={handleChangedName}
          disabled={newUserName.length == 0}
        />
      </ModalComponent>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: "#f0f0f0",
  },
  header: {
    height: 60,
    alignItems: "flex-start",
  },
  textContainer: {
    height: 90,
    padding: 20,
  },
  settingList: {
    backgroundColor: "#333",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  textInputContainer: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 2,
    color: "#f0f0f0",
    borderBottomColor: "#777",
    borderBottomWidth: 1,
    marginHorizontal: 10,
  },
  submitButton: {
    backgroundColor: "#6262e8",
    borderRadius: 10,
    height: 40,
    marginVertical: 10,
  },
});

export default Settings;
