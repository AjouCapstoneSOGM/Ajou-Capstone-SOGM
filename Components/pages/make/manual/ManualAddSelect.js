import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import AppText from "../../../utils/AppText.js";
import { Button, Divider, Icon } from "@rneui/base";
import { SafeAreaView } from "react-native-safe-area-context";
import { height, width } from "../../../utils/utils";

const ManualAddSelect = ({ step, setStep }) => {
  const [path, setPath] = useState("search");
  const [disabled, setDisabled] = useState(true);

  const handleNextStep = () => {
    if (path === "search") setStep(step + 1);
    else if (path === "select") setStep(10);
  };

  return (
    <SafeAreaView style={styles.container}>
      {step === 0 && (
        <View style={{ flex: 1 }}>
          <View style={styles.textContainer}>
            <AppText style={{ fontSize: 30, fontWeight: "bold" }}>
              종목 추가 방법을 선택하세요
            </AppText>
          </View>
          <View style={styles.contentsContainer}>
            <TouchableOpacity
              style={styles.selectAutoButton}
              onPress={() => setPath("search")}
            >
              <View>
                <AppText
                  style={{
                    marginBottom: 20,
                    fontSize: 30,
                    fontWeight: "bold",
                    color: path === "search" ? "#97f697" : "#f0f0f0",
                  }}
                >
                  종목명 또는 종목번호로 검색
                </AppText>
              </View>
            </TouchableOpacity>
            <Divider style={{ marginVertical: 20 }} />
            <TouchableOpacity
              style={styles.selectAutoButton}
              onPress={() => setPath("select")}
            >
              <View>
                <AppText
                  style={{
                    marginBottom: 20,
                    fontSize: 30,
                    fontWeight: "bold",
                    color: path === "select" ? "#97f697" : "#f0f0f0",
                  }}
                >
                  가치지표 상위권 종목에서 선택
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
            />
          </View>
        </View>
      )}
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

export default ManualAddSelect;
