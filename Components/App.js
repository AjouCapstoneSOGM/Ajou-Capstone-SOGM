import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";

import Login from "./pages/login/login";
import SocialLogin from "./pages/login/sociallogin";
import Signup from "./pages/login/signup";

import Home from "./pages/Home";
import ViewPortfolio from "./pages/ViewPortfolio";
import PortfolioDetails from "./pages/PortfolioDetails";
import MakePortfolio from "./pages/MakePortfolio";
import NewsSummary from "./pages/NewsSummary";

import { AuthProvider } from "./utils/AuthContext";
import { setCustomText } from "react-native-global-props";
import {
  useFonts,
  NotoSansKR_400Regular,
} from "@expo-google-fonts/noto-sans-kr";
import ManagementPage from "./pages/ManagePortfolio";
import ModifyPortfolio from "./pages/ModifyPortfolio";

const Stack = createStackNavigator();

function ScreenStack() {
  return (
    <AuthProvider>
      <Stack.Navigator
        screenOptions={{
          // headerShown: false, // 모든 스크린에서 헤더 숨기기
          headerStyle: {
            backgroundColor: "#6495ED", // 헤더의 배경색 설정
          },
          headerTintColor: "#fff", // 헤더의 텍스트 색상 설정
        }}
        initialRouteName="Home"
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SocialLogin" component={SocialLogin} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ViewPortfolio" component={ViewPortfolio} />
        <Stack.Screen name="NewsSummary" component={NewsSummary} />
        <Stack.Screen name="PortfolioDetails" component={PortfolioDetails} />
        <Stack.Screen name="ManagementPage" component={ManagementPage} />
        <Stack.Screen name="ModifyPortfolio" component={ModifyPortfolio} />
        <Stack.Screen name="MakePortfolio" component={MakePortfolio} />
        <Stack.Screen name="btmTabnv1" component={btmTabnv1} />
        <Stack.Screen name="btmTabnv2" component={btmTabnv2} />
      </Stack.Navigator>
    </AuthProvider>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    NotoSansKR_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  const customTextProps = {
    style: {
      fontFamily: "NotoSansKR_400Regular",
      lineHeight: 20, // 줄 간격을 20으로 설정
    },
  };

  setCustomText(customTextProps);
  return (
    <NavigationContainer>
      <ScreenStack />
    </NavigationContainer>
  );
}
