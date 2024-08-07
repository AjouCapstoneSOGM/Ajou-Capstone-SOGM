import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import { setRebalanceAlarm } from "./localStorageUtils";

const PushNotificationContext = createContext(null);

export const PushNotificationProvider = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState("emptyExpoToken");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [isNotificationEnable, setIsNotificationEnable] = useState(false);

  useEffect(() => {
    console.log(isNotificationEnable);
    if (isNotificationEnable) {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });
    } else {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
    }
  }, [isNotificationEnable]);

  useEffect(() => {
    setRebalanceAlarm("denied");

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
    <PushNotificationContext.Provider
      value={{ expoPushToken, notification, setIsNotificationEnable }}
    >
      {children}
    </PushNotificationContext.Provider>
  );
};

export const usePushNotifications = () => useContext(PushNotificationContext);

async function registerForPushNotificationsAsync() {
  let token = "emptyExpoToken";

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  //if (Device.isDevice) {
  if (true) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    setRebalanceAlarm(existingStatus);
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "f3f90f52-c78a-4e7e-a7b0-ac053ff5dd0c",
      })
    ).data;
    setIsNotificationEnable(true);
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}
