import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { usePortfolio } from "../../utils/PortfolioContext";
import { getUsertoken } from "../../utils/localStorageUtils";

import urls from "../../utils/urls";
import AppText from "../../utils/AppText";
import { SafeAreaView } from "react-native-safe-area-context";
import PortfolioPieChart from "../../utils/PortfolioPieChart";
import { Button, Divider, Icon } from "@rneui/base";
import { width, height, filteringNumber, colorScale } from "../../utils/utils";
import StockInfo from "./StockInfo";
import Loading from "../../utils/Loading";
import ModalComponent from "../../utils/Modal";

const PortfolioDetails = ({ route, navigation }) => {
  const stocksLength = 10;
  const { getPortfolioById, portfolios, loadData } = usePortfolio();
  const [portfolio, setPortfolio] = useState({
    id: null,
    name: "",
    stocks: [],
    currentCash: 0,
    totalPrice: 0,
    initialAsset: 0,
    riskValue: 0,
    auto: true,
  });
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [alertExist, setAlertExist] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [stockInfoVisible, setStockInfoVisible] = useState(false);
  const [modifyQuantity, setModifyQuantity] = useState(0);
  const [modifyPrice, setModifyPrice] = useState(0);
  const [modifyBuy, setModifyBuy] = useState(true);

  const toggleInfoModal = () => {
    setInfoVisible(!infoVisible);
  };

  const toggleStockModal = () => {
    setStockInfoVisible(!stockInfoVisible);
  };

  const fetchModifyStockManual = async () => {
    try {
      const token = await getUsertoken();
      const response = await fetch(
        `${urls.springUrl}/api/portfolio/${portfolio.id}/${
          modifyBuy ? "buy" : "sell"
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ticker: portfolio.stocks[selectedId].ticker,
            isBuy: modifyBuy,
            quantity: modifyQuantity,
            price: modifyPrice,
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
  const resetModifyData = () => {
    setModifyBuy(true);
    setModifyPrice(0);
    setModifyQuantity(0);
  };

  const handleQuantityChange = (newQuantity) => {
    const currentQuantity = portfolio.stocks[selectedId].quantity;
    if (!modifyBuy && Number(newQuantity) > Number(currentQuantity))
      newQuantity = String(currentQuantity);
    if (Number(newQuantity) < 0) newQuantity = "0";
    if (Number(newQuantity) > 9999) newQuantity = "9999";
    setModifyQuantity(filteringNumber(newQuantity));
  };

  const handlePriceChange = (newPrice) => {
    if (Number(newPrice) < 0) newPrice = "0";
    if (Number(newPrice) > 9999999) newPrice = "9999999";
    setModifyPrice(Number(filteringNumber(newPrice)));
  };

  const handleBuyChange = (isBuy) => {
    setModifyBuy(!isBuy);
    if (
      isBuy &&
      Number(modifyQuantity) > Number(portfolio.stocks[selectedId].quantity)
    )
      setModifyQuantity(portfolio.stocks[selectedId].quantity);
  };

  const getAlertExists = async (id) => {
    try {
      const token = await getUsertoken();
      const response = await fetch(
        `${urls.springUrl}/api/rebalancing/${id}/exists`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAlertExist(data.exist);
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  const handleSelectedId = (index) => {
    if (selectedId === index) setSelectedId(null);
    else setSelectedId(index);
  };

  const getStockROI = (id) => {
    const current = portfolio.stocks[id].currentPrice;
    const average = portfolio.stocks[id].averageCost;

    if (current === 0 || average === 0) return 0;
    const totalROI = (((current - average) / average) * 100).toFixed(2);

    return totalROI;
  };
  const getStockRate = (id) => {
    const stockRate =
      (portfolio.stocks[id].quantity * portfolio.stocks[id].currentPrice) /
      getTotalPrice();

    return stockRate;
  };

  const getTotalPrice = () => {
    const totalPrice = portfolio.stocks.reduce(
      (acc, cur) => acc + cur.currentPrice * cur.quantity,
      0
    );
    return totalPrice + portfolio.currentCash;
  };

  const getPortfolioROI = () => {
    const benefit = getTotalPrice() - portfolio.initialAsset;
    const roi = ((benefit / portfolio.initialAsset) * 100).toFixed(2);
    const roiFormatted = roi > 0 ? `+${roi}` : `${roi}`;
    const color = roi > 0 ? "#ff5858" : roi < 0 ? "#5878ff" : "#666";
    return (
      <View style={{ flexDirection: "row" }}>
        <AppText style={{ color: "#f0f0f0" }}>
          {benefit.toLocaleString()} 원{" "}
        </AppText>
        <AppText style={{ fontSize: 14, color: color }}>
          {roiFormatted}%
        </AppText>
      </View>
    );
  };
  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const currentPortfolio = getPortfolioById(route.params.id);
        if (currentPortfolio) {
          await getAlertExists(currentPortfolio.id);
          setPortfolio({
            id: currentPortfolio.id,
            name: currentPortfolio.name,
            stocks: currentPortfolio.detail.stocks,
            currentCash: currentPortfolio.detail.currentCash,
            initialAsset: currentPortfolio.detail.initialAsset,
            riskValue: currentPortfolio.riskValue,
            auto: currentPortfolio.auto,
          });
          setLoading(false);
        } else setLoading(false);
      } catch (error) {
        console.log("Detail loadData error: ", error);
        setLoading(false);
      }
    };

    loadPortfolio();
  }, [portfolios]);

  if (loading) {
    return <Loading />;
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.outline}>
        <View style={styles.outlineHeader}>
          <AppText style={{ fontSize: 17, color: "#f0f0f0" }}>총 자산</AppText>
          <View style={{ flexDirection: "row" }}>
            <Button
              type="clear"
              onPress={() => {
                navigation.navigate("AlertList", { pfId: portfolio.id });
              }}
              icon={{
                name: "bell-fill",
                type: "octicon",
                color: alertExist ? "#fedf3e" : "#f0f0f0",
              }}
            />
            <Button
              type="clear"
              onPress={() => {
                navigation.navigate("ManagementPage", { portfolio });
              }}
              icon={{
                name: "settings-sharp",
                type: "ionicon",
                color: "#f0f0f0",
              }}
            />
          </View>
        </View>
        <AppText style={{ fontSize: 25, color: "#f0f0f0", fontWeight: "bold" }}>
          {getTotalPrice().toLocaleString()} 원
        </AppText>
        <AppText
          style={
            portfolio.riskValue === 1
              ? { color: "#91ff91" }
              : portfolio.riskValue === 2
              ? { color: "#ffbf44" }
              : { color: "#ff5858" }
          }
        >
          {portfolio.riskValue === 1
            ? "안정투자형"
            : portfolio.riskValue === 2
            ? "위험중립형"
            : portfolio.riskValue === 3
            ? "위험중립형"
            : ""}
        </AppText>
        <View style={styles.outlineDetail}>
          <View style={styles.outlineDetailBox}>
            <AppText style={{ fontWeight: "bold", color: "#f0f0f0" }}>
              평가손익
            </AppText>
            {getPortfolioROI()}
          </View>
          <View style={styles.outlineDetailBox}>
            <AppText style={{ fontWeight: "bold", color: "#f0f0f0" }}>
              현금
            </AppText>
            <AppText style={{ color: "#f0f0f0" }}>
              {portfolio.currentCash.toLocaleString()} 원
            </AppText>
          </View>
        </View>
      </View>
      <View style={styles.chartContainer}>
        <PortfolioPieChart
          data={portfolio}
          cash={portfolio}
          selectedId={selectedId}
          size={width * 0.6}
        />
        {selectedId !== null && (
          <View style={{ position: "absolute", alignItems: "center" }}>
            <AppText style={[styles.centerText, { fontWeight: "bold" }]}>{`${
              (getStockRate(selectedId).toFixed(3) * 1000) / 10 // 소숫점 계산 오류 방지를 위함
            }%`}</AppText>
            <AppText style={[styles.centerText, { fontSize: 12 }]}>
              {portfolio.stocks[selectedId].companyName}
            </AppText>
          </View>
        )}
        {!portfolio.auto && (
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => {
              navigation.navigate("AddStockInManual", { pfId: portfolio.id });
            }}
          >
            <Icon name="plus" type="antdesign" color="#f0f0f0" />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.itemContainer}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: selectedId === null ? 60 : 20,
          }}
          showsVerticalScrollIndicator={true}
          persistentScrollbar={true}
        >
          <AppText
            style={{
              fontSize: 25,
              padding: 5,
              color: "#333",
              fontWeight: "bold",
            }}
          >
            주식
          </AppText>
          {portfolio.stocks.map((item, index) => {
            const roi = getStockROI(index);
            const roiFormatted = roi > 0 ? `+${roi}` : `${roi}`;
            return (
              <React.Fragment key={index}>
                {stocksLength === index && (
                  <AppText
                    style={{
                      fontSize: 25,
                      padding: 5,
                      color: "#333",
                      fontWeight: "bold",
                    }}
                  >
                    안전자산
                  </AppText>
                )}
                <TouchableOpacity
                  style={[
                    styles.item,
                    selectedId === index ? styles.selectedItem : {},
                  ]}
                  onPress={() => handleSelectedId(index)}
                >
                  <View style={styles.companyInfo}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <AppText
                        style={{
                          fontSize: 18,
                          color: "#f0f0f0",
                        }}
                      >
                        {item.companyName}
                      </AppText>
                      {!portfolio.auto && (
                        <Button
                          type="clear"
                          onPress={() => {
                            setModifyPrice(item.currentPrice);
                            toggleInfoModal();
                            setSelectedId(index);
                          }}
                          icon={{
                            name: "pencil",
                            type: "ionicon",
                            color: "#f0f0f0",
                            size: 15,
                          }}
                        />
                      )}
                    </View>
                    <View>
                      <AppText style={[styles.itemText, { color: "#aaa" }]}>
                        {Number(item.currentPrice).toLocaleString()} 원
                      </AppText>
                      <AppText
                        style={[
                          styles.itemText,
                          roi > 0
                            ? { color: "#ff5858" }
                            : roi < 0
                            ? { color: "#5878ff" }
                            : { color: "#666" },
                        ]}
                      >
                        {roiFormatted} %
                      </AppText>
                    </View>
                  </View>
                  <Divider
                    color={colorScale[index]}
                    width={2}
                    style={{
                      marginVertical: height * 10,
                    }}
                  />
                  <View style={styles.myInfo}>
                    <View>
                      <AppText
                        style={{
                          fontSize: 20,
                          color: "#f0f0f0",
                          fontWeight: "bold",
                        }}
                      >
                        {(item.currentPrice * item.quantity).toLocaleString()}{" "}
                        원
                      </AppText>
                      <AppText style={{ color: "#f0f0f0" }}>
                        <AppText style={{ fontSize: 11, color: "#aaa" }}>
                          평균 구매가{" "}
                        </AppText>
                        <AppText>{item.averageCost.toLocaleString()}원</AppText>
                      </AppText>
                    </View>
                    <View>
                      <AppText
                        style={{
                          fontSize: 13,
                          color: "#777",
                        }}
                      >
                        {Number(item.quantity).toLocaleString()} 주
                      </AppText>
                      <AppText style={{ color: colorScale[index] }}>{`${
                        (getStockRate(index).toFixed(3) * 1000) / 10 // 소숫점 계산 오류 방지를 위함
                      }%`}</AppText>
                    </View>
                  </View>
                  {selectedId === index && item.equity === "보통주" && (
                    <React.Fragment>
                      <Divider />
                      <View style={styles.utilContainer}>
                        <TouchableOpacity
                          style={styles.utilButton}
                          onPress={toggleStockModal}
                        >
                          <AppText style={{ fontSize: 18, color: "#f0f0f0" }}>
                            종목 정보
                          </AppText>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.utilButton}
                          onPress={() => {
                            navigation.navigate("NewsSummary", {
                              ticker: item.ticker,
                            });
                          }}
                        >
                          <AppText style={{ fontSize: 18, color: "#f0f0f0" }}>
                            뉴스 요약
                          </AppText>
                        </TouchableOpacity>
                      </View>
                    </React.Fragment>
                  )}
                </TouchableOpacity>
              </React.Fragment>
            );
          })}
        </ScrollView>
      </View>
      {selectedId !== null && (
        <React.Fragment>
          <StockInfo
            isVisible={stockInfoVisible}
            onToggle={toggleStockModal}
            ticker={portfolio.stocks[selectedId].ticker}
          />
          <ModalComponent isVisible={infoVisible} onToggle={toggleInfoModal}>
            <AppText
              style={{
                position: "absolute",
                top: 0,
                color: "#f0f0f0",
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              종목 수정
            </AppText>
            <View style={styles.content}>
              <AppText
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#f0f0f0",
                  marginBottom: 20,
                }}
              >
                {portfolio.stocks[selectedId].companyName}
              </AppText>
              <View style={styles.contentsItem}>
                <View style={styles.quantityContainer}>
                  <Button
                    buttonStyle={{ marginHorizontal: -10 }}
                    type="clear"
                    onPress={() => {
                      handleQuantityChange(String(Number(modifyQuantity) - 1));
                    }}
                    icon={{
                      name: "minuscircleo",
                      type: "antdesign",
                      color: "#f0f0f0",
                      size: 18,
                    }}
                  />
                  <TextInput
                    value={String(modifyQuantity)}
                    onChangeText={(value) => handleQuantityChange(value)}
                    style={styles.inputQuantity}
                    keyboardType="numeric"
                  />
                  <Button
                    buttonStyle={{ marginHorizontal: -10 }}
                    type="clear"
                    onPress={() => {
                      handleQuantityChange(String(Number(modifyQuantity) + 1));
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
                  value={String(modifyPrice)}
                  onChangeText={(value) => handlePriceChange(value)}
                  style={styles.inputPrice}
                  keyboardType="numeric"
                />
                <Button
                  containerStyle={{ flex: 0.7 }}
                  titleStyle={{ color: modifyBuy ? "#ff5858" : "#5878ff" }}
                  title={modifyBuy ? "매수" : "매도"}
                  type="clear"
                  onPress={() => {
                    handleBuyChange(modifyBuy);
                  }}
                />
              </View>
            </View>
            <Button
              buttonStyle={styles.submitButton}
              title="반영"
              disabled={modifyQuantity == 0}
              onPress={async () => {
                await fetchModifyStockManual();
                resetModifyData();
                await loadData();
                toggleInfoModal();
              }}
            />
          </ModalComponent>
        </React.Fragment>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    backgroundColor: "#f5f5f5",
    backgroundColor: "#333",
  },
  outline: {
    padding: width * 10,
    backgroundColor: "#333",
  },
  outlineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  outlineDetail: {
    marginTop: 10,
    flexDirection: "row",
  },
  outlineDetailBox: {
    width: "50%",
    alignItems: "center",
    marginRight: 12,
    paddingRight: 12,
    borderRightWidth: 1,
    borderColor: "#bbb",
  },
  alert: {
    position: "absolute",
    top: 0,
    right: 0,
    margin: 20,
  },
  alertDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
  },
  chartContainer: {
    flex: 2.5,
    backgroundColor: "#f0f0f0",
    alignItems: "center", // 자식 요소를 수평 중앙 정렬
    justifyContent: "center", // 자식 요소를 수직 중앙 정렬
    padding: height * -10,
    marginTop: height * 0,
  },
  centerText: {
    fontSize: 20,
  },
  itemContainer: {
    flex: 4,
    marginTop: height * -30,
    backgroundColor: "#f0f0f0",
    padding: width * 10,
  },
  item: {
    justifyContent: "flex-start", // 내용을 세로 방향으로 중앙 정렬
    alignItems: "stretch", // 내용을 가로 방향으로 중앙 정렬
    backgroundColor: "#333",
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
  },
  companyInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  myInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },
  utilContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 5,
    marginTop: 10,
  },
  utilButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    fontSize: 14,
    textAlign: "right", // 텍스트를 가운데 정렬
  },
  floatingButton: {
    position: "absolute",
    bottom: height * 35,
    right: width * 20,
    width: width * 50,
    height: width * 50,
    borderRadius: 50,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // for Android shadow
    shadowColor: "#000", // for iOS shadow
    shadowOffset: { width: 0, height: 2 }, // for iOS shadow
    shadowOpacity: 0.3, // for iOS shadow
    shadowRadius: 2, // for iOS shadow
  },
  content: {
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  contentsItem: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 20,
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
  submitButton: {
    backgroundColor: "#6262e8",
    borderRadius: 10,
    height: 40,
  },
});
export default PortfolioDetails;
