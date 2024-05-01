import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import urls from "../utils/urls";

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

  const fetchPortfolio = async () => {
    try {
      const response = await fetch(`${urls.springUrl}/api/portfolio`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      console.log("Suceess:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  });

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {portfolios.map((portfolio) => (
          <TouchableOpacity
            key={portfolio.id}
            style={styles.contentsButton}
            onPress={() =>
              navigation.navigate("PortfolioDetails", { portfolio })
            }
          >
            <Text>{portfolio.name}</Text>
            <Text>{portfolio.created_at}</Text>
            <Text>수익률: {portfolio.rate_return}%</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 5,
  },
  buttonContainer: {
    alignItems: "center",
  },
  contentsButton: {
    justifyContent: "center", // 가로 방향에서 중앙 정렬
    backgroundColor: "#ddd",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: "90%",
  },
});
export default PortfolioList;
