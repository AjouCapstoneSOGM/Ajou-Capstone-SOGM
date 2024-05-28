import React from "react";
import { View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

import AppText from "../../../utils/AppText";
import { Icon } from "@rneui/base";

const AutoPage3 = ({ sector, interest, setInterest }) => {
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

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <AppText style={styles.titleText}>
          관심있는 분야를 한 가지 선택해주세요.
        </AppText>
      </View>
      <View style={styles.sectorContainer}>
        <ScrollView>
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
    backgroundColor: "#333",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectorContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 7,
    marginTop: 7,
    borderBottomColor: "#434343",
    borderBottomWidth: 1,
  },
});
export default AutoPage3;
