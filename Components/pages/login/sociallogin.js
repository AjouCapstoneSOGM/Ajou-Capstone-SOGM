import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator  } from "react-native";
import urls from "../../utils/urls";
import { WebView } from 'react-native-webview';

import { setUserName, setUsertoken } from "../../utils/localStorageUtils.js";
import { usePushNotifications } from '../../utils/PushNotificationContext.js';

const REST_API_KEY = "fb89b59e48d1926cb3653c68bc05de5e"
const REDIRECT_URI = "https://sogm.ajou.ac.kr/oauth"
const KAKAO_LOGIN_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

const SocialLogin = ({ navigation }) => {
  const [isWebViewVisible, setWebViewVisible] = useState(true);
  const [token, setToken] = useState(null);
  const { expoPushToken } = usePushNotifications();
 
  const fetchKaKaoLoginInfo = async (requestCode) => {
    try {
      const response = await fetch(`${urls.springUrl}/api/auth/social-login/kakao`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessToken: requestCode,
          expoPushToken: expoPushToken,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        console.log("api test:", data);
        await setUsertoken(data.token);
        await setUserName(data.name);
      }
      else { 
        const errorText = await response.text();
        console.error('Server responded with an error:', response);
      }
      // api 작동 후에는 if(respone.ok) 안으로 들어가야 함
      navigation.goBack();
    } catch (error) {
      console.error("Error:", error);
      navigation.goBack();
      throw error;
    }
  };

  const handleWebViewNavigationStateChange = (navState) => {
    const { url } = navState;
    if (url.includes(REDIRECT_URI)) {
      const code = new URL(url).searchParams.get('code');
      if (code) {
        fetchAccessToken(code);
      }
    }
  };

  const fetchAccessToken = async (code) => {
    const tokenUrl = `https://kauth.kakao.com/oauth/token`;
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `grant_type=authorization_code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&code=${code}`,
    });

    const data = await response.json();
    if (data.access_token) {
      setWebViewVisible(false); // Hide WebView after successful login
      console.log("access_token: ", data.access_token);    
      fetchKaKaoLoginInfo(data.access_token);      
    }
  };
  

  return (
    <View style={{ flex: 1}}>
      {isWebViewVisible ? (
        <WebView
          source={{ uri: KAKAO_LOGIN_URL }}
          onNavigationStateChange={handleWebViewNavigationStateChange}
          style={{ flex: 1 }}
        />
      ) : (
        <ActivityIndicator size="large" color="#0000ff" />
      )}
    </View>
  );
};
export default SocialLogin;
