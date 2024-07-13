import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as Font from "expo-font";
import { LogBox } from "react-native";
import { setCustomText } from "react-native-global-props";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import Settings from "./pages/Settings";
import Information from "./pages/Information";
import MyPage from "./pages/MyPage";
import QnA from "./pages/qna/QnA";
import QnACreate from "./pages/qna/QnaCreate";
import Login from "./pages/login/login";
import SocialLogin from "./pages/login/sociallogin";
import Signup from "./pages/login/signup";
import ResetPW from "./pages/login/resetpw";
import Home from "./pages/Home/Home";
import NewsSummary from "./pages/NewsSummary";
import AlertList from "./pages/rebalance/AlertList";
import ViewPortfolio from "./pages/portfolio/ViewPortfolio";
import PortfolioDetails from "./pages/portfolio/PortfolioDetails";
import AddStockInManual from "./pages/portfolio/AddStockInManual";
import ManagementPage from "./pages/portfolio/ManagePortfolio";
import RebalanceRecordList from "./pages/portfolio/RebalanceRecordList";
import ViewRebalanceRecord from "./pages/portfolio/ViewRebalanceRecord";
import MakePortfolio from "./pages/make/MakePortfolio";
import ModifyPortfolio from "./pages/rebalance/ModifyPortfolio";
import { AuthProvider } from "./utils/AuthContext";
import { PortfolioProvider } from "./utils/PortfolioContext";
import { PushNotificationProvider } from "./utils/PushNotificationContext";

const Stack = createStackNavigator();
function ScreenStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // 모든 스크린에서 헤더 숨기기
      }}
      initialRouteName="Home"
    >
      <Stack.Screen name="MyPage" component={MyPage} />
      <Stack.Screen name="QnA" component={QnA} />
      <Stack.Screen name="QnACreate" component={QnACreate} />
      <Stack.Screen name="Information" component={Information} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SocialLogin" component={SocialLogin} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="ResetPW" component={ResetPW} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="AlertList" component={AlertList} />
      <Stack.Screen name="ViewPortfolio" component={ViewPortfolio} />
      <Stack.Screen name="NewsSummary" component={NewsSummary} />
      <Stack.Screen name="PortfolioDetails" component={PortfolioDetails} />
      <Stack.Screen name="AddStockInManual" component={AddStockInManual} />
      <Stack.Screen name="ManagementPage" component={ManagementPage} />
      <Stack.Screen
        name="RebalanceRecordList"
        component={RebalanceRecordList}
      />
      <Stack.Screen
        name="ViewRebalanceRecord"
        component={ViewRebalanceRecord}
      />
      <Stack.Screen name="ModifyPortfolio" component={ModifyPortfolio} />
      <Stack.Screen name="MakePortfolio" component={MakePortfolio} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        pretendard: require("./assets/fonts/Pretendard.ttf"),
        "pretendard-bold": require("./assets/fonts/Pretendard-Bold.ttf"),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const customTextProps = {
    style: {
      fontFamily: "pretendard",
    },
  };
  LogBox.ignoreAllLogs();

  setCustomText(customTextProps);
  return (
    <AuthProvider>
      <PortfolioProvider>
        <PushNotificationProvider>
          <SafeAreaProvider>
            <NavigationContainer>
              <ScreenStack />
            </NavigationContainer>
          </SafeAreaProvider>
        </PushNotificationProvider>
      </PortfolioProvider>
    </AuthProvider>
  );
}
