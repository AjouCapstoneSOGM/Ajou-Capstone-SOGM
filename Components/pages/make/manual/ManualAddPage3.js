import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { getUsertoken } from "../../../utils/localStorageUtils";
import urls from "../../../utils/urls";
import Loading from "../../../utils/Loading";
import AppText from "../../../utils/AppText";

const ManualPage3 = ({ stockList, pfId }) => {
  const [loading, setLoading] = useState(true);

  const fetchCashIn = async () => {
    try {
      const token = await getUsertoken();
      const response = await fetch(
        `${urls.springUrl}/api/portfolio/${pfId}/deposit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cash: stockList.cash,
          }),
        }
      );
      if (response.ok) {
        console.log("success");
        return "success";
      } else {
        throw new Error("cash in error");
      }
    } catch (error) {
      console.error("Error:", error);
      return "fail";
    }
  };

  const fetchAddManual = async (stock) => {
    try {
      const token = await getUsertoken();
      const response = await fetch(
        `${urls.springUrl}/api/portfolio/${pfId}/buy`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ticker: stock.ticker,
            isBuy: true,
            quantity: stock.quantity,
            price: stock.currentPrice,
          }),
        }
      );
      if (response.ok) {
      } else {
        console.error("Error occured");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFetchAddManual = async () => {
    const promises = stockList.stocks?.map((stock) => {
      return fetchAddManual(stock);
    });
    await Promise.all(promises);
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchCashIn();
      await handleFetchAddManual();
      setLoading(false);
    };
    fetchData();
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
        <AppText style={styles.titleText}>
          종목 추가가 완료되었어요!{"\n"}
        </AppText>
        <View style={styles.contentsContainer}></View>
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
