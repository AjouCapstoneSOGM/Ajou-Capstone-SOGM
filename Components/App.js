import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "./pages/login/login";
import SocialLogin from "./pages/login/sociallogin";
import Signup from "./pages/login/signup";

import Home from "./pages/Home";
import ViewPortfolio from "./pages/ViewPortfolio";
import PortfolioDetails from "./pages/PortfolioDetails";
import MakePortfolio from "./pages/MakePortfolio";

const Stack = createStackNavigator();
function ScreenStack() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SocialLogin" component={SocialLogin} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="ViewPortfolio" component={ViewPortfolio} />
      <Stack.Screen name="PortfolioDetails" component={PortfolioDetails} />
      <Stack.Screen name="MakePortfolio" component={MakePortfolio} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <ScreenStack />
    </NavigationContainer>
  );
}
