import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

import AppText from "../../../utils/AppText";
import { Button, Icon } from "@rneui/base";
import { height, width } from "../../../utils/utils";

const AutoPage3 = ({ step, setStep, sector, interest, setInterest }) => {
  const [disabled, setDisabled] = useState(true);
  const icons = [
    ["bank", "material-community"], // 금융
    ["cellphone-message", "material-community"], // 커뮤니케이션 서비스
    ["factory", "material-community"], // 산업재
    ["cart-outline", "material-community"], // 필수소비재
    ["flash-outline", "material-community"], // 유틸리티
    ["checkcircle", "antdesign"],
    ["gas-station", "material-community"], // 에너지
    ["hospital-box-outline", "material-community"], // 건강관리
    ["laptop", "material-community"], // IT
    ["texture", "material-community"], // 소재
    ["shopping", "material-community"], // 경기관련소비재
  ];

  const handleNextStep = () => {
    setStep(step + 1);
  };

  useEffect(() => {
    if (interest === "") setDisabled(true);
    else setDisabled(false);
  }, [interest]);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <AppText style={styles.titleText}>
          관심있는 분야를 한 가지 선택해주세요.
        </AppText>
      </View>
      <View style={styles.sectorContainer}>
        <ScrollView persistentScrollbar={true}>
          {Object.entries(sector).map(([code, name], index) => (
            <TouchableOpacity
              key={code}
              style={styles.sectorContent}
              onPress={() => setInterest(code)}
            >
              <Icon
                name={icons[index][0]}
                type={icons[index][1]}
                color={interest === code ? "#97f697" : "#808080"}
                style={{ marginRight: 20 }}
              />
              <AppText
                style={[
                  {
                    fontSize: 27,
                    fontWeight: "bold",
                    color: interest === code ? "#97f697" : "#f0f0f0",
                  },
                ]}
              >
                {name}
              </AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <AppText style={styles.safeinfoText}>
          특정 분야와 수익률은 알려진 직접적인 관계가 없어요.
        </AppText>
      </View>
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
    alignItems: "stretch",
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
  sectorContainer: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: "#333",
    paddingHorizontal: width * 15,
    paddingTop: height * 5,
  },
  sectorContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 7,
    marginTop: 7,
    borderBottomColor: "#434343",
    borderBottomWidth: 1,
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
  safeinfoText: {
    fontSize: 11,
    marginBottom: 3,
    color: "#999",
  },
});
export default AutoPage3;
