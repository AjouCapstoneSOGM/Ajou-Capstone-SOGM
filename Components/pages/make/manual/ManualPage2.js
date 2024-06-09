import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet, ScrollView } from "react-native";
import AppText from "../../../utils/AppText";
import { filteringNumber, height } from "../../../utils/utils";
import GetCurrentPrice from "../../../utils/GetCurrentPrice";
import { Button, Icon } from "@rneui/base";
import Loading from "../../../utils/Loading";
import ModalComponent from "../../../utils/Modal";

const ManualPage2 = ({ step, setStep, stockList, setStockList }) => {
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modifyIndex, setModifyIndex] = useState("");

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const toggleModifyModal = () => {
    setModalVisible(!modalVisible);
  };

  const getTotalPrice = () => {
    const totalPrice = stockList.reduce(
      (acc, cur) => acc + cur.currentPrice * cur.quantity,
      0
    );
    return isNaN(totalPrice) ? 0 : totalPrice;
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
        <View style={styles.column}>
          <AppText style={styles.columnName}>기업명</AppText>
          <AppText style={styles.columnNumber}>수량</AppText>
          <AppText style={styles.columnPrice}>한 주당 금액</AppText>
        </View>
        <ScrollView>
          {stockList &&
            stockList.map((item, index) => (
              <View key={index} style={styles.contentsItem}>
                <View style={{ flex: 1 }}>
                  <AppText
                    style={{
                      color: "#f0f0f0",
                      fontWeight: "bold",
                      fontSize: 15,
                      textAlign: "center",
                    }}
                  >
                    {item.name}
                  </AppText>
                </View>
                <View style={styles.quantityContainer}>
                  <Button
                    containerStyle={{ marginHorizontal: -10 }}
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
                      color: "#999",
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
                    containerStyle={{ marginHorizontal: -10 }}
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
                      color: "#999",
                      size: 18,
                    }}
                  />
                </View>
                <View style={styles.priceContainer}>
                  <AppText style={{ color: "#f0f0f0" }}>
                    {Number(
                      item.currentPrice ? item.currentPrice : 0
                    ).toLocaleString()}
                    원
                  </AppText>
                  <Button
                    containerStyle={{ marginHorizontal: -5 }}
                    type="clear"
                    onPress={() => {
                      setModifyIndex(index);
                      setModalVisible(true);
                    }}
                    icon={{
                      name: "pencil",
                      type: "ionicon",
                      color: "#999",
                      size: 13,
                    }}
                  />
                </View>
              </View>
            ))}
        </ScrollView>
        <View style={styles.totalPriceContainer}>
          <AppText style={{ color: "#ccc" }}>총 가격</AppText>
          <AppText style={{ color: "#ccc" }}>
            <AppText style={{ color: "#f0f0f0", fontSize: 20 }}>
              {getTotalPrice().toLocaleString()}
            </AppText>{" "}
            원
          </AppText>
        </View>
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
      <ModalComponent isVisible={modalVisible} onToggle={toggleModifyModal}>
        <AppText
          style={{
            position: "absolute",
            top: 0,
            color: "#888",
            fontSize: 20,
            fontWeight: "bold",
          }}
        >
          가격 수정
        </AppText>
        <View style={styles.content}>
          <AppText
            style={{ fontSize: 20, color: "#f0f0f0", marginVertical: 20 }}
          >
            {stockList[modifyIndex]?.name}
          </AppText>
          <TextInput
            value={String(
              stockList[modifyIndex]?.currentPrice
                ? stockList[modifyIndex]?.currentPrice
                : 0
            )}
            onChangeText={(value) => handlePriceChange(value, modifyIndex)}
            style={styles.inputPrice}
            keyboardType="numeric"
          />
          <Button
            buttonStyle={styles.submitButton}
            title="확인"
            onPress={async () => {
              toggleModifyModal();
            }}
          />
        </View>
      </ModalComponent>
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
    alignItems: "center",
    paddingVertical: 15,
    borderBottomColor: "#434343",
    borderBottomWidth: 1,
  },
  column: {
    flexDirection: "row",
    marginBottom: height * 5,
    alignItems: "center",
  },
  columnName: {
    flex: 1,
    color: "#808080",
    textAlign: "center",
  },
  columnNumber: {
    flex: 1,
    color: "#808080",
    textAlign: "center",
  },
  columnPrice: {
    flex: 1,
    color: "#808080",
    textAlign: "center",
  },
  quantityContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  inputQuantity: {
    color: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#888",
    marginHorizontal: 10,
    width: 40,
    textAlign: "center",
  },
  priceContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  inputPrice: {
    color: "#f0f0f0",
    borderBottomColor: "#434343",
    borderBottomWidth: 1,
  },
  totalPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottomColor: "#434343",
    borderBottomWidth: 1,
    paddingVertical: 10,
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
  submitButton: {
    backgroundColor: "#6262e8",
    borderRadius: 10,
    height: 40,
    marginVertical: 10,
  },
});

export default ManualPage2;
