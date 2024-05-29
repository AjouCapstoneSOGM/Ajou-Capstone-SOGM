import { Button, Overlay } from "@rneui/base";
import React from "react";
import { StyleSheet, View } from "react-native";
import AppText from "./AppText";

const InfoModal = ({ isVisible, onToggle, children }) => {
  return (
    <Overlay
      isVisible={isVisible}
      onBackdropPress={onToggle}
      overlayStyle={styles.overlay}
    >
      <Button
        containerStyle={styles.closeButton}
        onPress={onToggle}
        type="clear"
        icon={{ name: "close", type: "antdesign", color: "#f0f0f0" }}
      />
      <View style={styles.content}>
        <AppText style={styles.text}>{children}</AppText>
      </View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  overlay: {
    width: "90%",
    borderRadius: 10,
    backgroundColor: "#333",
  },
  content: {
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    color: "#f0f0f0",
  },
  closeButton: {
    marginHorizontal: -5,
    position: "absolute",
    top: 3,
    right: 3,
  },
});

export default InfoModal;
