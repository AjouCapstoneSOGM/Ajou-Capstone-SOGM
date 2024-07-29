import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUsertoken = async (): Promise<string> => {
  const userToken = await AsyncStorage.getItem("usertoken");
  return userToken ?? "";
};

export const setUsertoken = async (value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem("usertoken", value);
    console.log("token saved successfully");
  } catch (e) {
    console.log("token saved error : Asynce Storage");
  }
};

export const setUserName = async (name: string): Promise<void> => {
  try {
    await AsyncStorage.setItem("username", name);
    console.log("name saved successfully");
  } catch (e) {
    console.log("Name saved error : Asynce Storage");
  }
};

export const getUserName = async (): Promise<string> => {
  const userName = await AsyncStorage.getItem("username");
  return userName ?? "";
};

export const removeUsertoken = async (): Promise<void> => {
  return await AsyncStorage.removeItem("usertoken");
};

export const removeUserName = async (): Promise<void> => {
  return await AsyncStorage.removeItem("username");
};

export const setRebalanceAlarm = async (
  isRebalanceAlarm: string
): Promise<void> => {
  try {
    await AsyncStorage.setItem("isRebalanceAlarm", isRebalanceAlarm);
    console.log("isRebalanceAlarm saved successfully");
  } catch (e) {
    console.log("isRebalanceAlarm saved error : Asynce Storage");
  }
};

export const getRebalanceAlarm = async (): Promise<string> => {
  const rebalanceAlarm = await AsyncStorage.getItem("isRebalanceAlarm");
  return rebalanceAlarm ?? "";
};
