import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const MakeAutoPortfolio = ({ setCurrentStep }) => {
  const [currentAutoStep, setCurrentAutoStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [interest, setInterest] = useState("");

  const sector = [
    "it",
    "건강관리",
    "경기관련소비재",
    "금융",
    "산업재",
    "소재",
    "에너지",
    "유틸리티",
    "커뮤니케이션서비스",
    "필수소비재",
    "기타",
  ];

  const isRiskNull = () => {
    if (riskLevel === "") {
      return true;
    }
    return false;
  };

  const isInterestNull = () => {
    if (interest === "") {
      return true;
    }
    return false;
  };

  const isAmountEnough = () => {
    if (amount >= 1000000) {
      return true;
    }
    return false;
  };

  const submitUserInfo = () => {
    console.log(amount, riskLevel, interest);
    /*
    포폴 생성 api 호출
    */
    setCurrentStep(2);
  };

  const handleNextStep = () => {
    setCurrentAutoStep(currentAutoStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentAutoStep(currentAutoStep - 1);
  };

  const renderAutoStep = () => {
    switch (currentAutoStep) {
      case 1:
        return (
          <View style={styles.container}>
            <View style={styles.textContainer}>
              <Text style={{ fontSize: 25 }}>
                포트폴리오에 사용할 금액을 입력해주세요.
              </Text>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input_Amount}
                keyboardType="numeric"
                value={amount.toLocaleString()}
                onChangeText={setAmount}
                placeholder="금액을 입력하세요"
              />
              {amount && !isAmountEnough() && (
                <Text style={{ color: "red", alignSelf: "baseline" }}>
                  최소 100만원 이상 가능합니다.
                </Text>
              )}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button]}
                title="prev"
                onPress={handlePrevStep}
              >
                <Text style={{ fontSize: 18, color: "white" }}>이전</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  isAmountEnough() ? "" : styles.disabledButton,
                ]}
                title="next"
                onPress={isAmountEnough() ? handleNextStep : null}
              >
                <Text style={{ fontSize: 18, color: "white" }}>다음</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.container}>
            <View style={styles.textContainer}>
              <Text style={{ fontSize: 25 }}>
                원하는 위험도를 선택해주세요.
              </Text>
            </View>
            <View style={styles.inputContainer}>
              {["1", "2", "3"].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.input_Risk,
                    riskLevel === level ? styles.selectedInput : "",
                  ]}
                  onPress={() => {
                    setRiskLevel(level);
                  }}
                >
                  <Text>{level} 단계</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button]}
                title="prev"
                onPress={handlePrevStep}
              >
                <Text style={{ fontSize: 18, color: "white" }}>이전</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  isRiskNull() ? styles.disabledButton : "",
                ]}
                title="next"
                onPress={isRiskNull() ? null : handleNextStep}
              >
                <Text style={{ fontSize: 18, color: "white" }}>다음</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.container}>
            <View style={styles.textContainer}>
              <Text style={{ fontSize: 25 }}>
                관심있는 분야를 한 가지 선택해주세요.
              </Text>
            </View>
            <View style={styles.sectorContainer}>
              {sector.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.input_Interest,
                    interest === item ? styles.selectedInput : "",
                  ]}
                  onPress={() => setInterest(item)}
                >
                  <Text style={{ fontSize: 17 }}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button]}
                title="prev"
                onPress={handlePrevStep}
              >
                <Text style={{ fontSize: 18, color: "white" }}>이전</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.button,
                  isInterestNull() ? styles.disabledButton : "",
                ]}
                title="next"
                onPress={isInterestNull() ? null : handleNextStep}
              >
                <Text style={{ fontSize: 18, color: "white" }}>다음</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.container}>
            <Text>금액 {amount}</Text>
            <Text>위험도 {riskLevel} 단계</Text>
            <Text>관심 {interest}</Text>
          </View>
        );
      default:
        return <Text>Invalid step</Text>;
    }
  };

  return <View style={styles.container}>{renderAutoStep()}</View>;
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
  inputContainer: {
    flex: 1,
    alignItems: "stretch",
    padding: 20,
  },
  sectorContainer: {
    flexDirection: "row",
    padding: 20,
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  input_Amount: {
    justifyContent: "center", // 가로 방향에서 중앙 정렬
    backgroundColor: "#ddd",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    margin: 10,
    fontSize: 20,
  },
  input_Risk: {
    justifyContent: "center", // 가로 방향에서 중앙 정렬
    backgroundColor: "#ddd",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    margin: 10,
  },
  input_Interest: {
    flexGrow: 1,
    justifyContent: "center", // 가로 방향에서 중앙 정렬
    backgroundColor: "#ddd",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    margin: 10,
  },
  selectedInput: {
    backgroundColor: "#cceecc",
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "flex-end",
    padding: 20,
  },
  disabledButton: {
    backgroundColor: "#DADADA", // 비활성화 상태의 배경색 변경
  },
  button: {
    flex: 1,
    justifyContent: "center", // 가로 방향에서 중앙 정렬
    backgroundColor: "#6495ED",
    alignItems: "center",
    borderRadius: 10,
    padding: 18,
    margin: 5,
  },
});
export default MakeAutoPortfolio;
