import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import urls from "../utils/urls";
import { getUsertoken } from "../utils/localStorageUtils";
import { usePortfolio } from "../utils/PortfolioContext";
import { filteringNumber } from "../utils/utils";

const MakeAutoPortfolio = ({ setCurrentStep }) => {
  const { fetchUserInfo } = usePortfolio();
  const [currentAutoStep, setCurrentAutoStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [interest, setInterest] = useState("");
  const [sector, setSector] = useState({});

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

  const fetchSector = async () => {
    try {
      const token = await getUsertoken();
      const response = await fetch(`${urls.springUrl}/api/sector/list`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const submitUserInfo = async () => {
    console.log(amount, riskLevel, interest);
    handleNextStep();
    await fetchUserInfo({
      interest: interest,
      amount: amount,
      riskLevel: riskLevel,
    });
    handleNextStep();
    setCurrentStep(2);
  };

  const handleAmount = (value) => {
    setAmount(filteringNumber(value));
  };

  const handleNextStep = () => {
    setCurrentAutoStep(currentAutoStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentAutoStep(currentAutoStep - 1);
  };

  useEffect(() => {
    fetchSector().then((data) => setSector(data));
  }, []);

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
                value={amount}
                onChangeText={(value) => handleAmount(value)}
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
              {[1, 2, 3].map((level) => (
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
                style={[
                  styles.button,
                  isRiskNull() ? styles.disabledButton : "",
                ]}
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
              {Object.entries(sector).map(([code, name]) => (
                <TouchableOpacity
                  key={code}
                  style={[
                    styles.input_Interest,
                    interest === code ? styles.selectedInput : "",
                  ]}
                  onPress={() => setInterest(code)}
                >
                  <Text style={{ fontSize: 17 }}>{name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  isInterestNull() ? styles.disabledButton : "",
                ]}
                title="submit"
                onPress={isInterestNull() ? null : submitUserInfo}
              >
                <Text style={{ fontSize: 18, color: "white" }}>생성</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.container}>
            <Text>Loading...</Text>
          </View>
        );
      default:
        setCurrentStep(0);
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
    flex: 2,
    alignItems: "stretch",
    padding: 20,
  },
  sectorContainer: {
    flex: 2,
    flexDirection: "row",
    padding: 20,
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  input_Amount: {
    justifyContent: "center", // 가로 방향에서 중앙 정렬
    backgroundColor: "#ddd",
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
    alignItems: "stretch",
    padding: 20,
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
export default MakeAutoPortfolio;
