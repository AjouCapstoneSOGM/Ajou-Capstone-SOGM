import React from "react";
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { usePortfolio } from "../../utils/PortfolioContext";
import AppText from "../../utils/AppText";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Divider } from "@rneui/base";
import { ManagePortfolioProps } from "../../types/Navigations";

const ManagePortfolio: React.FC<ManagePortfolioProps> = ({
  route,
  navigation,
}) => {
  const { fetchDelete } = usePortfolio();
  const portfolioId = route.params.id;

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
          await handleDelete();
        },
        style: "destructive", // iOS에서만 적용되는 스타일 옵션
      },
    ]);
  };

  const handleDelete = async () => {
    const result = await fetchDelete(portfolioId);
    if (result) {
      navigation.popToTop();
      navigation.navigate("ViewPortfolio");
    } else
      Alert.alert("삭제 실패", "삭제에 실패했습니다", [
        {
          text: "확인",
          onPress: () => {},
          style: "cancel",
        },
      ]);
  };

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
        <AppText style={{ fontSize: 30, fontWeight: "bold" }}>설정</AppText>
      </View>
      <ScrollView style={styles.settingList}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("RebalanceRecordList", { id: portfolioId });
          }}
          style={styles.settingItem}
        >
          <AppText style={{ color: "#f0f0f0", fontSize: 20 }}>
            지난 리밸런싱 내역 보기
          </AppText>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity onPress={alertDelete} style={styles.settingItem}>
          <AppText style={{ color: "#ff5858", fontSize: 20 }}>
            포트폴리오 삭제
          </AppText>
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

export default ManagePortfolio;
