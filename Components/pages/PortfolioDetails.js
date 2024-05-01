import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Button,
  StyleSheet,
} from "react-native";
import { VictoryPie } from "victory-native";
import urls from "../utils/urls";
import GetCurrentPrice from "../utils/GetCurrentPrice";

const screenWidth = Dimensions.get("window").width;

const PortfolioDetails = ({ route }) => {
  const [portfolio, setPortfolio] = useState({
    id: null,
    name: "",
    stocks: [],
    totalPrice: 0,
  });
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  const ex_stocks = [
    {
      ticker: "005930",
      companyName: "삼성",
      quantity: 10,
      averagePrice: 90000,
      currentPrice: 0,
    },
    {
      ticker: "003550",
      companyName: "LG",
      quantity: 5,
      averagePrice: 70000,
      currentPrice: 0,
    },
    {
      ticker: "034730",
      companyName: "SK",
      quantity: 15,
      averagePrice: 80000,
      currentPrice: 0,
    },
    {
      ticker: "035420",
      companyName: "네이버",
      quantity: 12,
      averagePrice: 110000,
      currentPrice: 0,
    },
    {
      ticker: "035720",
      companyName: "카카오",
      quantity: 9,
      averagePrice: 95000,
      currentPrice: 0,
    },
  ];
  const colorScale = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#F77825",
    "#9966FF",
    "#00BFA5",
    "#C94D77",
    "#4D4D4D",
    "#7CDDDD",
  ];

  // API로 받아온 데이터
  const fetchPortfolioDetails = async () => {
    try {
      const response = await fetch(
        `${urls.springUrl}/api/${portfolio.id}/performance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );
      const data = await response.json();
      console.log("Suceess:", data);
      return data;
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const chartData = portfolio.stocks.map((detail) => ({
    x: detail.companyName,
    y: detail.averagePrice * detail.quantity,
  }));

  const handleSelectItem = (id) => {
    setSelectedId(id);
  };

  // 현재 가격 업데이트
  async function updateCurrentPrices(stocks, tickers) {
    try {
      const prices = await GetCurrentPrice(tickers);
      const updatedStocks = stocks.map((stock, index) => ({
        ...stock,
        currentPrice: prices[index].currentPrice,
      }));
      return updatedStocks;
    } catch (error) {
      console.error("가격 정보를 가져오는데 실패했습니다:", error);
      return stocks; // 오류 발생시 원래 주식 목록 반환
    }
  }

  function processPortfolioData(data) {
    const sortedStocks = data.sort(
      (a, b) => b.averagePrice * b.quantity - a.averagePrice * a.quantity
    );
    const totalPrice = sortedStocks.reduce(
      (sum, stock) => sum + stock.quantity * stock.averagePrice,
      0
    );
    const tickers = sortedStocks.map((stock) => stock.ticker);
    return { sortedStocks, totalPrice, tickers };
  }

  async function fetchPortfolioData() {
    try {
      fetchedData = ex_stocks; //임시
      // const fetchedData = await fetchPortfolioDetails();
      return processPortfolioData(fetchedData);
    } catch (error) {
      console.error("포트폴리오 데이터 로드 실패:", error);
      return { stocks: [], totalPrice: 0 }; // 오류 발생시 기본 데이터
    }
  }

  useEffect(() => {
    async function loadData() {
      const { sortedStocks, totalPrice, tickers } = await fetchPortfolioData();
      const stocksWithPrices = await updateCurrentPrices(sortedStocks, tickers);
      setPortfolio({
        id: route.params.portfolio.id,
        name: route.params.portfolio.name,
        stocks: stocksWithPrices,
        totalPrice: totalPrice,
      });
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{portfolio.name}</Text>
      <View style={styles.chartContainer}>
        <VictoryPie
          data={chartData}
          colorScale={colorScale}
          width={screenWidth}
          height={400}
          innerRadius={({ index }) => (index === selectedId ? 45 : 50)}
          labelRadius={({ index }) => (index === selectedId ? 130 : 110)}
          radius={({ index }) => (index === selectedId ? 110 : 100)} // 선택된 조각의 반경을 증가
          labels={({ datum }) => `${datum.x}`}
          style={{
            labels: {
              fill: "black",
              fontSize: 15,
            },
          }}
        />
        {selectedId !== null && (
          <Text style={styles.centerText}>{`${
            ((
              (portfolio.stocks[selectedId].quantity *
                portfolio.stocks[selectedId].averagePrice) /
              totalPrice
            ).toFixed(3) *
              1000) /
            10 // 소숫점 계산 오류 방지를 위함
          }%`}</Text>
        )}
      </View>
      <View style={styles.itemContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {portfolio.stocks.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.item,
                selectedId === index ? styles.selectedItem : {},
              ]}
              onPress={() => handleSelectItem(index)}
            >
              <View style={styles.nameContainer}>
                <Text style={{ textAlign: "left", fontSize: 16, padding: 10 }}>
                  {item.companyName}
                </Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.itemText}>
                  {item.currentPrice.toLocaleString()}
                </Text>
                <Text style={styles.itemText}>
                  {item.averagePrice.toLocaleString()}
                </Text>
                <Text style={styles.itemText}>
                  {(item.averagePrice * item.quantity).toLocaleString()}
                </Text>
                <Text
                  style={[
                    styles.itemText,
                    item.averagePrice > item.currentPrice
                      ? { color: "blue" }
                      : { color: "red" },
                  ]}
                >
                  {((
                    (item.currentPrice - item.averagePrice) /
                    item.averagePrice
                  ).toFixed(4) *
                    10000) /
                    100}
                  %
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="뉴스 요약" onPress={() => {}} />
        <Button title="수정" onPress={() => {}} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    padding: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  chartContainer: {
    flex: 4,
    overflow: "hidden",
    position: "relative", // 컨테이너를 상대 위치로 설정
    alignItems: "center", // 자식 요소를 수평 중앙 정렬
    justifyContent: "center", // 자식 요소를 수직 중앙 정렬
  },
  centerText: {
    position: "absolute", // Text 컴포넌트를 절대 위치로 설정
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  itemContainer: {
    flex: 4,
    flexDirection: "column",
    overflow: "hidden",
  },
  nameContainer: {
    flex: 2,
  },
  infoContainer: {
    flex: 4,
    justifyContent: "space-between",
    alignContent: "stretch",
    flexWrap: "wrap",
  },
  item: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 5,
    height: 120,
    justifyContent: "center", // 내용을 세로 방향으로 중앙 정렬
    alignItems: "center", // 내용을 가로 방향으로 중앙 정렬
    marginHorizontal: 10, // 박스끼리의 수평 간격
    shadowColor: "#000", // 그림자 색
    shadowOpacity: 1.25, // 그림자 투명도
    shadowRadius: 4, // 그림자 퍼짐
    elevation: 4, // Android에서 그림자 효과
    marginBottom: 5, // 아래쪽 여백 추가
    marginTop: 5,
  },
  selectedItem: {
    backgroundColor: "#E5FFDD",
  },
  itemText: {
    fontSize: 16,
    textAlign: "center", // 텍스트를 가운데 정렬
    marginBottom: 3,
  },
  detailItem: {
    flex: 2,
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    width: 400, // 박스의 폭을 고정
    height: 200, // 박스의 높이를 고정
    padding: 20,
    justifyContent: "space-between", // 내용을 세로 방향으로 중앙 정렬
    alignItems: "center", // 내용을 가로 방향으로 중앙 정렬
    shadowColor: "#000", // 그림자 색
    shadowOpacity: 1.25, // 그림자 투명도
    shadowRadius: 4, // 그림자 퍼짐
    elevation: 4, // Android에서 그림자 효과
    marginBottom: 10, // 아래쪽 여백 추가
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "space-around",
  },
});
export default PortfolioDetails;
