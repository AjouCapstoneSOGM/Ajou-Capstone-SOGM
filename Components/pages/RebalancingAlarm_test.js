import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, StyleSheet, Alert } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import urls from "../utils/urls";
import { getUsertoken } from "../utils/localStorageUtils";
import Constants from 'expo-constants';

//포어그라운드에서 알람이 수신되었을 때 동작 제어
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});


const UserSetting = ({navigation}) => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  //포트폴리오 리스트를 요청
  const fetchPortfolio = async () => {
    try {
      const token = await getUsertoken();
      const response = await fetch(`${urls.springUrl}/api/portfolio`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  //포트폴리오 리스트 중 ID만 추출 후 반환
  const getPortfolioIds = (portfolioList) => {
    result = portfolioList.map((portfolio) => {
      return portfolio.id;
    });
    return result;
  };

  //해당 포트폴리오 ID에 대한 리밸런싱 내역이 존재하는지 확인하는 요청을 보냄
  const fetchRebalancingExist = async (port_id) => {
    try {
      const token = await getUsertoken();
      const response = await fetch(`${urls.springUrl}/api/rebalancing/${port_id}/exists`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        console.error("Fail to fetch rebalancing Exist data");
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    };
  }

  //소유한 포트폴리오 ID에 대해 리밸런싱 내역이 있는지 각각 조회
  const getRebalancingPortfolioIdList = async (portfolioIds) => {
    const promises = portfolioIds.map((id) => {
      return fetchRebalancingExist(id);
    });
    try{
      const result = await Promise.all(promises);;
      return result;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    };
    
  }

  //리밸런싱이 존재하는 포트폴리오가 있는지 확인
  const isRebalancingExist = (data) =>{
    return data.some(item => item.exist === true);
  }
  
  useEffect(() => {
    const loadrebalancing = async () =>{
      try{
        const data = await fetchPortfolio();
        const portfolioList = data.portfolios;
        const portfolioIds = getPortfolioIds(portfolioList);
        const rebalancingPortfolioIdList = await getRebalancingPortfolioIdList(portfolioIds);
        return(rebalancingPortfolioIdList);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setErrorState(true);
      }
    };
    loadrebalancing().then((res) => {  
      console.log("rebalancing list ", res);
      if(isRebalancingExist(res)) {
        schedulePushNotification();
    };});

    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    //알림을 받는 동작
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


  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        {/*<Text>Body: {notification && notification.request.content.body}</Text>*/}
      </View>
      <Button
        title="알림 다시 보내기"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
    </View>
  );
}

async function schedulePushNotification(data) {
  //console.log("Notification data:", data);
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "리밸런싱 내역이 있습니다",
      //body: data,
    },
    trigger: null,
  });
}

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
    token = (await Notifications.getExpoPushTokenAsync()).data;
    //token = (await Notifications.getDevicePushTokenAsync()).data;
    console.log(finalStatus, token);
    
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

export default UserSetting