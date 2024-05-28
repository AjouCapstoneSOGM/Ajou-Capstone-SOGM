import React from "react";
import { View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import AppText from "../../../utils/AppText";
import { VictoryPie, VictoryLabel } from "victory-native";
import { Icon } from "@rneui/base";

const AutoPage2 = ({ riskLevel, setRiskLevel }) => {
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
                fontSize: 25,
                fontWeight: "bold",
              }}
            >
              {riskText[index]}
            </AppText>
          </TouchableOpacity>
        ))}
        {riskLevel && (
          <ScrollView>
            <View style={styles.chartContainer}>
              <VictoryPie
                colorScale={["tomato", "green"]}
                data={[
                  { x: "주식", y: stock[riskLevel - 1] },
                  { x: "안전자산", y: safe[riskLevel - 1] },
                ]}
                width={250}
                height={250}
                labelComponent={
                  <VictoryLabel style={{ fill: "#f0f0f0", fontSize: 13 }} />
                }
                labelRadius={({ innerRadius }) => innerRadius + 25}
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
          </ScrollView>
        )}
        <View style={styles.safeInfoContainer}>
          <AppText style={styles.safeinfoText}>안전자산이란?</AppText>
          <AppText style={styles.safeinfoText}>
            주식과 움직임이 반대인 달러와 금으로 구성되어 있습니다.
          </AppText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  topDivider: {
    marginTop: 10,
    borderWidth: 4,
    borderColor: "#333",
  },
  safeInfoContainer: {
    position: "absolute",
    bottom: 5,
    left: 20,
  },
  safeinfoText: {
    fontSize: 11,
    color: "#808080",
  },
  contentsContainer: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: "#333",
    paddingHorizontal: 20,
    paddingTop: 10,
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
    marginTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
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
    fontSize: 13,
    textAlign: "left",
    marginBottom: 8,
    color: "#f0f0f0",
  },
  chartContainer: {
    alignItems: "center",
  },
});

export default AutoPage2;
