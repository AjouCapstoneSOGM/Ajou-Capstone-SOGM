import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import AppText from "../../../utils/AppText";
import { VictoryPie, VictoryLabel } from "victory-native";
import { Button, Icon } from "@rneui/base";
import { width, height } from "../../../utils/utils";

const AutoPage2 = ({ step, setStep, riskLevel, setRiskLevel }) => {
  const [disabled, setDisabled] = useState(true);

  const riskText = ["안정투자형", "위험중립형", "적극투자형"];
  const riskColor = ["#93ff93", "#ffbf44", "#ff5858"];
  const infoText = [
    [
      "변동성이 낮고 안정적인 수익을 목표로 하는 투자자에게 적합해요",
      "안전자산에 투자하는 비율을 높여서 자본 보전을 최우선으로 해요",
      "주식 70% 안전자산 30%로 자산을 배분해요",
    ],
    [
      "위험과 수익의 균형을 맞추고자 하는 투자자에게 적합해요",
      "주식과 안전자산을 적절히 혼합하여 중간 정도의 수익과 위험이 기대돼요",
      "주식 80% 안전자산 20%로 자산을 배분해요",
    ],
    [
      "높은 수익을 기대하지만 손실을 감수할 준비가 된 투자자에게 적합해요",
      "주식에 투자하는 비율을 높여서 수익 기회를 최대한으로 하고자 해요",
      "주식 90% 안전자산 10%로 자산을 배분해요",
    ],
  ];
  const stock = [70, 80, 90];
  const safe = [30, 20, 10];

  const handleNextStep = () => {
    setStep(step + 1);
  };

  useEffect(() => {
    if (riskLevel > 0) setDisabled(false);
    else setDisabled(true);
  }, [riskLevel]);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <AppText style={styles.titleText}>
          포트폴리오의 위험도를 선택해주세요.
        </AppText>
      </View>
      <View style={styles.contentsContainer}>
        {[1, 2, 3].map((level, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.input_Risk]}
            onPress={() => {
              setRiskLevel(level);
            }}
          >
            <Icon
              name="checkcircle"
              type="antdesign"
              color={riskLevel === index + 1 ? riskColor[index] : "#808080"}
              style={{ marginRight: 10 }}
            />
            <AppText
              style={{
                color: riskColor[index],
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {riskText[index]}
            </AppText>
          </TouchableOpacity>
        ))}
        <ScrollView persistentScrollbar={true}>
          {riskLevel && (
            <>
              <View style={styles.chartContainer}>
                <VictoryPie
                  colorScale={["tomato", "green"]}
                  data={[
                    { x: "주식", y: stock[riskLevel - 1] },
                    { x: "안전자산", y: safe[riskLevel - 1] },
                  ]}
                  width={width * 250}
                  height={width * 250}
                  labelComponent={
                    <VictoryLabel
                      style={{
                        fill: "#f0f0f0",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    />
                  }
                  labelRadius={({ innerRadius }) => innerRadius + width * 40}
                />
              </View>
              <View style={styles.infoContainer}>
                <AppText style={styles.infoText}>
                  {infoText[riskLevel - 1][0]}
                </AppText>
                <AppText style={styles.infoText}>
                  {infoText[riskLevel - 1][1]}
                </AppText>
                <AppText style={styles.infoText}>
                  {infoText[riskLevel - 1][2]}
                </AppText>
              </View>
            </>
          )}
        </ScrollView>
      </View>
      <AppText style={styles.safeinfoText}>안전자산이란?</AppText>
      <AppText style={styles.safeinfoText}>
        시장이 불안정해도 가치가 잘 보존되는 경향이 있는 자산을 뜻해요. 주로 금,
        달러와 같은 종목으로 구성돼요.
      </AppText>
      <View style={styles.nextButtonContainer}>
        <Button
          buttonStyle={styles.nextButton}
          title="다음"
          onPress={handleNextStep}
          disabled={disabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  safeinfoText: {
    fontSize: 11,
    marginBottom: 3,
    color: "#999",
  },
  contentsContainer: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: "#333",
    paddingHorizontal: width * 15,
    paddingTop: height * 5,
  },
  textContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
  },
  input_Risk: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: height * 10,
    paddingBottom: height * 10,
    borderBottomWidth: 1.5,
    borderColor: "#808080",
  },
  riskInfo: {
    backgroundColor: "yellow",
    alignItems: "stretch",
  },
  infoContainer: {
    alignSelf: "flex-start",
    marginTop: -25,
  },
  infoText: {
    fontSize: 17,
    textAlign: "left",
    marginBottom: 8,
    color: "#f0f0f0",
  },
  chartContainer: {
    marginTop: height * -35,
    alignItems: "center",
  },
  nextButton: {
    backgroundColor: "#6262e8",
    borderRadius: 10,
    height: height * 50,
  },
  nextButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: height * 5,
    backgroundColor: "#333",
  },
});

export default AutoPage2;
