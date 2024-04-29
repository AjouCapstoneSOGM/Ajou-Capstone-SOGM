import React, { useState } from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";
import MakeAutoPortfolio from "./MakeAutoPortfolio";
import MakeManualPortfolio from "./MakeManualPortfolio.js";

const MakePortfolio = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [path, setPath] = useState("");

  const handleNextStep = () => {
    setCurrentStep(1);
  };

  const handleReplacePage = () => {
    navigation.replace("ViewPortfolio");
  };

  const isPathNull = () => {
    if (path === "") {
      return true;
    }
    return false;
  };
  const handleSelectPath = (selectedPath) => {
    setPath(selectedPath);
  };

  const renderInitialStep = () => {
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={{ fontSize: 25 }}>원하는 종류를 선택해주세요.</Text>
        </View>
        <View style={styles.selectContainer}>
          <TouchableOpacity
            title="auto"
            onPress={() => handleSelectPath("auto")}
            style={[
              styles.contentsButton,
              path === "auto" ? styles.selectedButton : "",
            ]}
          >
            <Text style={{ fontSize: 20, alignSelf: "flex-start" }}>
              자동 포트폴리오
            </Text>
            {path === "auto" && (
              <View style={styles.detailContainer}>
                <Text>간단한 정보를 통해 직접 종목을 선별해줘요</Text>
                <Text>종목들의 자동 리밸런싱 기능이 제공돼요</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            title="manual"
            onPress={() => handleSelectPath("manual")}
            style={[
              styles.contentsButton,
              path === "manual" ? styles.selectedButton : "",
            ]}
          >
            <Text style={{ fontSize: 20 }}>수동 포트폴리오</Text>
            {path === "manual" && (
              <View style={styles.detailContainer}>
                <Text>원하는 종목을 직접 골라담을 수 있어요</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, isPathNull() ? styles.disabledButton : ""]}
            title="다음"
            onPress={isPathNull() ? null : handleNextStep}
          >
            <Text style={{ fontSize: 18, color: "white" }}>다음</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderStep = () => {
    if (currentStep === 0) {
      return renderInitialStep();
    } else if (currentStep === 1) {
      switch (path) {
        case "auto":
          return <MakeAutoPortfolio setCurrentStep={setCurrentStep} />;
        case "manual":
          return <MakeManualPortfolio setCurrentStep={setCurrentStep} />;
        default:
          return renderInitialStep();
      }
    } else {
      return (
        <View style={styles.container}>
          <View style={[styles.textContainer, { flex: 2 }]}>
            <Text style={{ fontSize: 25 }}>생성이 완료되었어요!</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              title="다음"
              onPress={handleReplacePage}
            >
              <Text style={{ fontSize: 18, color: "white" }}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  return <View style={styles.container}>{renderStep()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  selectContainer: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
    padding: 20,
  },
  detailContainer: {
    borderRadius: 5,
    paddingVertical: 20,
    justifyContent: "flex-start",
  },
  contentsButton: {
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#ddd",
    alignItems: "stretch",
    borderRadius: 10,
    marginVertical: 10,
    padding: 15,
  },
  selectedButton: {
    backgroundColor: "#cceecc",
  },
  buttonContainer: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-end",
    padding: 20,
  },
  disabledButton: {
    backgroundColor: "#DADADA", // 비활성화 상태의 배경색 변경
  },
  button: {
    justifyContent: "center", // 가로 방향에서 중앙 정렬
    backgroundColor: "#6495ED",
    alignItems: "center",
    borderRadius: 10,
    padding: 18,
  },
});
export default MakePortfolio;
