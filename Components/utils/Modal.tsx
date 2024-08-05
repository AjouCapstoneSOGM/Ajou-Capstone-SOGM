import { Button, Overlay } from "@rneui/base";
import React from "react";
import { StyleSheet, View } from "react-native";

type ModalComponentType = {
  isVisible: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

const ModalComponent: React.FC<ModalComponentType> = ({
  isVisible,
  onToggle,
  children,
}) => {
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
      <View style={styles.content}>{children}</View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  overlay: {
    width: "90%",
    borderRadius: 5,
    backgroundColor: "#333",
  },
  content: {
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  closeButton: {
    marginHorizontal: -5,
    position: "absolute",
    top: 3,
    right: 3,
  },
});

export default ModalComponent;
