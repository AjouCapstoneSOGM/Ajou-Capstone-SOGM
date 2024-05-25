import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";

import AppText from "../../../utils/AppText";
import { filteringNumber } from "../../../utils/utils";

const AutoPage1 = ({ amount, setAmount }) => {
  const isAmountEnough = () => {
    if (amount >= 1000000) {
      return true;
    }
    return false;
  };

  const handleAmount = (value) => {
    setAmount(filteringNumber(value));
  };

  const addValuetoAmount = (value) => {
    setAmount(Number(amount) + value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <AppText style={{ fontSize: 25 }}>
          포트폴리오에 사용할 금액을 입력해주세요.
        </AppText>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input_Amount}
          keyboardType="numeric"
          value={amount.toString()}
          onChangeText={(value) => Number(handleAmount(value))}
          placeholder="금액을 입력하세요"
        />
        <View style={{ flexDirection: "row", marginBottom: 10 }}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addValuetoAmount(100000)}
          >
            <AppText style={{ color: "#555" }}>+ 10만</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addValuetoAmount(1000000)}
          >
            <AppText style={{ color: "#555" }}>+ 100만</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addValuetoAmount(10000000)}
          >
            <AppText style={{ color: "#555" }}>+ 1000만</AppText>
          </TouchableOpacity>
        </View>
        {amount && !isAmountEnough() && (
          <AppText style={{ color: "red", alignSelf: "baseline" }}>
            최소 100만원 이상 가능합니다.
          </AppText>
        )}
      </View>
      <View style={styles.buttonContainer}></View>
    </View>
  );
};
const styles = StyleSheet.create({});
export default AutoPage1;
