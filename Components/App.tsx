import { NavigationContainer } from "@react-navigation/native";
import * as Font from "expo-font";
import { LogBox } from "react-native";
import { setCustomText } from "react-native-global-props";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "./utils/AuthContext";
import { PortfolioProvider } from "./utils/PortfolioContext";
import { PushNotificationProvider } from "./utils/PushNotificationContext";
import { ScreenStack } from "./types/Navigations";

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
