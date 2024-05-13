import React from "react";
import { Text, StyleSheet } from "react-native";

const AppText = ({ children, style, ...rest }) => (
  <Text style={[styles.defaultStyle, style]} {...rest}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  defaultStyle: {
    fontFamily: "NotoSansKR_400Regular", // 기본 폰트 설정
  },
});

export default AppText;
