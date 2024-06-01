import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Divider } from "@rneui/base";
import AppText from "../utils/AppText";

const Settings = ({ navigation }) => {
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
        <TouchableOpacity style={styles.settingItem}>
          <AppText style={{ color: "#f0f0f0", fontSize: 20 }}>닉네임</AppText>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity style={styles.settingItem}>
          <AppText style={{ color: "#f0f0f0", fontSize: 20 }}>이메일</AppText>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity style={styles.settingItem}>
          <AppText style={{ color: "#f0f0f0", fontSize: 20 }}>
            비밀번호변경
          </AppText>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity style={styles.settingItem}>
          <AppText style={{ color: "#f0f0f0", fontSize: 20 }}>가입일자</AppText>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity style={styles.settingItem}>
          <AppText style={{ color: "#f0f0f0", fontSize: 20 }}>문의하기</AppText>
        </TouchableOpacity>
        <Divider />
        <Divider />
        <TouchableOpacity style={styles.settingItem}>
          <AppText style={{ color: "#f0f0f0", fontSize: 20 }}>로그아웃</AppText>
        </TouchableOpacity>
        <Divider />
      </ScrollView>
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
    paddingVertical: 10,
  },
});

export default Settings;
