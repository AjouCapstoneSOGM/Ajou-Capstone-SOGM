import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import urls from "../../utils/urls";
import { setUsertoken } from "../../utils/localStorageUtils.js";
import { useAuth } from "../../utils/AuthContext.js";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

const Login = ({ navigation }) => {
  const [useremail, setUseremail] = useState("Test");
  const [password, setPassword] = useState("Test");
  const { login } = useAuth();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const fetchLoginInfo = async () => {
    try {
      const response = await fetch(`${urls.springUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: useremail,
          password: password,
          expoPushToken: expoPushToken,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setUsertoken(data.token);
        login();
        navigation.navigate("Home", { screen: "Home" });
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.HomeText}>로그인 화면</Text>

      <TextInput
        style={styles.inputbox}
        value={useremail}
        placeholder="Email"
        onChangeText={setUseremail}
      ></TextInput>
      <TextInput
        style={styles.inputbox}
        value={password}
        placeholder="Password"
        onChangeText={setPassword}
        secureTextEntry
      ></TextInput>

      <TouchableOpacity onPress={fetchLoginInfo} style={styles.Inputbotton}>
        <Text style={styles.BottomText}>로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("SocialLogin", { screen: "SocialLogin" })
        }
        style={styles.Inputbotton}
      >
        <Text style={styles.BottomText}>소셜 로그인</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Signup", { screen: "Signup" })}
        style={styles.NextBottom}
      >
        <Text style={styles.BottomText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (await Notifications.getExpoPushTokenAsync({ projectId: 'f3f90f52-c78a-4e7e-a7b0-ac053ff5dd0c' })).data;
    alert(token);
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  HomeText: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: "10%",
  },
  NextBottom: {
    backgroundColor: "purple",
    padding: 10,
    marginTop: "10%",
    width: "50%",
    alignSelf: "center",
    borderRadius: 10,
  },
  BottomText: {
    fontSize: 15,
    color: "white",
    textAlign: "center",
  },
  Inputbotton: {
    backgroundColor: "purple",
    width: "50%",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  inputbox: {
    width: "50%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
});
