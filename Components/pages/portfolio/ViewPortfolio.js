import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Button } from "react-native";
import { usePortfolio } from "../../utils/PortfolioContext";

import Icon from "react-native-vector-icons/AntDesign";
import AppText from "../../utils/AppText";

const PortfolioList = ({ navigation }) => {
  const { portfolios, portLoading } = usePortfolio();

  //포트폴리오 종목의 총 가격 반환
  const getTotalPrice = (stocks) => {
    const totalPrice = stocks.reduce(
      (acc, cur) => acc + cur.currentPrice * cur.quantity,
      0
    );
    return totalPrice;
  };

  //포트폴리오의 총 투자 금액 반환
  const getTotalInvestment = (stocks) => {
    const totalPrice = stocks.reduce(
      (acc, cur) => acc + cur.averageCost * cur.quantity,
      0
    );
    return totalPrice;
  };

  //포트폴리오의 총 수익률 계산 후 반환
  const getTotalROI = (detail) => {
    const totalPrice = getTotalPrice(detail.stocks) + detail.currentCash;
    const totalInvestment =
      getTotalInvestment(detail.stocks) + detail.currentCash;
    const totalROI = (
      ((totalPrice - totalInvestment) / totalInvestment) *
      100
    ).toFixed(2);
    return totalROI;
  };

  const getRiskText = (risk) => {
    if (risk === 1) {
      return (
        <AppText
          style={[
            styles.riskText,
            {
              color: "#006400",
              backgroundColor: "#90EE90",
            },
          ]}
        >
          안정투자형
        </AppText>
      );
    } else if (risk === 2) {
      return (
        <AppText
          style={[
            styles.riskText,
            {
              color: "#F07C00",
              backgroundColor: "#FFDAB9",
            },
          ]}
        >
          위험중립형
        </AppText>
      );
    } else {
      return (
        <AppText
          style={[
            styles.riskText,
            {
              color: "#8B0000",
              backgroundColor: "#FFB6C1",
            },
          ]}
        >
          적극투자형
        </AppText>
      );
    }
  };

  if (portLoading) {
    return (
      <View style={styles.errorContent}>
        <AppText>Loading...</AppText>
      </View>
    );
  }

  if (portfolios.length === 0) {
    return (
      <View style={styles.errorContent}>
        <AppText>포트폴리오가 없습니다.</AppText>
      </View>
    );
  } else {
    return (
      <View style={styles.portfolioContainer}>
        {portfolios.map((portfolio) => {
          const roi = getTotalROI(portfolio.detail);
          const roiFormatted = roi >= 0 ? `+${roi}` : `${roi}`;
          const currentCash = portfolio.detail.currentCash;

          return (
            <View key={portfolio.id} style={styles.portfolioButton}>
              <View style={styles.portfolioBody}>
                <AppText style={styles.portfolioName}>
                  테스트의 포트폴리오 1
                </AppText>
                <AppText style={[styles.portfolioName, { fontSize: 15 }]}>
                  {portfolio.auto ? "자동" : "수동"} / {portfolio.country}
                </AppText>
              </View>
              <TouchableOpacity
                style={styles.portfolioContent}
                onPress={() =>
                  navigation.navigate("PortfolioDetails", { id: portfolio.id })
                }
              >
                <View style={{ height: 100, justifyContent: "space-between" }}>
                  <AppText style={{ fontSize: 25, fontWeight: "bold" }}>
                    {(
                      getTotalPrice(portfolio.detail.stocks) + currentCash
                    ).toLocaleString()}{" "}
                    원
                  </AppText>
                  <AppText
                    style={[
                      { fontSize: 17, fontWeight: "bold" },
                      roi >= 0 ? { color: "#ff3a00" } : { color: "#0c5bff" },
                    ]}
                  >
                    {roiFormatted}%
                  </AppText>
                  {getRiskText(portfolio.riskValue)}
                </View>
                <Icon
                  style={{ alignSelf: "center" }}
                  name="right"
                  size={30}
                  color="#000"
                />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  portfolioContainer: {
    alignItems: "stretch",
    margin: 10,
  },
  errorContent: {
    height: 140,
    backgroundColor: "#e5e5e5",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  portfolioButton: {
    justifyContent: "flex-start",
    backgroundColor: "#6495ED",
    borderRadius: 5,
    marginVertical: 10,
  },
  portfolioBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  portfolioName: {
    margin: 10,
    fontSize: 17,
    color: "white",
    fontWeight: "bold",
  },
  riskText: {
    alignSelf: "flex-start",
    fontSize: 14,
    padding: 5,
    borderRadius: 3,
    fontWeight: "bold",
  },
  portfolioContent: {
    height: 140,
    flexDirection: "row",
    justifyContent: "space-between", // 가로 방향에서 중앙 정렬
    backgroundColor: "#f0f0f0",
    alignItems: "flex-start",
    padding: 20,
    borderBottomLeftRadius: 5,
    borderBottomEndRadius: 5,
    borderWidth: 1,
    borderColor: "#bbb",
  },
});
export default PortfolioList;
