import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

import AppText from "../../../utils/AppText";

const AutoPage3 = ({ sector, interest, setInterest }) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <AppText style={{ fontSize: 25 }}>
          관심있는 분야를 한 가지 선택해주세요.
        </AppText>
      </View>
      <View style={styles.sectorContainer}>
        {Object.entries(sector).map(([code, name]) => (
          <TouchableOpacity
            key={code}
            style={[
              styles.input_Interest,
              interest === code ? styles.selectedInput : "",
            ]}
            onPress={() => setInterest(code)}
          >
            <AppText
              style={[
                {
                  fontSize: 17,
                  color: interest === code ? "white" : "black",
                },
              ]}
            >
              {name}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({});
export default AutoPage3;