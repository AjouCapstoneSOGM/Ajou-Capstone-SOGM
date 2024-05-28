import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { getUsertoken } from "../../../utils/localStorageUtils";
import urls from "../../../utils/urls";
import Loading from "../../../utils/Loading";
import AppText from "../../../utils/AppText";
import PortfolioPieChart from "../../../utils/PortfolioPieChart";
import { colorScale } from "../../../utils/utils";
import { Icon } from "@rneui/base";

const ManualPage3 = ({ stockList }) => {
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState();

  const handleSelectedId = (index) => {
    if (selectedId === index) setSelectedId(null);
    else setSelectedId(index);
  };

  useEffect(() => {
    const fetchManualInfo = async () => {
      try {
        const token = await getUsertoken();
        const response = await fetch(
          `${urls.springUrl}/api/portfolio/create/manual`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: "테스트",
              country: "KOR",
              stocks: stockList.map((stock) => ({
                ticker: stock.ticker,
                isBuy: true,
                quantity: stock.quantity,
                price: stock.currentPrice,
              })),
            }),
          }
        );
        if (response.ok) {
          setLoading(false);
        } else {
          console.error("Error occured");
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchManualInfo();
  }, [stockList]);

  if (loading)
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <AppText style={styles.titleText}>
            {"\n"}
            {"\n"}
          </AppText>
        </View>
        <View style={styles.contentsContainer}>
          <Loading />
        </View>
      </View>
    );
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <AppText style={styles.titleText}>생성이 완료되었어요!{"\n"}</AppText>
      </View>
      <View style={styles.contentsContainer}>
        <View style={styles.chartContainer}>
          <PortfolioPieChart
            data={{
              currentCash: 0,
              stocks: stockList.map((stock) => ({
                companyName: stock.name,
                quantity: stock.quantity,
                currentPrice: stock.currentPrice,
              })),
            }}
            selectedId={selectedId}
            size={1}
          />
        </View>
        <ScrollView style={styles.labelContainer}>
          {stockList &&
            stockList.map((stock, index) => (
              <TouchableOpacity
                key={index}
                style={styles.labelItemContent}
                onPress={() => handleSelectedId(index)}
              >
                <Icon
                  name="checkcircle"
                  type="antdesign"
                  color={colorScale[index]}
                  size={15}
                  style={{ marginRight: 5 }}
                />
                <AppText style={styles.itemName}>{stock.name}</AppText>
                <AppText style={styles.itemNumber}>{stock.quantity}주</AppText>
                <AppText style={styles.itemPrice}>
                  {(
                    Number(stock.currentPrice) * Number(stock.quantity)
                  ).toLocaleString()}
                  원
                </AppText>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default ManualPage3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },
  textContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
  },
  contentsContainer: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: "#333",
    paddingHorizontal: 20,
  },
  chartContainer: {
    alignItems: "center",
  },
  labelItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 5,
  },
  itemName: {
    flex: 1.5,
    color: "#f0f0f0",
    marginRight: 10,
    fontWeight: "bold",
    textAlign: "left",
    fontSize: 15,
  },
  itemNumber: {
    flex: 1,
    color: "#f0f0f0",
    textAlign: "center",
    fontSize: 15,
  },
  itemPrice: {
    flex: 1,
    color: "#f0f0f0",
    textAlign: "center",
    fontSize: 15,
  },
});
