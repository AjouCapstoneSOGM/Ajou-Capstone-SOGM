import React, { useEffect, useState } from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";
import SearchStocks from "./SearchStocks.js";

const MakeManualPortfolio = ({ setCurrentStep }) => {
  const [currentManualStep, setCurrentManualStep] = useState(1);

  const handleNextStep = () => {
    setCurrentManualStep(currentManualStep + 1);
  };

  const renderManualStep = () => {
    switch (currentManualStep) {
      case 1:
        return (
          <View style={styles.container}>
            <SearchStocks />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleNextStep}>
                <Text style={{ fontSize: 18, color: "white" }}>다음</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
    }
  };

  return <View style={styles.container}>{renderManualStep()}</View>;
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
  },
  buttonContainer: {
    alignItems: "stretch",
    padding: 20,
  },
  button: {
    justifyContent: "center", // 가로 방향에서 중앙 정렬
    backgroundColor: "#6495ED",
    alignItems: "center",
    borderRadius: 10,
    padding: 18,
  },
});
export default MakeManualPortfolio;
