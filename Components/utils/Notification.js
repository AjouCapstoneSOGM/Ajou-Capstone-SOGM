import React, { useEffect, useRef } from "react";
import { StyleSheet, Animated, TouchableOpacity } from "react-native";
import AppText from "./AppText";
import Icon from "react-native-vector-icons/AntDesign";

const NotificationBubble = ({ message, visible, onClose }) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <TouchableOpacity onPress={onClose} style={styles.overlay}>
      <Animated.View style={[styles.container, { opacity }]}>
        <AppText style={styles.text}>{message}</AppText>
      </Animated.View>
      <Icon name="caretright" size={25} color="rgba(98, 98, 232, 0.7)" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  overlay: {
    zIndex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "rgba(98, 98, 232, 0.7)",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#f0f0f0",
    fontSize: 13,
  },
});

export default NotificationBubble;
