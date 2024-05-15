import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Button } from "react-native";
import { usePortfolio } from "../utils/PortfolioContext";

import Icon from "react-native-vector-icons/AntDesign";

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
        <Text
          style={[
            styles.riskText,
            {
              color: "#006400",
              backgroundColor: "#90EE90",
            },
          ]}
        >
          위험도 안전
        </Text>
      );
    } else if (risk === 2) {
      return (
        <Text
          style={[
            styles.riskText,
            {
              color: "#FF8C00",
              backgroundColor: "#FFDAB9",
            },
          ]}
        >
          위험도 중간
        </Text>
      );
    } else {
      return (
        <Text
          style={[
            styles.riskText,
            {
              color: "#8B0000",
              backgroundColor: "#FFB6C1",
            },
          ]}
        >
          위험도 위험
        </Text>
      );
    }
  };

  if (portLoading) {
    return (
      <View style={styles.errorContent}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (portfolios.length === 0) {
    return (
      <View style={styles.errorContent}>
        <Text>포트폴리오가 없습니다.</Text>
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
                <Text style={styles.portfolioName}>테스트의 포트폴리오 1</Text>
                <Text style={[styles.portfolioName, { fontSize: 15 }]}>
                  {portfolio.auto ? "자동" : "수동"} / {portfolio.country}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.portfolioContent}
                onPress={() =>
                  navigation.navigate("PortfolioDetails", { id: portfolio.id })
                }
              >
                <View style={{ height: 100, justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                    {(
                      getTotalPrice(portfolio.detail.stocks) + currentCash
                    ).toLocaleString()}
                    원
                  </Text>
                  <Text
                    style={[
                      { fontSize: 17, fontWeight: "bold" },
                      roi >= 0 ? { color: "#4CAF50" } : { color: "#F44336" },
                    ]}
                  >
                    {roiFormatted}%
                  </Text>
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
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  portfolioButton: {
    justifyContent: "flex-start",
    backgroundColor: "#6495ED",
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // 상자 그림자로 입체감 주기
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
  },
  riskText: {
    alignSelf: "flex-start",
    fontSize: 14,
    padding: 3,
    borderRadius: 8,
    marginTop: 5,
  },
  portfolioContent: {
    height: 140,
    flexDirection: "row",
    justifyContent: "space-between", // 가로 방향에서 중앙 정렬
    backgroundColor: "#f0f0f0",
    alignItems: "flex-start",
    padding: 20,
    borderBottomLeftRadius: 10,
    borderBottomEndRadius: 10,
  },
});
export default PortfolioList;
