import React, { useState, useCallback } from "react";
import { View, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { usePortfolio } from "../../utils/PortfolioContext";
import { getUsertoken } from "../../utils/localStorageUtils";
import { useFocusEffect } from "@react-navigation/native";

import urls from "../../utils/urls";
import AppText from "../../utils/AppText";
import { SafeAreaView } from "react-native-safe-area-context";
import PortfolioPieChart from "../../utils/PortfolioPieChart";
import { Button, Divider, Icon, color } from "@rneui/base";

const PortfolioDetails = ({ route, navigation }) => {
  const stocksLength = 10;
  const { getPortfolioById, portfolios } = usePortfolio();
  const [portfolio, setPortfolio] = useState({
    id: null,
    name: "",
    stocks: [],
    currentCash: 0,
    totalPrice: 0,
    initialAsset: 0,
    riskValue: 0,
  });
  const [selectedId, setSelectedId] = useState(null);
  const [alertExist, setAlertExist] = useState(false);
  const colorScale = [
    "hsl(348, 100%, 80%)", // 파스텔 핑크,
    "hsl(207, 94%, 80%)", // 파스텔 블루,
    "hsl(48, 100%, 78%)", // 파스텔 옐로우,
    "hsl(144, 76%, 76%)", // 파스텔 그린,
    "hsl(20, 100%, 72%)", // 파스텔 오렌지,
    "hsl(262, 100%, 80%)", // 파스텔 퍼플,
    "hsl(174, 100%, 70%)", // 파스텔 시안,
    "hsl(338, 90%, 72%)", // 파스텔 레드,
    "hsl(20, 20%, 60%)", // 연 회색,
    "hsl(300, 90%, 80%)", // 파스텔 시안-그린,
    "#555",
    "#888",
    "#ccc",
  ];
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
      (portfolio.stocks[id].quantity * portfolio.stocks[id].averageCost) /
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
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        try {
          const currentPortfolio = getPortfolioById(route.params.id);
          await getAlertExists(currentPortfolio.id);
          setPortfolio({
            id: currentPortfolio.id,
            name: currentPortfolio.name,
            stocks: currentPortfolio.detail.stocks,
            currentCash: currentPortfolio.detail.currentCash,
            initialAsset: currentPortfolio.detail.initialAsset,
            riskValue: currentPortfolio.riskValue,
          });
        } catch (error) {
          console.log("Detail loadData error: ", error);
        }
      };

      loadData();
    }, [portfolios])
  );

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
            : "적극투자형"}
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
          size={1}
        />
        {selectedId !== null && (
          <View style={{ position: "absolute", alignItems: "center" }}>
            <AppText style={[styles.centerText, { fontWeight: "bold" }]}>{`${
              (getStockRate(selectedId).toFixed(3) * 1000) / 10 // 소숫점 계산 오류 방지를 위함
            }%`}</AppText>
            <AppText style={[styles.centerText, { fontSize: 13 }]}>
              {portfolio.stocks[selectedId].companyName}
            </AppText>
          </View>
        )}
      </View>
      <View style={styles.itemContainer}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: selectedId === null ? 60 : 20,
          }}
          showsVerticalScrollIndicator={false}
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
                    <AppText
                      style={{
                        fontSize: 18,
                        color: "#f0f0f0",
                      }}
                    >
                      {item.companyName}
                    </AppText>
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
                      marginVertical: 10,
                    }}
                  />
                  <View style={styles.myInfo}>
                    <View>
                      <AppText
                        style={{
                          fontSize: 25,
                          color: "#f0f0f0",
                          fontWeight: "bold",
                        }}
                      >
                        {(item.currentPrice * item.quantity).toLocaleString()}{" "}
                        원
                      </AppText>
                      <AppText style={{ color: "#f0f0f0" }}>
                        <AppText style={{ fontSize: 12 }}>평단가 </AppText>
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
                  {selectedId === index && (
                    <React.Fragment>
                      <Divider />
                      <View style={styles.utilContainer}>
                        <TouchableOpacity
                          style={styles.utilButton}
                          onPress={() => {
                            navigation.navigate("NewsSummary", {
                              ticker: item.ticker,
                            });
                          }}
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
    padding: 10,
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
    padding: 20,
  },
  centerText: {
    fontSize: 20,
  },
  itemContainer: {
    flex: 4,
    backgroundColor: "#f0f0f0",
    padding: 10,
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
});
export default PortfolioDetails;