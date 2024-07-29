import { AppRegistry } from "react-native";
import App from "./App";
import appConfig from "./app.json";

const appName: string = appConfig.expo.name;
AppRegistry.registerComponent(appName, () => App);
