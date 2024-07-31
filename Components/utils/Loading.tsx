import React from "react";
import { View, ActivityIndicator, Modal, StyleSheet } from "react-native";

type LoadingType = {
  size: "small" | "large";
  color: string;
};

const Loading: React.FC<LoadingType> = ({ size = "large", color = "#aaa" }) => {
  return (
    <Modal
      transparent={true} // 배경을 투명하게 설정
      animationType="fade" // 페이드 애니메이션 효과
      visible={true} // 모달을 항상 보이도록 설정
      statusBarTranslucent={true} // 상태바 영역을 모달로 포함시키기 위해
    >
      <View style={styles.container}>
        <ActivityIndicator size={size} color={color} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%", // 창 너비에 맞추어 폭 설정
    height: "100%", // 창 높이에 맞추어 높이 설정
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 어두운 배경 색상
  },
});

export default Loading;
