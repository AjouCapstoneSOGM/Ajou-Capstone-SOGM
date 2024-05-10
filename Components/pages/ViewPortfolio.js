import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import urls from "../utils/urls";
import GetCurrentPrice from "../utils/GetCurrentPrice";
import { getUsertoken } from "../utils/localStorageUtils";
import Icon from "react-native-vector-icons/AntDesign";

const PortfolioList = ({ navigation }) => {
  const [portfolios, setPortfolios] = useState([
    {
      auto: null,
      country: null,
      createDate: null,
      detail: {
        currentCash: 0,
        stocks: [],
      },
      id: null,
      riskValue: null,
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(false);

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
  const sortStocks = (stocks) => {
    const sortedStocks = stocks.sort(
      (a, b) => b.averageCost * b.quantity - a.averageCost * a.quantity
    );
    return sortedStocks;
  };

  //포트폴리오 리스트를 요청
  const fetchPortfolio = async () => {
    try {
      const token = await getUsertoken();
      const response = await fetch(`${urls.springUrl}/api/portfolio`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  //포트폴리오 ID를 주고 종목 리스트를 받아오는 요청
  const fetchStocksByPortfolioId = async (id) => {
    try {
      const token = await getUsertoken();
      const response = await fetch(
        `${urls.springUrl}/api/portfolio/${id}/performance`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const stocks = await response.json();

      if (response.ok) {
        const sortedStocks = sortStocks(stocks.portfolioPerformance);
        return {
          currentCash: stocks.currentCash,
          stocks: sortedStocks,
        };
      } else {
        console.log(stocks);
      }
    } catch (error) {
      console.error("Could not fetch stocks for portfolio:", id, error);
      return {
        currentCash: 0,
        stocks: [],
      }; // 에러가 나면 빈 배열 반환
    }
  };

  //각 포트폴리오 ID에 해당하는 종목들을 일괄적으로 조회
  const fetchAllStocks = async (portfolioIds) => {
    const promises = portfolioIds.map((id) => {
      return fetchStocksByPortfolioId(id);
    });
    const portfoliosWithStocks = await Promise.all(promises);
    return portfoliosWithStocks;
  };

  //종목들의 최신 현재가 조회를 위한 Promise 생성
  const fetchAllCurrent = async (portfoliosWithStocks) => {
    const result = await Promise.all(
      portfoliosWithStocks.map((portfolio) => {
        return fetchCurrentPrice(portfolio);
      })
    );
    return result;
  };

  //각 종목의 최신 현재가 조회
  const fetchCurrentPrice = async (portfolio) => {
    const result = await Promise.all(
      portfolio.stocks.map((stocks) => {
        return GetCurrentPrice(stocks.ticker);
      })
    );
    portfolio.stocks.forEach((stocks, index) => {
      if (result[index] && result[index].currentPrice) {
        stocks.currentPrice = result[index].currentPrice;
      } else {
        console.log(
          `No current price data available for stock at index ${index}`
        );
      }
    });
    return portfolio;
  };

  //포트폴리오 리스트 중 ID만 추출 후 반환
  const getPortfolioIds = (portfolioList) => {
    result = portfolioList.map((portfolio) => {
      return portfolio.id;
    });
    return result;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchPortfolio();
        const portfolioList = data.portfolios;
        const portfolioIds = getPortfolioIds(portfolioList);
        const portfolioStocks = await fetchAllStocks(portfolioIds);
        const stocksWithCurrent = await fetchAllCurrent(portfolioStocks);
        portfolioList.forEach((portfolio, index) => {
          portfolio.detail = stocksWithCurrent[index];
        });
        setPortfolios(portfolioList);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setErrorState(true);
      }
    };
    loadData();
  }, []);

  if (errorState) {
    return (
      <View style={styles.errorContent}>
        <Text>포트폴리오 로딩에 실패하였습니다.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.errorContent}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!portfolios) {
    return (
      <View style={styles.errorContent}>
        <Text>포트폴리오가 없습니다.</Text>
      </View>
    );
  }
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
  return (
    <View style={styles.portfolioContainer}>
      {portfolios.map((portfolio) => {
        const roi = getTotalROI(portfolio.detail);
        const roiFormatted = roi >= 0 ? `+${roi}` : `-${roi}`;
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
                navigation.navigate("PortfolioDetails", { portfolio })
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
