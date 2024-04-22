import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./Home";
import ViewPortfolio from "./ViewPortfolio";
import PortfolioDetails from "./PortfolioDetails";

const Stack = createStackNavigator();

function ScreenStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="ViewPortfolio" component={ViewPortfolio} />
      <Stack.Screen name="PortfolioDetails" component={PortfolioDetails} />
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
