import React, { useCallback, useState } from "react";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Divider, Icon } from "@rneui/base";
import { usePortfolio } from "../../utils/PortfolioContext";
import { width, height, deepCopy, filteringNumber } from "../../utils/utils";
import PortfolioPieChart from "../../utils/PortfolioPieChart";
import AppText from "../../utils/AppText";
import Loading from "../../utils/Loading";
import InfoModal from "../../utils/InfoModal";

const ModifyPortfolio = ({ route, navigation }) => {
  const { pfId, rnId, rebalancing } = route.params;
  const { getPortfolioById, fetchModify, loadData } = usePortfolio();
  const [selectedId, setSelectedId] = useState();
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState([]);
  const [rebalances, setRebalances] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [info, setInfo] = useState("");

  const toggleModal = () => {
    setIsVisible(!isVisible);
  };

  const isPortfolioInit = () => {
    if (portfolio) {
      if (portfolio.detail.currentCash === portfolio.detail.initialAsset)
        return true;
      else return false;
    }
  };

  const calculateAfter = () => {
    if (portfolio) {
      const afterPortfolio = deepCopy(portfolio);
      afterPortfolio.detail.stocks.map((stock) => {
        const order = rebalances.find((order) => order.ticker === stock.ticker);
        if (order) {
          stock.quantity += order.quantity * (order.isBuy ? 1 : -1);
          afterPortfolio.detail.currentCash +=
            order.quantity * order.price * (order.isBuy ? -1 : 1);
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
        rate: (rate * 100).toFixed(3), // 퍼센트로 표현
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

    return (afterRate[0].rate - beforeRate[0].rate).toFixed(2);
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
        quantity: Number(stock.quantity),
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
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: "ViewPortfolio" },
          { name: "PortfolioDetails", params: { id: pfId } },
        ],
      })
    );
  };

  if (loading) return <Loading />;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <AppText
          style={{ flex: 1, fontSize: 25, fontWeight: "bold", color: "#333" }}
        >
          {isPortfolioInit() ? "최초 매수를" : "리밸런싱을"} 해야하는 종목{" "}
          {rebalances.length}개가 있어요
        </AppText>
        <Button
          buttonStyle={{ marginHorizontal: width * 10 }}
          type="clear"
          onPress={() => {
            toggleModal();
            setInfo(
              isPortfolioInit()
                ? "포트폴리오 생성 직후에는 종목을 직접 반영해야 해요.\n\n하단의 종목 리스트를 확인하여 직접 주식을 매수해주세요."
                : "리밸런싱(Rebalancing)이란?\n\n리밸런싱은 투자 포트폴리오의 자산 비율을 조정하는 과정입니다.\n주식, 채권, 현금 등 다양한 자산이 포함된 포트폴리오에서 각 자산의 비율이 시장 변동에 따라 원래의 목표 비율에서 벗어나게 되면, 이를 다시 조정하여 원래의 비율로 되돌리는 것이 리밸런싱입니다.\n\n\n리밸런싱 방법\n\n1. 현재 포트폴리오의 자산 비율을 확인합니다.\n2. 목표 비율과 비교하여 초과 또는 부족한 자산을 파악합니다.\n3. 초과 자산을 매도하고 부족 자산을 매수하여 목표 비율로 조정합니다."
            );
          }}
          icon={{
            name: "questioncircleo",
            type: "antdesign",
            color: "#333",
          }}
        />
      </View>
      <View style={styles.chartContainer}>
        <View style={styles.chartTitle}>
          <AppText style={{ color: "#333", fontSize: 20, fontWeight: "bold" }}>
            {isPortfolioInit() ? "자산배분" : "리밸런싱"}전
          </AppText>
          <Icon name="right" type="antdesign" color="#333" />
          <AppText style={{ color: "#333", fontSize: 20, fontWeight: "bold" }}>
            {isPortfolioInit() ? "자산배분" : "리밸런싱"}후
          </AppText>
        </View>
        <View style={styles.chartContent}>
          <PortfolioPieChart
            data={portfolio.detail}
            selectedId={selectedId}
            size={width * 0.5}
          />
          <PortfolioPieChart
            data={calculateAfter().detail}
            selectedId={selectedId}
            size={width * 0.5}
          />
        </View>
      </View>
      <View style={styles.headerContainer}>
        <View style={styles.rebalanceHeader}>
          <AppText style={{ color: "#f0f0f0", fontSize: 20 }}>
            대상 종목
          </AppText>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AppText style={{ color: "#777", fontSize: 13 }}>
              가격이 달라요!{" "}
            </AppText>
            <Button
              buttonStyle={{ marginHorizontal: -10 }}
              type="clear"
              onPress={() => {
                toggleModal();
                setInfo(
                  `표시되는 한 주당 금액은 포트폴리오 비중 계산에 사용한 전날 종가 금액을 나타냅니다.\n\n만일 표시된 금액이 실제로 매수/매도하려는 금액과 다를 경우엔 알맞게 수정해주세요.`
                );
              }}
              icon={{
                name: "questioncircleo",
                type: "antdesign",
                color: "#f0f0f0",
              }}
            />
          </View>
        </View>
        <Divider />
        <View style={styles.column}>
          <AppText style={styles.columnName}>기업명</AppText>
          <AppText style={styles.columnNumber}>수량</AppText>
          <AppText style={styles.columnPrice}>한 주당 금액</AppText>
          <AppText style={styles.columnRateDiff}>비중 변화</AppText>
        </View>
      </View>
      <View style={{ flex: 2 }}>
        <ScrollView style={styles.rebalanceList} persistentScrollbar={true}>
          {rebalances.map((item, index) => (
            <View key={index} style={styles.rebalanceItem}>
              <TouchableOpacity
                style={styles.rebalanceItemContent}
                onPress={() => handleSelectedId(item.ticker)}
              >
                <AppText style={styles.itemName}>{item.name}</AppText>
                <AppText style={styles.itemNumber}>
                  {item.quantity * (item.isBuy ? 1 : -1)}주
                </AppText>
                <TextInput
                  style={styles.itemPrice}
                  value={item.price.toString()}
                  onChangeText={(text) => handleChangePrices(index, text)}
                  placeholder={item.price.toString()}
                  placeholderTextColor="#bbb"
                  keyboardType="number-pad"
                />
                <AppText
                  style={[
                    styles.itemRateDiff,
                    { color: item.isBuy ? "#ff5858" : "#5878ff" },
                  ]}
                >
                  {item.isBuy ? "+" : ""}
                  {getRateDiff(item.ticker)}%
                </AppText>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.nextButtonContainer}>
        <Button
          buttonStyle={styles.nextButton}
          title="반영"
          onPress={() => handleModify()}
        />
      </View>
      <InfoModal isVisible={isVisible} onToggle={toggleModal}>
        {info}
      </InfoModal>
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
    paddingTop: height * 30,
    marginBottom: height * -15,
  },
  chartContainer: {
    flex: 1,
    marginVertical: height * 20,
    marginBottom: height * 35,
  },
  chartTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: width * 45,
    alignItems: "center",
  },
  chartContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 0,
  },
  rebalanceList: {
    backgroundColor: "#333",
    paddingHorizontal: width * 15,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: height * 10,
    backgroundColor: "#333",
  },
  rebalanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 5,
  },
  column: {
    flexDirection: "row",
    marginVertical: 8,
  },
  columnName: {
    flex: 1.3,
    color: "#808080",
    textAlign: "center",
  },
  columnNumber: {
    flex: 1,
    color: "#808080",
    textAlign: "center",
  },
  columnPrice: {
    flex: 1.2,
    color: "#808080",
    textAlign: "center",
  },
  columnRateDiff: {
    flex: 1,
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
    flex: 1.3,
    fontSize: 13,
    color: "#f0f0f0",
    fontWeight: "bold",
    textAlign: "center",
  },
  itemNumber: {
    flex: 1,
    fontSize: 14,
    color: "#f0f0f0",
    textAlign: "center",
  },
  itemPrice: {
    flex: 1.2,
    fontSize: 15,
    color: "#f0f0f0",
    textAlign: "center",
  },
  itemRateDiff: {
    flex: 1,
    color: "#f0f0f0",
    textAlign: "center",
  },
  nextButton: {
    backgroundColor: "#6262e8",
    borderRadius: 10,
    height: 50,
  },
  nextButtonContainer: {
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#333",
  },
});

export default ModifyPortfolio;
