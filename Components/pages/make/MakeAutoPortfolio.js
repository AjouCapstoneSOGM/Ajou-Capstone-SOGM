import React, { useState, useEffect } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import urls from "../../utils/urls";
import { getUsertoken } from "../../utils/localStorageUtils";
import { usePortfolio } from "../../utils/PortfolioContext";
import { filteringNumber } from "../../utils/utils";
import AppText from "../../utils/AppText";

const MakeAutoPortfolio = ({ setCurrentStep }) => {
  const { fetchUserInfo } = usePortfolio();
  const [currentAutoStep, setCurrentAutoStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [interest, setInterest] = useState("");
  const [sector, setSector] = useState({});

  const riskText = ["안정투자형", "위험중립형", "적극투자형"];
  const riskColor = ["#006400", "#F07C00", "#8B0000"];
  const riskBgColor = ["#90EE90", "#FFDAB9", "#FFB6C1"];

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

  const addValuetoAmount = (value) => {
    setAmount(Number(amount) + value);
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
              <AppText style={{ fontSize: 25 }}>
                포트폴리오에 사용할 금액을 입력해주세요.
              </AppText>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input_Amount}
                keyboardType="numeric"
                value={amount.toString()}
                onChangeText={(value) => Number(handleAmount(value))}
                placeholder="금액을 입력하세요"
              />
              <View style={{ flexDirection: "row", marginBottom: 10 }}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addValuetoAmount(100000)}
                >
                  <AppText style={{ color: "#555" }}>+ 10만</AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addValuetoAmount(1000000)}
                >
                  <AppText style={{ color: "#555" }}>+ 100만</AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addValuetoAmount(10000000)}
                >
                  <AppText style={{ color: "#555" }}>+ 1000만</AppText>
                </TouchableOpacity>
              </View>
              {amount && !isAmountEnough() && (
                <AppText style={{ color: "red", alignSelf: "baseline" }}>
                  최소 100만원 이상 가능합니다.
                </AppText>
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
                <AppText style={{ fontSize: 18, color: "white" }}>다음</AppText>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 2:
        return (
          <View style={styles.container}>
            <View style={styles.textContainer}>
              <AppText style={{ fontSize: 25 }}>
                원하는 위험도를 선택해주세요.
              </AppText>
            </View>
            <View style={styles.riskContainer}>
              {[1, 2, 3].map((level, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.input_Risk,
                    riskLevel === level
                      ? { backgroundColor: riskBgColor[index] }
                      : "",
                  ]}
                  onPress={() => {
                    setRiskLevel(level);
                  }}
                >
                  <AppText style={{ color: riskColor[index] }}>
                    {level} 단계
                  </AppText>
                  <AppText style={{ fontSize: 16 }}>{riskText[index]}</AppText>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.riskInfo}>
              {riskLevel === 1 && (
                <View>
                  <AppText style={styles.infoText}>
                    • 변동성이 낮고 안정적인 수익을 목표로 하는 투자자에게
                    적합해요.
                  </AppText>
                  <AppText style={styles.infoText}>
                    • 국채, 안정적인 배당주 등 저위험 자산에 투자하여 자본
                    보전을 최우선으로 해요.
                  </AppText>
                </View>
              )}
              {riskLevel === 2 && (
                <View>
                  <AppText style={styles.infoText}>
                    • 위험과 수익의 균형을 맞추고자 하는 투자자에게 적합해요.
                  </AppText>
                  <AppText style={styles.infoText}>
                    • 주식과 채권을 적절히 혼합하여 중간 정도의 변동성을 가지며,
                    중간 수준의 수익을 기대할 수 있어요.
                  </AppText>
                </View>
              )}
              {riskLevel === 3 && (
                <View>
                  <AppText style={styles.infoText}>
                    • 높은 수익을 기대하며 더 큰 변동성과 위험을 감수할 준비가
                    된 투자자에게 적합해요.
                  </AppText>
                  <AppText style={styles.infoText}>
                    • 성장주, 신흥 시장 주식, 기술주 등 고위험 자산에 투자하여
                    자본 이익을 극대화하고자 해요.
                  </AppText>
                </View>
              )}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.button,
                  isRiskNull() ? styles.disabledButton : "",
                ]}
                onPress={isRiskNull() ? null : handleNextStep}
              >
                <AppText style={{ fontSize: 18, color: "white" }}>다음</AppText>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.container}>
            <View style={styles.textContainer}>
              <AppText style={{ fontSize: 25 }}>
                관심있는 분야를 한 가지 선택해주세요.
              </AppText>
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
                  <AppText
                    style={[
                      {
                        fontSize: 17,
                        color: interest === code ? "white" : "black",
                      },
                    ]}
                  >
                    {name}
                  </AppText>
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
                <AppText style={{ fontSize: 18, color: "white" }}>생성</AppText>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 4:
        return (
          <View style={styles.container}>
            <AppText>Loading...</AppText>
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
  riskContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  riskInfo: {
    flex: 1,
    padding: 30,
    marginTop: 30,
  },
  infoText: {
    fontSize: 18,
    marginBottom: 40,
    textAlign: "justify",
  },
  input_Amount: {
    justifyContent: "center", // 가로 방향에서 중앙 정렬
    marginVertical: 10,
    fontSize: 30,
    borderBottomWidth: 1,
  },
  addButton: {
    backgroundColor: "#ddd",
    marginRight: 10,
    padding: 8,
    borderRadius: 5,
  },
  input_Risk: {
    justifyContent: "center", // 가로 방향에서 중앙 정렬
    height: 100,
    backgroundColor: "#ddd",
    alignItems: "center",
    padding: 15,
    borderRadius: 5,
  },
  sectorContainer: {
    flex: 2,
    flexDirection: "row",
    padding: 20,
    flexWrap: "wrap",
    alignItems: "flex-start",
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
    backgroundColor: "#6495ED",
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
