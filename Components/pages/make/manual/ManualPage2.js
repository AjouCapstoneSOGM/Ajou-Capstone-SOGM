import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet, ScrollView } from "react-native";
import AppText from "../../../utils/AppText";
import { filteringNumber, height } from "../../../utils/utils";
import GetCurrentPrice from "../../../utils/GetCurrentPrice";
import { Button } from "@rneui/base";
import Loading from "../../../utils/Loading";

const ManualPage2 = ({ step, setStep, stockList, setStockList }) => {
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(true);

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const mergeDataAndSet = (stocks, logs) => {
    const mergedData = stocks.map((stock) => {
      const log = logs.find((log) => log.ticker === stock.ticker);
      return {
        ...stock,
        currentPrice: log ? log.currentPrice : null,
        quantity: 0,
        isBuy: true,
      };
    });
    return mergedData;
  };

  useEffect(() => {
    const result = stockList.filter(
      (stock) => stock.currentPrice === 0 || stock.quantity === 0
    );
    if (result.length) setDisabled(true);
    else setDisabled(false);
  }, [stockList]);

  const handleQuantityChange = (newQuantity, index) => {
    if (Number(newQuantity) < 0) newQuantity = "0";
    if (Number(newQuantity) > 9999) newQuantity = "9999";

    setStockList((prevStockList) =>
      prevStockList.map((item, idx) => {
        if (idx === index) {
          return { ...item, quantity: Number(filteringNumber(newQuantity)) };
        } else {
          return item;
        }
      })
    );
  };
  const handlePriceChange = (newPrice, index) => {
    if (Number(newPrice) < 0) newPrice = "0";
    if (Number(newPrice) > 9999999) newPrice = "9999999";

    setStockList((prevStockList) =>
      prevStockList.map((item, idx) => {
        if (idx === index) {
          return { ...item, currentPrice: Number(filteringNumber(newPrice)) };
        } else {
          return item;
        }
      })
    );
  };
  useEffect(() => {
    const loadData = async () => {
      try {
        const tickerList = stockList.map((item) => item.ticker);
        const promise = tickerList.map((ticker) => {
          return GetCurrentPrice(ticker);
        });
        const tickerWithCurrent = await Promise.all(promise);
        const stocksInfo = mergeDataAndSet(stockList, tickerWithCurrent);
        setStockList(stocksInfo);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    loadData();
  }, []);

  return (
    <View style={styles.container}>
      {loading && <Loading />}
      <View style={styles.textContainer}>
        <AppText style={styles.titleText}>
          종목의 가격과 수량을 설정해주세요
        </AppText>
      </View>
      <View style={styles.contentsContainer}>
        <ScrollView>
          {stockList &&
            stockList.map((item, index) => (
              <View key={index} style={styles.contentsItem}>
                <AppText
                  style={{
                    color: "#f0f0f0",
                    fontWeight: "bold",
                    fontSize: 15,
                    flex: 1,
                  }}
                >
                  {item.name}
                </AppText>
                <View style={styles.quantityContainer}>
                  <Button
                    buttonStyle={{ marginHorizontal: -10 }}
                    type="clear"
                    onPress={() => {
                      handleQuantityChange(
                        String(Number(item.quantity) - 1),
                        index
                      );
                    }}
                    icon={{
                      name: "minuscircleo",
                      type: "antdesign",
                      color: "#f0f0f0",
                      size: 18,
                    }}
                  />
                  <TextInput
                    value={String(item.quantity ? item.quantity : 0)}
                    onChangeText={(value) => handleQuantityChange(value, index)}
                    style={styles.inputQuantity}
                    keyboardType="numeric"
                  />
                  <Button
                    buttonStyle={{ marginHorizontal: -10 }}
                    type="clear"
                    onPress={() => {
                      handleQuantityChange(
                        String(Number(item.quantity) + 1),
                        index
                      );
                    }}
                    icon={{
                      name: "pluscircleo",
                      type: "antdesign",
                      color: "#f0f0f0",
                      size: 18,
                    }}
                  />
                </View>
                <TextInput
                  value={String(item.currentPrice ? item.currentPrice : 0)}
                  onChangeText={(value) => handlePriceChange(value, index)}
                  style={styles.inputPrice}
                  keyboardType="numeric"
                />
              </View>
            ))}
        </ScrollView>
      </View>
      <View style={styles.nextButtonContainer}>
        <AppText style={{ paddingBottom: 10, color: "#999", fontSize: 13 }}>
          입력되어있는 가격은 실시간 기준입니다.
        </AppText>
        <Button
          buttonStyle={styles.nextButton}
          title="다음"
          onPress={handleNextStep}
          disabled={disabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    backgroundColor: "#333",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  contentsItem: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomColor: "#434343",
    borderBottomWidth: 1,
  },
  quantityContainer: {
    flex: 1.1,
    flexDirection: "row",
  },
  inputQuantity: {
    color: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#888",
    marginHorizontal: 10,
    width: 40,
    textAlign: "center",
  },
  inputPrice: {
    flex: 0.5,
    color: "#f0f0f0",
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#888",
    width: 60,
  },
  nextButton: {
    backgroundColor: "#6262e8",
    borderRadius: 10,
    height: height * 50,
  },
  nextButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: height * 5,
    backgroundColor: "#333",
  },
});

export default ManualPage2;
