import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { getUsertoken } from "../../../utils/localStorageUtils";
import urls from "../../../utils/urls";
import Loading from "../../../utils/Loading";
import AppText from "../../../utils/AppText";
import PortfolioPieChart from "../../../utils/PortfolioPieChart";
import { colorScale, width, height } from "../../../utils/utils";
import { Icon } from "@rneui/base";
import { Button } from "react-native-elements";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { usePortfolio } from "../../../utils/PortfolioContext";

const ManualPage3 = ({ stockList }) => {
  const navigation = useNavigation();
  const { loadData } = usePortfolio();
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [pfId, setPfId] = useState("");

  const handleSelectedId = (index) => {
    if (selectedId === index) setSelectedId(null);
    else setSelectedId(index);
  };

  const getTotalPrice = () => {
    const totalPrice = stockList.stocks?.reduce(
      (acc, cur) => acc + cur.currentPrice * cur.quantity,
      0
    );
    return isNaN(totalPrice) ? 0 : totalPrice;
  };

  const gotoDetailPage = async () => {
    await loadData();
    navigation.dispatch(
      CommonActions.reset({
        index: 2,
        routes: [
          { name: "Home" },
          { name: "ViewPortfolio" },
          { name: "PortfolioDetails", params: { id: pfId } },
        ],
      })
    );
  };

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
            country: "KOR",
            cash: stockList.cash,
            stocks: stockList.stocks?.map((stock) => ({
              ticker: stock.ticker,
              isBuy: true,
              quantity: stock.quantity,
              price: stock.currentPrice,
            })),
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setPfId(data.id);
        setLoading(false);
      } else {
        console.error("Error occured");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchManualInfo();
    stockList.stocks?.sort(
      (a, b) => b.currentPrice * b.quantity - a.currentPrice * a.quantity
    );
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
              currentCash: stockList.cash,
              stocks: stockList.stocks?.map((stock) => ({
                companyName: stock.name,
                quantity: stock.quantity,
                currentPrice: stock.currentPrice,
              })),
            }}
            selectedId={selectedId}
            size={0.6 * width}
            mode={"dark"}
            type={"stock"}
          />
        </View>
        <View style={styles.column}>
          <Icon
            name="checkcircle"
            type="antdesign"
            color="#333"
            size={15}
            style={{ marginRight: 5 }}
          />
          <Button
            title="기업명"
            type="clear"
            containerStyle={styles.columnName}
            titleStyle={{ color: "#808080", fontSize: 12 }}
            onPress={() => {}}
          />
          <Button
            title="수량"
            type="clear"
            containerStyle={styles.columnNumber}
            titleStyle={{ color: "#808080", fontSize: 12 }}
            onPress={() => {}}
          />
          <Button
            title="금액"
            type="clear"
            containerStyle={styles.columnPrice}
            titleStyle={{ color: "#808080", fontSize: 12 }}
            onPress={() => {
              handleSort("price");
            }}
          />
        </View>
        <ScrollView style={styles.labelContainer}>
          {stockList &&
            stockList.stocks?.map((stock, index) => (
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
          <TouchableOpacity
            style={styles.labelItemContent}
            onPress={() => handleSelectedId(stockList.stocks?.length)}
          >
            <Icon
              name="checkcircle"
              type="antdesign"
              color="#ccc"
              size={15}
              style={{ marginRight: 5 }}
            />
            <AppText style={styles.itemName}>현금</AppText>
            <AppText style={styles.itemNumber}></AppText>
            <AppText style={styles.itemPrice}>
              {Number(stockList.cash).toLocaleString()}원
            </AppText>
          </TouchableOpacity>
        </ScrollView>
        <View style={styles.totalPriceContainer}>
          <AppText style={{ color: "#ccc" }}>총 가격</AppText>
          <AppText style={{ color: "#ccc" }}>
            <AppText style={{ color: "#f0f0f0", fontSize: 20 }}>
              {(getTotalPrice() + stockList.cash).toLocaleString()}
            </AppText>{" "}
            원
          </AppText>
        </View>
      </View>
      <View style={styles.nextButtonContainer}>
        <Button
          buttonStyle={styles.nextButton}
          title="상세 정보로 이동"
          onPress={gotoDetailPage}
        />
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
    marginVertical: 20 * height,
  },
  labelItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 5,
  },
  column: {
    flexDirection: "row",
    marginBottom: height * 5,
    alignItems: "center",
  },
  columnName: {
    flex: 1.5,
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
  itemName: {
    flex: 1.5,
    color: "#f0f0f0",
    marginRight: 10,
    fontWeight: "bold",
    textAlign: "center",
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
});
