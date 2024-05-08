import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "./pages/login/login";
import SocialLogin from "./pages/login/sociallogin";
import Signup from "./pages/login/signup";

import Home from "./pages/Home";
import ViewPortfolio from "./pages/ViewPortfolio";
import PortfolioDetails from "./pages/PortfolioDetails";
import MakePortfolio from "./pages/MakePortfolio";
import NewsSummary from "./pages/NewsSummary";

import { AuthProvider } from "./utils/AuthContext";

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
        <Stack.Screen name="MakePortfolio" component={MakePortfolio} />
      </Stack.Navigator>
    </AuthProvider>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <ScreenStack />
    </NavigationContainer>
  );
}
