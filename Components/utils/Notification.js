import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from "react-native";
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
      <Icon name="caretright" size={25} color="rgba(0, 0, 0, 0.7)" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flexDirection: "row",
    position: "absolute",
    top: 10,
    left: 20,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 15,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
  },
});

export default NotificationBubble;
