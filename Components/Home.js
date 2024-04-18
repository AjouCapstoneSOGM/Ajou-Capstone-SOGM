import React from "react";
import { View, Text, Button } from "react-native";

function Home({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Page</Text>
      <Button
        title="Go to Details"
        v
        onPress={() => navigation.navigate("ViewPortfolio")}
      />
    </View>
  );
}

export default Home;
