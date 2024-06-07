import React, { useCallback, useEffect, useState } from "react";
import { CommonActions, useFocusEffect } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Divider, Icon } from "@rneui/base";
import { usePortfolio } from "../../utils/PortfolioContext";
import { width, height, deepCopy, filteringNumber } from "../../utils/utils";
import PortfolioPieChart from "../../utils/PortfolioPieChart";
import AppText from "../../utils/AppText";
import Loading from "../../utils/Loading";
import ModalComponent from "../../utils/Modal";

const ModifyPortfolio = ({ route, navigation }) => {
  const { pfId, rnId, rebalancing, portfolio } = route.params;
  const { fetchModify, loadData } = usePortfolio();
  const [portfolioAfter, setPortfolioAfter] = useState([]);
  const [rebalances, setRebalances] = useState([]);
  const [selectedId, setSelectedId] = useState();
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [info, setInfo] = useState("");
  const [isAscending, setIsAscending] = useState(true);
  const [checkList, setCheckList] = useState([]);

  const isChecked = (index) => {
    const currentIndex = checkList.indexOf(index);
    if (currentIndex === -1) return false;
    else return true;
  };

  const handleCheckList = (index) => {
    setCheckList((prevIndices) => {
      const currentIndex = prevIndices.indexOf(index);
      if (currentIndex === -1) {
        return [...prevIndices, index];
      } else {
        return prevIndices.filter((i) => i !== index);
      }
    });
  };

  const toggleModal = () => {
    setIsVisible(!isVisible);
  };

  const getTotalPrice = () => {
    const totalPrice = portfolio.detail.stocks.reduce(
      (acc, cur) => acc + cur.currentPrice * cur.quantity,
      0
    );
    return totalPrice + portfolio.detail.currentCash;
  };

  const calculateAfter = () => {
    const afterPortfolio = deepCopy(portfolio);
    checkList.forEach((index) => {
      const order = rebalances[index];
      afterPortfolio.detail.stocks.forEach((stock) => {
        if (stock.ticker == order.ticker) {
          stock.quantity += order.quantity * (order.isBuy ? 1 : -1);
          afterPortfolio.detail.currentCash +=
            order.quantity * order.price * (order.isBuy ? -1 : 1);
        }
      });
    });

    return afterPortfolio;
  };

  const handleSort = (prop) => {
    setIsAscending(!isAscending);

    if (prop === "name") {
      setRebalances(
        [...rebalances].sort((a, b) => {
          return isAscending
            ? b.name.localeCompare(a.name)
            : a.name.localeCompare(b.name);
        })
      );
    } else {
      setRebalances(
        [...rebalances].sort((a, b) => {
          const sortFactor = isAscending ? 1 : -1;
          return (Number(a[prop]) - Number(b[prop])) * sortFactor;
        })
      );
    }
  };

  useFocusEffect(
    useCallback(() => {
      const totalPrice = getTotalPrice(portfolio);
      rebalancing.forEach((item, index) => {
        item.index = index;
        item.buyPrice = item.price;
        item.buyQuantity = item.quantity;
        item.rateDiff = (
          (item.buyPrice * item.buyQuantity * (item.isBuy ? 1 : -1) * 100) /
          totalPrice
        ).toFixed(2);
      });
      setRebalances(rebalancing);
      setLoading(false);
    }, [])
  );

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
        quantity: Number(stock.buyQuantity),
        price: parseFloat(stock.buyPrice),
        ticker: stock.ticker,
      };
    });

    return updated;
  };

  const handleChangePrices = (index, value) => {
    const newRebalances = [...rebalances];
    if (value <= 9999999)
      newRebalances[index].buyPrice = filteringNumber(value);
    setRebalances(newRebalances);
  };

  const handleChangeQuantity = (index, value) => {
    const newRebalances = [...rebalances];
    if (value <= 9999 || value >= 0)
      newRebalances[index].buyQuantity = filteringNumber(value);
    setRebalances(newRebalances);
  };

  const handleModify = async () => {
    const rebalanceData = updateKey([...rebalances]);
    setLoading(true);
    await fetchModify(rebalanceData, pfId, rnId);
    await loadData();
    setLoading(false);
    Alert.alert("반영 완료", "반영이 완료되었습니다.", [
      {
        text: "확인",
        onPress: () => {
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
        },
        style: "cancel",
      },
    ]);
  };

  if (loading) return <Loading />;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <AppText
          style={{ flex: 1, fontSize: 25, fontWeight: "bold", color: "#333" }}
        >
          리밸런싱을 해야하는 종목 {rebalances.length}개가 있어요
        </AppText>
        <Button
          buttonStyle={{ marginHorizontal: width * 10 }}
          type="clear"
          onPress={() => {
            toggleModal();
            setInfo(
              "리밸런싱(Rebalancing)이란?\n\n리밸런싱은 투자 포트폴리오의 자산 비율을 조정하는 과정입니다.\n주식, 채권, 현금 등 다양한 자산이 포함된 포트폴리오에서 각 자산의 비율이 시장 변동에 따라 원래의 목표 비율에서 벗어나게 되면, 이를 다시 조정하여 원래의 비율로 되돌리는 것이 리밸런싱입니다.\n\n\n리밸런싱 방법\n\n1. 현재 포트폴리오의 자산 비율을 확인합니다.\n2. 목표 비율과 비교하여 초과 또는 부족한 자산을 파악합니다.\n3. 초과 자산을 매도하고 부족 자산을 매수하여 목표 비율로 조정합니다."
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
        <View style={styles.chartContent}>
          {/* <View style={styles.chartBox1}>
            <PortfolioPieChart
              data={portfolio.detail}
              selectedId={selectedId}
              size={width * 0.5}
              mode={"light"}
            />
          </View> */}
          <View style={styles.chartBox2}>
            <PortfolioPieChart
              data={calculateAfter().detail}
              selectedId={selectedId}
              size={width * 0.6}
              mode={"light"}
              animate={false}
            />
          </View>
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
                  `표시되는 한 주당 금액은 포트폴리오 계산에 사용한 전날 마감 금액을 나타냅니다.\n\n만일 표시된 금액이 실제로 매수/매도하려는 금액과 다를 경우엔 알맞게 수정해주세요.`
                );
              }}
              icon={{
                name: "questioncircleo",
                type: "antdesign",
                color: "#aaa",
              }}
            />
          </View>
        </View>
        <Divider />
        <View style={styles.column}>
          <Icon
            name="checkcircle"
            type="antdesign"
            color="#333"
            size={15}
            style={{ marginRight: 5 }}
          />
          {/*열 맞추기용*/}
          <Button
            title="기업명"
            type="clear"
            containerStyle={styles.columnName}
            titleStyle={{ color: "#808080", fontSize: 12 }}
            onPress={() => {
              handleSort("name");
            }}
            icon={{
              type: "antdesign",
              name: "caretdown",
              color: "#808080",
              size: 11,
            }}
            iconPosition="right"
          />
          <Button
            title="수량"
            type="clear"
            containerStyle={styles.columnNumber}
            titleStyle={{ color: "#808080", fontSize: 12 }}
            onPress={() => {
              handleSort("quantity");
            }}
            icon={{
              type: "antdesign",
              name: "caretdown",
              color: "#808080",
              size: 11,
            }}
            iconPosition="right"
          />
          <Button
            title="한 주당 금액"
            type="clear"
            containerStyle={styles.columnPrice}
            titleStyle={{ color: "#808080", fontSize: 12 }}
            onPress={() => {
              handleSort("price");
            }}
            icon={{
              type: "antdesign",
              name: "caretdown",
              color: "#808080",
              size: 11,
            }}
            iconPosition="right"
          />
          <Button
            title="비중 변화"
            type="clear"
            containerStyle={styles.columnRateDiff}
            titleStyle={{ color: "#808080", fontSize: 12 }}
            onPress={() => {
              handleSort("rateDiff");
            }}
            icon={{
              type: "antdesign",
              name: "caretdown",
              color: "#808080",
              size: 11,
            }}
            iconPosition="right"
          />
        </View>
      </View>
      <View style={{ flex: 2 }}>
        <ScrollView style={styles.rebalanceList} persistentScrollbar={true}>
          {rebalances.map((item, index) => (
            <View key={index} style={styles.rebalanceItem}>
              <TouchableOpacity
                style={styles.rebalanceItemContent}
                onPress={() => {
                  handleSelectedId(item.ticker);
                  handleCheckList(index);
                }}
              >
                <Icon
                  name="checkcircle"
                  type="antdesign"
                  color={isChecked(index) ? "#97f697" : "#808080"}
                  size={15}
                  style={{ marginRight: 5 }}
                />
                <AppText style={styles.itemName}>{item.name}</AppText>
                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TextInput
                    style={styles.itemNumber}
                    value={item.buyQuantity.toString()}
                    onChangeText={(text) => handleChangeQuantity(index, text)}
                    placeholder={item.quantity.toString()}
                    placeholderTextColor="#777"
                    keyboardType="number-pad"
                  />
                  <AppText
                    style={{
                      color: item.isBuy ? "#ff5858" : "#5878ff",
                      fontSize: 11,
                    }}
                  >
                    {item.isBuy ? " 매수" : " 매도"}
                  </AppText>
                </View>
                <TextInput
                  style={styles.itemPrice}
                  value={item.buyPrice.toString()}
                  onChangeText={(text) => handleChangePrices(index, text)}
                  placeholder={item.price.toString()}
                  placeholderTextColor="#777"
                  keyboardType="number-pad"
                />
                <AppText
                  style={[
                    styles.itemRateDiff,
                    { color: item.isBuy ? "#ff5858" : "#5878ff" },
                  ]}
                >
                  {item.isBuy ? "+" : ""}
                  {item.rateDiff}%
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
      <ModalComponent isVisible={isVisible} onToggle={toggleModal}>
        <AppText style={{ fontSize: 13, marginBottom: 20, color: "#f0f0f0" }}>
          {info}
        </AppText>
      </ModalComponent>
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
    alignItems: "center",
  },
  chartContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 0,
  },
  chartBox1: {
    flex: 1,
    alignItems: "center",
  },
  chartBox2: {
    flex: 1,
    alignItems: "center",
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
    height: height * 50,
  },
  nextButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: height * 5,
    backgroundColor: "#333",
  },
});

export default ModifyPortfolio;
