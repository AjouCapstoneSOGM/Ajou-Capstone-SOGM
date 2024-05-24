import { useState, useEffect, useRef } from "react";
import { View, Button, Platform, StyleSheet, Alert } from "react-native";
import Checkbox from "expo-checkbox";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppText from "../utils/AppText";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function UserSetting() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [isAlarmAllowed, setisAlarmAllowed] = useState(false);

  const storeData = async (value) => {
    try {
      console.log("asd");
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("isAlarmAllowed", jsonValue);
    } catch (e) {
      // saving error
    }
  };
  const test = (value) => {
    Alert.alert("asd");
    storeData(value);
  };
  const getSettingData = async () => {
    try {
      const value = await AsyncStorage.getItem("isAlarmAllowed");
      if (value !== null) {
        setisAlarmAllowed(value);
        Alert.alert("dsa");
      }
    } catch (e) {
      // error reading value
    }
  };
  useEffect(() => {
    getSettingData();
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View style={styles.container}>
      <AppText style={styles.HomeText}>리밸런싱 설정 화면</AppText>
      <View style={styles.section}>
        <AppText>리밸런싱 알림 허용</AppText>
        <Checkbox
          style={{ margin: 8 }}
          value={isAlarmAllowed}
          onValueChange={setisAlarmAllowed}
          onPress={test(isAlarmAllowed)}
        />
      </View>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <AppText>
          Title: {notification && notification.request.content.title}{" "}
        </AppText>
        <AppText>
          Body: {notification && notification.request.content.body}
        </AppText>
        <AppText>
          Data:{" "}
          {notification && JSON.stringify(notification.request.content.data)}
        </AppText>
      </View>

      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
    </View>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "리밸런싱 알림",
      body: "포트폴리오가 갱신되었어요.\n 리밸런싱 내역을 확인해 주세요.",
      data: { data: "goes here" },
    },
    trigger: { seconds: 2 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "your-project-id",
      })
    ).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
  },
  HomeText: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: "10%",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  disabledButton: {
    backgroundColor: "#DADADA", // 비활성화 상태의 배경색 변경
  },
  button: {
    justifyContent: "center", // 가로 방향에서 중앙 정렬
    backgroundColor: "#6495ED",
    alignItems: "center",
    borderRadius: 10,
    padding: 18,
  },
  section: {
    flexDirection: "row", // 구성요소 가로로 배치
    justifyContent: "center",
    alignItems: "center",
  },
});
