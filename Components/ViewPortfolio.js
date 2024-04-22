import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const PortfolioList = ({ navigation }) => {
  const portfolios = [
    {
      id: 1,
      name: "포트폴리오1",
      created_at: "2024-04-14",
      is_auto: true,
      init_asset: 10000000,
      current_asset: 10250000,
      init_cash: 10000000,
      current_cash: 300000,
      rate_return: 2.5,
    },
    {
      id: 2,
      name: "포트폴리오2",
      created_at: "2024-04-20",
      is_auto: true,
      init_asset: 10000000,
      current_asset: 10250000,
      init_cash: 10000000,
      current_cash: 300000,
      rate_return: 4.0,
    },
  ];

  return (
    <View style={styles.container}>
      {portfolios.map((portfolio) => (
        <TouchableOpacity
          key={portfolio.id}
          style={styles.button}
          onPress={() => navigation.navigate("PortfolioDetails", { portfolio })}
        >
          <Text style={styles.name}>{portfolio.name}</Text>
          <Text>{portfolio.created_at}</Text>
          <Text>수익률: {portfolio.rate_return}%</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  button: {
    backgroundColor: "#ddd",
    padding: 20,
    marginVertical: 10,
    width: "90%",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default PortfolioList;
