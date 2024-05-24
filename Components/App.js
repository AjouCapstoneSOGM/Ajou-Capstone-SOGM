import React from 'react';
import { Text, View, Button } from 'react-native';
import { PushNotificationProvider, usePushNotifications } from './utils/PushNotificationContext.js';

export default function App() {
  return (
    <PushNotificationProvider>
      <NotificationComponent />
    </PushNotificationProvider>
  );
}

function NotificationComponent() {
  const { expoPushToken, notification} = usePushNotifications();

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
    </View>
  );
}
