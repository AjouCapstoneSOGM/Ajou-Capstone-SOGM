import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { usePortfolio } from "../../utils/PortfolioContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon, Button } from "@rneui/base";
import PagerView from "react-native-pager-view";

import AppText from "../../utils/AppText";
import FooterComponent from "../../utils/Footer";
import HeaderComponent from "../../utils/Header";
import PortfolioPieChart from "../../utils/PortfolioPieChart";
import Loading from "../../utils/Loading";

const PortfolioList = ({ navigation }) => {
  const { portfolios, loadData, portLoading } = usePortfolio();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const portfolioExist = () => {
    if (portLoading) return false;
    if (portfolios.length > 0) return true;
    return false;
  };
  const getTotalPrice = (stocks) => {
    const totalPrice = stocks.reduce(
      (acc, cur) => acc + cur.currentPrice * cur.quantity,
      0
    );
    return totalPrice;
  };

  // 포트폴리오의 총 수익률 계산 후 반환
  const getTotalROI = (detail) => {
    const benefit =
      getTotalPrice(detail.stocks) + detail.currentCash - detail.initialAsset;
    const totalROI = ((benefit / detail.initialAsset) * 100).toFixed(2);
    return totalROI;
  };

  const sumAllPrices = () => {
    if (portfolioExist()) {
      return portfolios.reduce((total, portfolio) => {
        const stockTotal = getTotalPrice(portfolio.detail.stocks);
        return total + stockTotal + portfolio.detail.currentCash;
      }, 0);
    }
    return 0;
  };

  const handlePageChange = (e) => {
    setSelectedIndex(e.nativeEvent.position);
  };

  const reloadData = async () => {
    await loadData();
  };
  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent />
      {portLoading && <Loading />}
      <View style={styles.totalContainer}>
        <AppText style={{ fontSize: 25 }}>
          <AppText style={{ fontWeight: "bold" }}>테스트</AppText>
          <AppText>님 총 자산</AppText>
        </AppText>
        <AppText>
          <AppText style={{ fontSize: 32, fontWeight: "bold" }}>
            {sumAllPrices().toLocaleString()}{" "}
          </AppText>
          <AppText style={{ fontSize: 20 }}>원</AppText>
        </AppText>
      </View>
      {portfolioExist() && (
        <View style={styles.chartContainer}>
          {portfolios[selectedIndex] && (
            <PortfolioPieChart
              data={portfolios[selectedIndex].detail}
              size={1}
            />
          )}
        </View>
      )}
      {portfolioExist() && (
        <PagerView
          style={styles.listContainer}
          initialPage={0}
          onPageSelected={handlePageChange}
        >
          {portfolios.map((portfolio, index) => {
            const roi = getTotalROI(portfolio.detail);
            const roiFormatted = roi > 0 ? `+${roi}` : `${roi}`;
            const currentCash = portfolio.detail.currentCash;
            return (
              <View key={index}>
                <TouchableOpacity
                  style={styles.portfolio}
                  onPress={() => {
                    navigation.navigate("PortfolioDetails", {
                      id: portfolio.id,
                    });
                  }}
                >
                  <View style={styles.portfolioHeader}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <AppText style={{ color: "#f0f0f0" }}>
                        {"테스트의 포트폴리오 1"}
                      </AppText>
                      <Button
                        type="clear"
                        onPress={() => {}}
                        icon={{
                          name: "pencil",
                          type: "ionicon",
                          color: "#f0f0f0",
                          size: 15,
                        }}
                      />
                    </View>
                    <AppText style={{ color: "#f0f0f0" }}>
                      <AppText>
                        {portfolio.auto ? "자동" : "수동"}
                        {"  "}
                      </AppText>
                      <AppText>{portfolio.country}</AppText>
                    </AppText>
                  </View>
                  <View style={styles.portfolioContent}>
                    <AppText
                      style={{
                        fontSize: 30,
                        color: "#f0f0f0",
                      }}
                    >
                      <AppText style={{ fontWeight: "bold" }}>
                        {(
                          getTotalPrice(portfolio.detail.stocks) + currentCash
                        ).toLocaleString()}{" "}
                      </AppText>
                      <AppText style={{ fontSize: 20 }}>원</AppText>
                    </AppText>
                    <AppText
                      style={[
                        { fontSize: 17, fontWeight: "bold", marginBottom: 5 },
                        roi > 0
                          ? { color: "#ff5858" }
                          : roi < 0
                          ? { color: "#5888ff" }
                          : { color: "#666" },
                      ]}
                    >
                      {roiFormatted}%
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
                        ? "적극투자형"
                        : ""}
                    </AppText>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </PagerView>
      )}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => {
          navigation.navigate("MakePortfolio");
        }}
      >
        <Icon name="plus" type="antdesign" color="#f0f0f0" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.reloadButton}
        onPress={() => {
          reloadData();
        }}
      >
        <Icon name="reload1" type="antdesign" color="#f0f0f0" />
      </TouchableOpacity>
      <FooterComponent />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: "#f0f0f0",
  },
  totalContainer: {
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  listContainer: {
    flex: 1,
  },
  portfolio: {
    height: 200,
    backgroundColor: "#333",
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    marginHorizontal: 20,
    marginTop: 35,
  },
  portfolioHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  portfolioContent: {
    justifyContent: "space-around",
  },
  chartContainer: {
    position: "absolute",
    bottom: 70,
  },
  floatingButton: {
    position: "absolute",
    bottom: 90,
    right: 15,
    width: 80,
    height: 80,
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
  reloadButton: {
    position: "absolute",
    bottom: 90,
    left: 15,
    width: 80,
    height: 80,
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
});

export default PortfolioList;
