import { Linking } from "react-native";

const OpenUrl = async (url: string): Promise<void> => {
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    console.error("Provided URL is not valid: ", url);
  }
};
export default OpenUrl;
