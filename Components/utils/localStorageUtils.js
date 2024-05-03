import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUsertoken = async () => {
    return await AsyncStorage.getItem('usertoken');
};

export const setUsertoken = async (value) => {
    try {
        await AsyncStorage.setItem('usertoken', value);
        console.log('token saved successfully');
    } catch (e) {
        console.log('token saved error : Asynce Storage');
    }
};

export const removeUsertoken = async () => {
    return await AsyncStorage.removeItem('usertoken');
};