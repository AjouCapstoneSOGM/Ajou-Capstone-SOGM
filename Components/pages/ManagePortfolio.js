import React from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { usePortfolio } from "../utils/PortfolioContext";

const ManagementPage = ({ route, navigation }) => {
  const { fetchDelete } = usePortfolio();
  const { portfolio } = route.params;

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
    const result = await fetchDelete(portfolio.id);
    if (result) navigation.popToTop();
    else
      Alert.alert("삭제 실패", "삭제에 실패했습니다", [
        {
          text: "확인",
          onPress: () => {},
          style: "cancel",
        },
      ]);
  };

  if (portfolio) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>{portfolio.name}이름</Text>
        <TouchableOpacity style={styles.Button} onPress={alertDelete}>
          <Text style={{ color: "red", fontSize: 20 }}>포트폴리오 삭제</Text>
        </TouchableOpacity>
      </View>
    );
  }
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
