import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import urls from "../utils/urls";
import GetCurrentPrice from "../utils/GetCurrentPrice";
import { getUsertoken } from "../utils/localStorageUtils";

const PortfolioList = ({ navigation }) => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

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
  const getTotalROI = (stocks) => {
    const totalPrice = getTotalPrice(stocks);
    const totalInvestment = getTotalInvestment(stocks);
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
      if (response.ok) {
        const stocks = await response.json();
        const sortedStocks = sortStocks(stocks.portfolioPerformance);
        return {
          currentCash: stocks.currentCash,
          stocks: sortedStocks,
        };
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
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {portfolios.map((portfolio) => (
          <TouchableOpacity
            key={portfolio}
            style={styles.contentsButton}
            onPress={() =>
              navigation.navigate("PortfolioDetails", { portfolio })
            }
          >
            <Text>{portfolio.id}</Text>
            <Text>{portfolio.auto ? "자동" : "수동"}</Text>
            <Text>{portfolio.country}</Text>
            <Text>"{portfolio.name}"</Text>
            <Text>{portfolio.riskValue}</Text>
            <Text>
              {getTotalPrice(portfolio.detail.stocks).toLocaleString()} &#8361;
            </Text>
            <Text>{getTotalROI(portfolio.detail.stocks)}%</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 5,
  },
  buttonContainer: {
    alignItems: "center",
  },
  contentsButton: {
    justifyContent: "center", // 가로 방향에서 중앙 정렬
    backgroundColor: "#ddd",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    width: "90%",
  },
});
export default PortfolioList;
