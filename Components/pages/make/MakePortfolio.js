import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import MakeAutoPortfolio from "./MakeAutoPortfolio";
import MakeManualPortfolio from "./MakeManualPortfolio.js";
import { useAuth } from "../../utils/AuthContext.js";
import AppText from "../../utils/AppText.js";

const MakePortfolio = ({ navigation }) => {
  const { isLoggedIn } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [path, setPath] = useState("");

  const handleNextStep = () => {
    setCurrentStep(1);
  };

  const handleReplacePage = () => {
    navigation.replace("Home");
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

  useEffect(() => {
    if (!isLoggedIn) {
      navigation.replace("Login");
    }
  }, []);
  const renderInitialStep = () => {
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <AppText style={{ fontSize: 25 }}>
            원하는 종류를 선택해주세요.
          </AppText>
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
            <AppText style={styles.buttonTitle}>자동 포트폴리오</AppText>
            <AppText style={styles.buttonInfo}>
              • 간단한 정보를 통해 직접 종목을 선별해줘요
            </AppText>
            <AppText style={styles.buttonInfo}>
              • 종목들의 자동 리밸런싱 기능이 제공돼요
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            title="manual"
            onPress={() => handleSelectPath("manual")}
            style={[
              styles.contentsButton,
              path === "manual" ? styles.selectedButton : "",
            ]}
          >
            <AppText style={styles.buttonTitle}>수동 포트폴리오</AppText>
            <AppText style={styles.buttonInfo}>
              • 원하는 종목을 직접 골라담을 수 있어요
            </AppText>
            <AppText style={styles.buttonInfo}>
              • 종목의 가치 지표를 확인하면서 고를 수 있어요
            </AppText>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, isPathNull() ? styles.disabledButton : ""]}
            title="다음"
            onPress={isPathNull() ? null : handleNextStep}
          >
            <AppText style={{ fontSize: 18, color: "white" }}>다음</AppText>
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
            <AppText style={{ fontSize: 25 }}>생성이 완료되었어요!</AppText>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              title="다음"
              onPress={handleReplacePage}
            >
              <AppText style={{ fontSize: 18, color: "white" }}>확인</AppText>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  if (isLoggedIn) return <View style={styles.container}>{renderStep()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
  },
  textContainer: {
    marginTop: "25%",
    justifyContent: "center",
    padding: 20,
  },
  selectContainer: {
    alignItems: "stretch",
    justifyContent: "center",
    padding: 20,
  },
  buttonContainer: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-end",
    padding: 20,
  },
  contentsButton: {
    flexDirection: "column",
    backgroundColor: "#ddd",
    alignItems: "stretch",
    borderRadius: 5,
    marginVertical: 15,
    padding: 15,
  },
  selectedButton: {
    backgroundColor: "#87AFFF",
  },
  buttonTitle: {
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 5,
    marginBottom: 20,
  },
  buttonInfo: {
    fontSize: 17,
    color: "#333",
    marginBottom: 5,
  },
  disabledButton: {
    backgroundColor: "#DADADA", // 비활성화 상태의 배경색 변경
  },
  button: {
    justifyContent: "center", // 가로 방향에서 중앙 정렬
    backgroundColor: "#6495ED",
    alignItems: "center",
    alignSelf: "stretch",
    borderRadius: 10,
    padding: 18,
  },
});
export default MakePortfolio;
