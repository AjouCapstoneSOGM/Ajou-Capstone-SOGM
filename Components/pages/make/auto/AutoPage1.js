import React, { useEffect, useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import AppText from "../../../utils/AppText";
import { filteringNumber, height } from "../../../utils/utils";
import { Button } from "@rneui/base";

const AutoPage1 = ({ step, setStep, amount, setAmount }) => {
  const [disabled, setDisabled] = useState(true);
  const isAmountEnough = () => amount >= 1000000;

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handleAmount = (value) => {
    const filteredValue = filteringNumber(value);
    setAmount(filteredValue);
  };

  const addValuetoAmount = (value) => {
    setAmount((prevAmount) => Number(prevAmount) + value);
  };

  useEffect(() => {
    if (amount < 1000000) setDisabled(true);
    else setDisabled(false);
  }, [amount]);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <AppText style={styles.titleText}>
          얼마를 투자하실 생각이신가요?
        </AppText>
      </View>
      <View style={styles.contentsContainer}>
        <TextInput
          style={styles.inputAmount}
          keyboardType="numeric"
          value={amount.toString()}
          onChangeText={handleAmount}
          placeholder="금액을 입력해주세요"
          placeholderTextColor="#808080"
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addValuetoAmount(100000)}
          >
            <AppText style={styles.buttonText}>+10만</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addValuetoAmount(1000000)}
          >
            <AppText style={styles.buttonText}>+100만</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addValuetoAmount(10000000)}
          >
            <AppText style={styles.buttonText}>+1000만</AppText>
          </TouchableOpacity>
        </View>
        {amount > 0 && !isAmountEnough() && (
          <AppText style={styles.errorText}>
            최소 100만원 이상 가능합니다.
          </AppText>
        )}
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
  },
  contentsContainer: {
    flex: 1,
    backgroundColor: "#333",
    paddingHorizontal: 20,
    paddingVertical: 40,
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
  inputAmount: {
    backgroundColor: "transparent",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 5,
    marginTop: 30,
    fontSize: 30,
    color: "#f0f0f0",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 20,
  },
  addButton: {
    backgroundColor: "transparent",
    paddingRight: 20,
  },
  buttonText: {
    color: "#f0f0f0",
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 15,
    marginTop: 20,
    color: "#ff5858",
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

export default AutoPage1;
