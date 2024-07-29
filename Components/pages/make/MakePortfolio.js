import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import AutoPortfolio from "./auto/AutoPortfolio.js";
import ManualPortfolio from "./manual/ManualPortfolio.js";
import AppText from "../../utils/AppText";
import { Button, Divider, Icon } from "@rneui/base";
import { SafeAreaView } from "react-native-safe-area-context";
import { width, height } from "../../utils/utils";

const MakePortfolio = ({ navigation }) => {
  const [step, setStep] = useState(0);
  const [path, setPath] = useState("");
  const [disabled, setDisabled] = useState(true);

  const handleNextStep = () => {
    setStep(step + 1);
  };

  useEffect(() => {
    if (path) setDisabled(false);
  }, [path]);

  return (
    <SafeAreaView style={styles.container}>
      {step === 0 && (
        <View style={{ flex: 1 }}>
          <Button
            containerStyle={styles.goBackButton}
            type="clear"
            onPress={() => {
              navigation.goBack();
            }}
            icon={{ name: "left", type: "antdesign", color: "#333" }}
          />
          <Divider style={styles.topDivider} />
          <View style={styles.textContainer}>
            <AppText style={{ fontSize: 30, fontWeight: "bold" }}>
              어떤 포트폴리오를 생성하실건가요?
            </AppText>
          </View>
          <View style={styles.contentsContainer}>
            <TouchableOpacity
              style={styles.selectAutoButton}
              onPress={() => setPath("auto")}
            >
              <Icon
                name="checkcircle"
                type="antdesign"
                color={path === "auto" ? "#97f697" : "#808080"}
                style={{ marginTop: 10, marginRight: 10 }}
              />
              <View>
                <AppText
                  style={{
                    marginBottom: 20,
                    fontSize: 30,
                    fontWeight: "bold",
                    color: path === "auto" ? "#97f697" : "#f0f0f0",
                  }}
                >
                  자동 포트폴리오
                </AppText>
                <AppText style={{ fontSize: 16, color: "#c0c0c0" }}>
                  간단한 정보를 통해 종목을 직접 선별해줘요
                </AppText>
                <AppText style={{ fontSize: 16, color: "#c0c0c0" }}>
                  종목들의 자동 리밸런싱 기능이 제공돼요
                </AppText>
              </View>
            </TouchableOpacity>
            <Divider style={{ marginVertical: 20 }} />
            <TouchableOpacity
              style={styles.selectAutoButton}
              onPress={() => setPath("manual")}
            >
              <Icon
                name="checkcircle"
                type="antdesign"
                color={path === "manual" ? "#97f697" : "#808080"}
                style={{ marginTop: 10, marginRight: 10 }}
              />
              <View>
                <AppText
                  style={{
                    marginBottom: 20,
                    fontSize: 30,
                    fontWeight: "bold",
                    color: path === "manual" ? "#97f697" : "#f0f0f0",
                  }}
                >
                  수동 포트폴리오
                </AppText>
                <AppText style={{ fontSize: 16, color: "#c0c0c0" }}>
                  원하는 종목을 직접 골라담을 수 있어요
                </AppText>
                <AppText style={{ fontSize: 16, color: "#c0c0c0" }}>
                  종목의 가치지표를 확인하면서 고를 수 있어요
                </AppText>
              </View>
            </TouchableOpacity>
            <Divider style={{ marginVertical: 20 }} />
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
      )}
      {step >= 1 && path === "auto" && <AutoPortfolio />}
      {step >= 1 && path === "manual" && <ManualPortfolio />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  goBackButton: {
    alignSelf: "flex-start",
    marginTop: 5,
  },
  topDivider: {
    marginVertical: 50,
    borderWidth: 4,
    borderColor: "#bbb",
  },
  textContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  contentsContainer: {
    flex: 1,
    backgroundColor: "#333",
    paddingHorizontal: width * 20,
    paddingVertical: height * 15,
  },
  selectAutoButton: {
    flexDirection: "row",
    paddingVertical: 50,
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

export default MakePortfolio;
