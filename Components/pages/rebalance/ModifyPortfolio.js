import React, { useCallback, useState } from "react";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Divider, Icon } from "@rneui/base";
import { usePortfolio } from "../../utils/PortfolioContext";
import { deepCopy, filteringNumber } from "../../utils/utils";
import PortfolioPieChart from "../../utils/PortfolioPieChart";
import AppText from "../../utils/AppText";
import Loading from "../../utils/Loading";

const ModifyPortfolio = ({ route, navigation }) => {
  const { pfId, rnId, rebalancing } = route.params;
  const { getPortfolioById, fetchModify, loadData, portfolios } =
    usePortfolio();
  const [checkList, setCheckList] = useState([]);
  const [selectedId, setSelectedId] = useState();
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState([]);
  const [rebalances, setRebalances] = useState([]);

  const calculateAfter = () => {
    if (portfolio) {
      const afterPortfolio = deepCopy(portfolio);
      afterPortfolio.detail.stocks.map((stock) => {
        const order = rebalances.find((order) => order.ticker === stock.ticker);
        if (order) {
          stock.quantity += order.number * (order.isBuy ? 1 : -1);
          afterPortfolio.detail.currentCash +=
            order.number * order.price * (order.isBuy ? -1 : 1);
        }
      });
      return afterPortfolio;
    }
  };
  useFocusEffect(
    useCallback(() => {
      setRebalances(rebalancing);
      setPortfolio(getPortfolioById(pfId));
      setLoading(false);
    }, [])
  );

  const getTotalValue = () => {
    const totalPortfolioValue =
      portfolio.detail.stocks.reduce((acc, stock) => {
        return acc + stock.currentPrice * stock.quantity;
      }, 0) + portfolio.detail.currentCash;
    return totalPortfolioValue;
  };

  const calculateRate = (stocks) => {
    const result = stocks.map((stock) => {
      const marketValue = stock.currentPrice * stock.quantity;
      const rate = marketValue / getTotalValue();
      return {
        companyName: stock.companyName,
        ticker: stock.ticker,
        rate: (rate * 100).toFixed(2), // 퍼센트로 표현
      };
    });
    return result;
  };

  const getRateDiff = (ticker) => {
    const afterPortfolio = calculateAfter();
    const stockRate = calculateRate(portfolio.detail.stocks);
    const afterStockRate = calculateRate(afterPortfolio.detail.stocks);
    const beforeRate = stockRate.filter((stock) => stock.ticker === ticker);
    const afterRate = afterStockRate.filter((stock) => stock.ticker === ticker);
    return afterRate[0].rate - beforeRate[0].rate;
  };

  const checkTickerExists = (ticker) => {
    return checkList.some((item) => item.ticker === ticker);
  };

  const handleCheckList = (ticker) => {
    setCheckList((prevTickers) => {
      const index = prevTickers.findIndex((item) => item.ticker === ticker);
      if (index === -1) {
        return [...prevTickers, { ticker }];
      } else {
        return prevTickers.filter((item, idx) => idx !== index);
      }
    });
  };
  const handleSelectedId = (ticker) => {
    const index = portfolio.detail.stocks.findIndex(
      (item) => item.ticker === ticker
    );
    setSelectedId(index);
  };

  const updateKey = (reblances) => {
    const updated = reblances.map((stock) => {
      return {
        isBuy: stock.isBuy,
        quantity: Number(stock.number),
        price: parseFloat(stock.price),
        ticker: stock.ticker,
      };
    });

    return updated;
  };

  const handleChangePrices = (index, value) => {
    const newRebalances = [...rebalances];
    if (value <= 9999999) newRebalances[index].price = filteringNumber(value);
    setRebalances(newRebalances);
  };

  const handleModify = async () => {
    const rebalanceData = updateKey([...rebalances]);
    setLoading(true);
    await fetchModify(rebalanceData, pfId, rnId);
    await loadData();
    setLoading(false);
    navigation.popToTop();
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: "ViewPortfolio" }, { name: "PortfolioDetail" }],
      })
    );
  };

  if (loading) return <Loading />;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <AppText style={{ fontSize: 30, fontWeight: "bold", color: "#333" }}>
          리밸런싱 할 종목 {rebalances.length}개가 있어요
        </AppText>
        <Button
          buttonStyle={{ marginHorizontal: -10 }}
          type="clear"
          onPress={() => {}}
          icon={{
            name: "questioncircleo",
            type: "antdesign",
            color: "#333",
          }}
        />
      </View>
      <View style={styles.chartContainer}>
        <View style={styles.chartTitle}>
          <AppText style={{ color: "#333", fontSize: 23, fontWeight: "bold" }}>
            수정 전
          </AppText>
          <Icon name="right" type="antdesign" color="#333" />
          <AppText style={{ color: "#333", fontSize: 23, fontWeight: "bold" }}>
            수정 후
          </AppText>
        </View>
        <View style={styles.chartBefore}>
          <PortfolioPieChart
            data={portfolio.detail}
            selectedId={selectedId}
            size={0.5}
          />
        </View>

        <View style={styles.chartAfter}>
          <PortfolioPieChart
            data={calculateAfter().detail}
            selectedId={selectedId}
            size={0.5}
          />
        </View>
      </View>
      <PagerView style={styles.rebalanceContainer} initialPage={0}>
        <View style={styles.rebalanceList}>
          <View style={styles.rebalanceHeader}>
            <AppText style={{ color: "#f0f0f0", fontSize: 20 }}>
              매수할 종목
            </AppText>
            <Button
              buttonStyle={{ marginHorizontal: -10 }}
              type="clear"
              onPress={() => {}}
              icon={{
                name: "questioncircleo",
                type: "antdesign",
                color: "#f0f0f0",
              }}
            />
          </View>
          <Divider />
          <View style={styles.column}>
            <AppText style={styles.columnName}>기업명</AppText>
            <AppText style={styles.columnNumber}>수량</AppText>
            <AppText style={styles.columnPrice}>가격</AppText>
            <AppText style={styles.columnRateDiff}>비중 변화</AppText>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled">
            {rebalances.map(
              (item, index) =>
                item.isBuy === true && (
                  <View key={index} style={styles.rebalanceItem}>
                    <Button
                      buttonStyle={{ marginLeft: -10 }}
                      type="clear"
                      onPress={() => {
                        handleCheckList(item.ticker);
                      }}
                      icon={{
                        name: "checkcircle",
                        type: "antdesign",
                        color: checkTickerExists(item.ticker)
                          ? "#97f697"
                          : "#808080",
                      }}
                    />
                    <TouchableOpacity
                      style={styles.rebalanceItemContent}
                      onPress={() => handleSelectedId(item.ticker)}
                    >
                      <AppText style={styles.itemName}>{item.name}</AppText>
                      <AppText style={styles.itemNumber}>
                        {item.number}주
                      </AppText>
                      <TextInput
                        style={styles.itemPrice}
                        value={item.price.toString()}
                        onChangeText={(text) => handleChangePrices(index, text)}
                        placeholder={item.price.toString()}
                        placeholderTextColor="#bbb"
                      />
                      <AppText style={styles.itemRateDiff}>
                        {getRateDiff(item.ticker)}%
                      </AppText>
                    </TouchableOpacity>
                  </View>
                )
            )}
          </ScrollView>
        </View>
        <View style={styles.rebalanceList}>
          <View style={styles.rebalanceHeader}>
            <AppText style={{ color: "#f0f0f0", fontSize: 20 }}>
              매도할 종목
            </AppText>
            <Button
              buttonStyle={{ marginHorizontal: -10 }}
              type="clear"
              onPress={() => {}}
              icon={{
                name: "questioncircleo",
                type: "antdesign",
                color: "#f0f0f0",
              }}
            />
          </View>
          <Divider />
          <View style={styles.column}>
            <AppText style={styles.columnName}>기업명</AppText>
            <AppText style={styles.columnNumber}>수량</AppText>
            <AppText style={styles.columnPrice}>가격</AppText>
            <AppText style={styles.columnRateDiff}>비중 변화</AppText>
          </View>
          <ScrollView>
            {rebalances.map(
              (item, index) =>
                item.isBuy === false && (
                  <View key={index} style={styles.rebalanceItem}>
                    <Button
                      buttonStyle={{ marginLeft: -10 }}
                      type="clear"
                      onPress={() => {
                        handleCheckList(item.ticker);
                      }}
                      icon={{
                        name: "checkcircle",
                        type: "antdesign",
                        color: checkTickerExists(item.ticker)
                          ? "#97f697"
                          : "#808080",
                      }}
                    />
                    <TouchableOpacity
                      style={styles.rebalanceItemContent}
                      onPress={() => handleSelectedId(item.ticker)}
                    >
                      <AppText style={styles.itemName}>{item.name}</AppText>
                      <AppText style={styles.itemNumber}>
                        {item.number}주
                      </AppText>
                      <AppText style={styles.itemPrice}>{item.price}원</AppText>
                      <AppText style={styles.itemRateDiff}>
                        {getRateDiff(item.ticker)}%
                      </AppText>
                    </TouchableOpacity>
                  </View>
                )
            )}
          </ScrollView>
        </View>
      </PagerView>
      <Button
        containerStyle={styles.nextButtonContainer}
        buttonStyle={styles.nextButton}
        title="반영"
        onPress={() => handleModify()}
        disabled={!(checkList.length === rebalances.length)}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: "#f0f0f0",
  },
  textContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    paddingTop: 70,
  },
  chartContainer: {
    marginTop: 20,
  },
  chartTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 65,
  },
  chartBefore: {
    position: "absolute",
    left: "-25%",
    top: -50,
  },
  chartAfter: {
    position: "absolute",
    right: "-25%",
    top: -50,
  },
  rebalanceContainer: {
    flex: 1,
    backgroundColor: "#333",
    marginTop: 220,
  },
  rebalanceList: {
    padding: 20,
    paddingBottom: 80,
  },
  rebalanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 5,
  },
  column: {
    flexDirection: "row",
    marginLeft: 40,
    marginVertical: 8,
  },
  columnName: {
    flex: 1.6,
    color: "#808080",
    textAlign: "center",
  },
  columnNumber: {
    flex: 1,
    color: "#808080",
    textAlign: "center",
  },
  columnPrice: {
    flex: 1.5,
    color: "#808080",
    textAlign: "center",
  },
  columnRateDiff: {
    flex: 1.5,
    color: "#808080",
    textAlign: "center",
  },
  rebalanceItem: {
    flexDirection: "row",
    marginVertical: 5,
  },
  rebalanceItemContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  itemName: {
    flex: 1.5,
    color: "#f0f0f0",
    marginRight: 10,
    fontWeight: "bold",
  },
  itemNumber: {
    flex: 1,
    color: "#f0f0f0",
  },
  itemPrice: {
    flex: 1.5,
    color: "#f0f0f0",
  },
  itemRateDiff: {
    flex: 1,
    color: "#f0f0f0",
  },
  nextButton: {
    backgroundColor: "#6262e8",
    borderRadius: 10,
    height: 60,
  },
  nextButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
});

export default ModifyPortfolio;
