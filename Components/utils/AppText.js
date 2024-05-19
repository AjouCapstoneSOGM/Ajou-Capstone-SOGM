import React from "react";
import { Text, StyleSheet } from "react-native";

const AppText = ({ children, style, ...rest }) => {
  // 스타일을 평면화하고 기본값을 빈 객체로 설정하여 안전하게 처리
  const flattenedStyle = StyleSheet.flatten(style) || {};

  // fontWeight가 bold로 설정된 경우, bold 폰트를 사용하도록 fontFamily를 변경
  const fontFamily =
    flattenedStyle.fontWeight === "bold" ? "pretendard-bold" : "pretendard";

  // fontWeight를 제거하여 기본 폰트 스타일을 덮어쓰지 않도록 합니다.
  const { fontWeight, ...restStyle } = flattenedStyle;

  return (
    <Text style={[styles.defaultStyle, { fontFamily }, restStyle]} {...rest}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  defaultStyle: {
    fontFamily: "pretendard",
  },
});

export default AppText;
