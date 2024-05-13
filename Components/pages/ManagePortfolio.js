import React, { useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { getUsertoken } from "../utils/localStorageUtils";
import urls from "../utils/urls";
import { TouchableOpacity } from "react-native-gesture-handler";

const ManagementPage = ({ route, navigation }) => {
  const portfolio = route.params.portfolio;

  const fetchDelete = async () => {
    try {
      const token = await getUsertoken();
      const response = await fetch(
        `${urls.springUrl}/api/portfolio/${portfolio.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        return true;
      }
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  };

  const alertDelete = () => {
    Alert.alert("삭제 확인", "정말로 삭제하시겠습니까?", [
      {
        text: "취소",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "삭제",
        onPress: async () => {
          handleDelete();
        },
        style: "destructive", // iOS에서만 적용되는 스타일 옵션
      },
    ]);
  };

  const handleDelete = async () => {
    const isDelete = await fetchDelete();
    if (isDelete) navigation.replace("Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{portfolio.name}이름</Text>
      <TouchableOpacity style={styles.Button} onPress={alertDelete}>
        <Text style={{ color: "red", fontSize: 20 }}>포트폴리오 삭제</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    padding: 10,
  },
  header: {
    fontSize: 22,
    marginBottom: 30,
    padding: 10,
  },
  Button: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ddd", // 옅은 회색
    padding: 15,
  },
});

export default ManagementPage;
