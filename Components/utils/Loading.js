import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

const Loading = ({ size = "large", color = "#6495ed" }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Loading;
