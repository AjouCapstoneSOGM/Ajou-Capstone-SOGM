import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "./pages/login/login";
import SocialLogin from "./pages/login/sociallogin";
import Signup from "./pages/login/signup";

import Home from "./pages/Home";
import NewsSummary from "./pages/NewsSummary";

import ViewPortfolio from "./pages/portfolio/ViewPortfolio";
import PortfolioDetails from "./pages/portfolio/PortfolioDetails";
import ManagementPage from "./pages/portfolio/ManagePortfolio";

import MakePortfolio from "./pages/make/MakePortfolio";

import ModifyPortfolio from "./pages/rebalance/ModifyPortfolio";
import RebalanceList from "./pages/rebalance/RebalanceList";

import { AuthProvider } from "./utils/AuthContext";
import { PortfolioProvider } from "./utils/PortfolioContext";

import { setCustomText } from "react-native-global-props";
import {
  useFonts,
  NotoSansKR_400Regular,
} from "@expo-google-fonts/noto-sans-kr";

const Stack = createStackNavigator();
function ScreenStack() {
  return (
    <AuthProvider>
      <PortfolioProvider>
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
          <Stack.Screen name="RebalanceList" component={RebalanceList} />
          <Stack.Screen name="ModifyPortfolio" component={ModifyPortfolio} />
          <Stack.Screen name="MakePortfolio" component={MakePortfolio} />
        </Stack.Navigator>
      </PortfolioProvider>
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
