import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Alert, Switch  } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Divider } from "@rneui/base";
import { width, height } from "../utils/utils";
import * as Notifications from 'expo-notifications';

import AppText from "../utils/AppText";
import { getRebalanceAlarm, setRebalanceAlarm } from "../utils/localStorageUtils.js";
import { usePushNotifications } from "../utils/PushNotificationContext.js";

const Settings = ({ navigation }) => {
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);
  const [pushTokenCheck, setPushTokenCheck] = useState(1);
  const { expoPushToken } = usePushNotifications();

  useEffect(() => {
    getRebalanceAlarm().then((res) => {
      setHasNotificationPermission(res == "granted");
    })
  }, []);

  const handleNotificationPermission = async () => {
    if (hasNotificationPermission) {
      setHasNotificationPermission(false);
      setRebalanceAlarm("denied");
    } 
    else {
      const { status } = await Notifications.requestPermissionsAsync();
      setRebalanceAlarm("granted");
      if (status === 'granted') {
        setHasNotificationPermission(true);
      } 
      else {
        Alert.alert("알림", "알림 권한이 거부되었습니다.");
      }
    }
  };

  const handlepushTokenCheck = () => {
    setPushTokenCheck(pushTokenCheck + 1);
    if (pushTokenCheck > 5){
      Alert.alert("Token", expoPushToken);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button
          type="clear"
          onPress={() => {
            navigation.goBack();
          }}
          icon={{ name: "left", type: "antdesign", color: "#333" }}
        />
      </View>
      <View style={styles.textContainer}>
        <AppText style={{ fontSize: 30, fontWeight: "bold" }}>설정</AppText>
      </View>
      <View style={styles.contentsContainer}>
        <TouchableOpacity 
          style={[styles.setting_list]}
          onPress={handlepushTokenCheck}
        >
          <AppText style={{
            color: "white",
            fontSize: 18,
            fontWeight: "bold",
          }}
          >
            리밸런싱 알람 수신
          </AppText>
          <Switch
            value={hasNotificationPermission}
            onValueChange={handleNotificationPermission}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: "#f0f0f0",
  },
  header: {
    height: 60,
    alignItems: "flex-start",
  },
  textContainer: {
    height: 90,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  contentsContainer: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: "#333",
    paddingHorizontal: width * 15,
    paddingTop: height * 5,
  },
  setting_list: {
    flexDirection: 'row',  // 가로로 배치
    justifyContent: 'space-between',  // 양 끝에 배치
    alignItems: 'center',
    marginTop: height * 10,
    paddingBottom: height * 10,
    borderBottomWidth: 1.5,
    borderColor: "#808080",
  },
});

export default Settings;
