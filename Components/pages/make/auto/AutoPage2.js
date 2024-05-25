import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";

import AppText from "../../../utils/AppText";

const AutoPage2 = ({ riskLevel, setRiskLevel }) => {
  const riskText = ["안정투자형", "위험중립형", "적극투자형"];
  const riskColor = ["#006400", "#F07C00", "#8B0000"];
  const riskBgColor = ["#90EE90", "#FFDAB9", "#FFB6C1"];

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
            <AppText style={{ color: riskColor[index] }}>{level} 단계</AppText>
            <AppText style={{ fontSize: 16 }}>{riskText[index]}</AppText>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.riskInfo}>
        {riskLevel === 1 && (
          <View>
            <AppText style={styles.infoText}>
              • 변동성이 낮고 안정적인 수익을 목표로 하는 투자자에게 적합해요.
            </AppText>
            <AppText style={styles.infoText}>
              • 안전 자산에 투자하는 비율을 높여서 자본 보전을 최우선으로 해요.
            </AppText>
          </View>
        )}
        {riskLevel === 2 && (
          <View>
            <AppText style={styles.infoText}>
              • 위험과 수익의 균형을 맞추고자 하는 투자자에게 적합해요.
            </AppText>
            <AppText style={styles.infoText}>
              • 주식과 채권을 적절히 혼합하여 중간 정도의 변동성을 가지며, 중간
              수준의 수익을 기대할 수 있어요.
            </AppText>
          </View>
        )}
        {riskLevel === 3 && (
          <View>
            <AppText style={styles.infoText}>
              • 높은 수익을 기대하며 더 큰 변동성과 위험을 감수할 준비가 된
              투자자에게 적합해요.
            </AppText>
            <AppText style={styles.infoText}>
              • 주식에 투자하는 비율을 높여서 자본 이익을 최대한으로 하고자
              해요.
            </AppText>
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <AppText>안전자산?</AppText>
        <AppText>
          주식과 상관관계가 반대인 달러와 금으로 구성되어있어요.
        </AppText>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({});
export default AutoPage2;
