import React, { useEffect, useState } from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";

const RebalanceList = ({ route, navigation }) => {
  const portfolioId = route.params.id;
  const [rebalanceList, setRebalanceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const ex_data = {
    rebalancings: [
      {
        id: 0,
        list: [
          {
            ticker: "005930",
            name: "삼성전자",
            number: 2,
            isBuy: false,
          },
          {
            ticker: "003550",
            name: "LG",
            number: 3,
            isBuy: true,
          },
        ],
      },
      {
        id: 1,
        list: [
          {
            ticker: "035420",
            name: "NAVER",
            number: 10,
            isBuy: true,
          },
          {
            ticker: "003550",
            name: "LG",
            number: 3,
            isBuy: false,
          },
        ],
      },
    ],
  };

  const fetchRebalanceList = async () => {
    try {
      const token = await getUsertoken();
      const response = await fetch(
        `${urls.springUrl}/api/rebalancing/${portfolioId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        return data;
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        // const result = await fetchRebalanceList();
        const result = ex_data.rebalancings;
        setRebalanceList(result);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load data", error);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {rebalanceList.map((rebalance, index) => (
        <View key={index}>
          <TouchableOpacity
            style={{ backgroundColor: "blue", height: 50, margin: 20 }}
            onPress={() => {
              navigation.navigate("ModifyPortfolio", {
                list: [...rebalance.list],
              });
            }}
          >
            <Text>{rebalance.id}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    padding: 5,
    backgroundColor: "#f5f5f5",
  },
});
export default RebalanceList;
