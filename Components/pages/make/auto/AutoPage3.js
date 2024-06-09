import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

import AppText from "../../../utils/AppText";
import { Button, Icon } from "@rneui/base";
import { height, width } from "../../../utils/utils";
import ModalComponent from "../../../utils/Modal";

const AutoPage3 = ({ step, setStep, sector, interest, setInterest }) => {
  const [disabled, setDisabled] = useState(true);
  const [infoVisible, setInfoVisible] = useState(false);
  const [infoContent, setInfoContent] = useState("");

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

  const sectorinfos = [
    "돈을 관리하고 투자하는 서비스를 제공하는 회사들로 구성됩니다.\n은행, 보험사, 주식회사가 여기에 포함됩니다. 예를 들어, 돈을 예금하거나 대출을 받는 은행이 이에 해당합니다.",
    "정보를 주고받고 소통을 돕는 서비스를 제공하는 회사들로 구성됩니다.\n인터넷, 전화 서비스 제공업체, 그리고 엔터테인먼트 회사들이 여기에 포함됩니다. 예를 들어, 통신사나 인터넷 회사가 여기에 속합니다.",
    "건설, 운송, 기계 및 장비와 관련된 제품과 서비스를 제공하는 회사들로 구성됩니다.\n예를 들어, 건물을 짓는 건설 회사나 택배업을 하는 회사들이 여기에 포함됩니다.",
    "일상생활에서 꼭 필요한 제품을 만드는 회사들로 구성됩니다. 식품, 음료, 세제 등을 만드는 회사들이 여기에 포함됩니다.\n예를 들어, 식품을 만드는 회사가 여기에 속합니다.",
    "전력과 가스를 공급하는 회사들로 구성됩니다. 이 섹터는 일상 생활에 필수적인 공공 서비스를 안정적으로 제공하는 데 중점을 둡니다.\n예를 들어, 전기를 생산하고 공급하는 전력 회사, 도시가스를 공급하는 회사들이 여기에 포함됩니다.",
    "",
    "에너지 시설 및 서비스를 제공하고, 석유 및 가스를 생산하는 회사들로 구성됩니다.\n이 섹터는 에너지의 생산과 공급에 중점을 둡니다. 예를 들어, 석유를 정제하는 회사, 친환경 에너지 회사들이 여기에 포함됩니다.",
    "약품, 의료기기, 생명공학 관련 제품과 서비스를 제공하는 회사들로 구성됩니다.\n예를 들어, 약이나 병원에서 사용하는 의료기기를 만드는 회사들이 여기에 포함됩니다.",
    "컴퓨터, 소프트웨어, 전자기기 등을 만드는 회사들로 구성됩니다.\n예를 들어, 컴퓨터나 스마트폰을 만드는 회사들이 여기에 포함됩니다.",
    "다양한 화학 물질, 금속, 플라스틱 등을 생산하는 회사들로 구성됩니다.\n예를 들어, 철강이나 플라스틱을 만드는 회사가 여기에 속합니다.",
    "경제 상황에 따라 수요가 변하는 제품을 만드는 회사들로 구성됩니다.\n자동차, 의류, 가전제품 등을 만드는 회사들이 여기에 포함됩니다. 예를 들어, 우리가 타는 자동차나 입는 옷을 만드는 회사가 여기에 속합니다.",
  ];

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const toggleInfoModal = () => {
    setInfoVisible(!infoVisible);
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
          {Object.entries(sector).map(
            ([code, name], index) =>
              name !== "기타" && (
                <TouchableOpacity
                  key={code}
                  style={styles.sectorContent}
                  onPress={() => setInterest(code)}
                  activeOpacity={0.5}
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
                  <TouchableOpacity
                    style={styles.stockinfoButton}
                    onPress={() => {
                      if (!disabled) {
                        setInfoContent(sectorinfos[index]);
                        toggleInfoModal();
                      }
                    }}
                    activeOpacity={1}
                  >
                    <Icon
                      name="questioncircleo"
                      type="antdesign"
                      color={"#888"}
                      size={width * 20}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              )
          )}
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
      <ModalComponent isVisible={infoVisible} onToggle={toggleInfoModal}>
        <AppText style={{ fontSize: 15, color: "#fff" }}>{infoContent}</AppText>
      </ModalComponent>
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
    paddingBottom: height,
    backgroundColor: "#333",
  },
  safeinfoText: {
    fontSize: 11,
    marginBottom: 3,
    color: "#999",
  },
  stockinfoButton: {
    marginHorizontal: width * 5,
    marginVertical: height,
    padding: 0,
  },
});
export default AutoPage3;
