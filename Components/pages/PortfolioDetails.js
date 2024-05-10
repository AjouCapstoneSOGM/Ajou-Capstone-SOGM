import { center } from "@shopify/react-native-skia";
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

const screenWidth = Dimensions.get("window").width;

const PortfolioDetails = ({ route, navigation }) => {
  const [portfolio, setPortfolio] = useState({
    id: null,
    name: "",
    stocks: [],
    currentCash: 0,
    totalPrice: 0,
  });
  const [selectedId, setSelectedId] = useState(null);
  const [chartData, setChartData] = useState([]);

  const colorScale = [
    "hsl(348, 70%, 86%)", // 파스텔 핑크
    "hsl(207, 54%, 80%)", // 파스텔 블루
    "hsl(48, 100%, 78%)", // 파스텔 옐로우
    "hsl(174, 36%, 76%)", // 파스텔 그린
    "hsl(20, 85%, 72%)", // 파스텔 오렌지
    "hsl(262, 70%, 80%)", // 파스텔 퍼플
    "hsl(174, 60%, 70%)", // 파스텔 시안
    "hsl(338, 50%, 72%)", // 파스텔 레드
    "hsl(0, 10%, 60%)", // 연 회색
    "hsl(180, 50%, 80%)", // 파스텔 시안-그린
  ];

  const handlePressSummary = () => {
    selectedTicker = portfolio.stocks[selectedId].ticker;
    navigation.navigate("NewsSummary", { ticker: selectedTicker });
  };

  const getStockROI = (id) => {
    const current = portfolio.stocks[id].currentPrice;
    const average = portfolio.stocks[id].averageCost;

    if (current === 0 || average === 0) return 0;

    return (current - average) / average;
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

  useEffect(() => {
    const currentPortfolio = route.params.portfolio;
    setPortfolio({
      id: currentPortfolio.id,
      name: currentPortfolio.name,
      stocks: currentPortfolio.detail.stocks,
      currentCash: currentPortfolio.detail.currentCash,
    });
  }, []);

  useEffect(() => {
    if (portfolio) {
      const data = portfolio.stocks.map((stock) => ({
        x: stock.companyName,
        y: stock.averageCost * stock.quantity,
      }));
      data.push({ x: "현금", y: portfolio.currentCash });
      setChartData(data);
    }
  }, [portfolio]); // portfolio 상태가 변경될 때마다 이 effect 실행

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{portfolio.name}</Text>
      <View style={styles.chartContainer}>
        <VictoryPie
          data={chartData}
          colorScale={colorScale}
          innerRadius={({ index }) => (index === selectedId ? 80 : 85)}
          radius={({ index }) => (index === selectedId ? 145 : 135)} // 선택된 조각의 반경을 증가
          labels={() => ""}
          style={styles.chart}
        />
        {selectedId !== null && (
          <View style={{ position: "absolute", alignItems: "center" }}>
            <Text style={styles.centerText}>{`${
              (getStockRate(selectedId).toFixed(3) * 1000) / 10 // 소숫점 계산 오류 방지를 위함
            }%`}</Text>
            <Text style={[styles.centerText, { fontSize: 17 }]}>
              {portfolio.stocks[selectedId].companyName}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.itemContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {portfolio.stocks.map((item, index) => {
            const roi = getStockROI(index);
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.item,
                  selectedId === index ? styles.selectedItem : {},
                ]}
                onPress={() => setSelectedId(index)}
              >
                <View
                  style={[
                    styles.nameContainer,
                    { backgroundColor: colorScale[index] },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#222",
                    }}
                  >
                    {item.companyName}
                  </Text>
                </View>
                {selectedId === index && (
                  <View style={styles.infoContainer}>
                    <Text style={styles.itemText}>
                      {item.currentPrice.toLocaleString()}
                    </Text>
                    <Text style={styles.itemText}>
                      {item.averageCost.toLocaleString()}
                    </Text>
                    <Text style={styles.itemText}>
                      {(item.averageCost * item.quantity).toLocaleString()}
                    </Text>
                    <Text
                      style={[
                        styles.itemText,
                        roi >= 0 ? { color: "#4CAF50" } : { color: "#F44336" },
                      ]}
                    >
                      {(roi.toFixed(4) * 1000) / 10}%
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="뉴스 요약" onPress={handlePressSummary} />
        <Button title="수정" onPress={() => {}} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    padding: 5,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  chartContainer: {
    flex: 4,
    alignItems: "center", // 자식 요소를 수평 중앙 정렬
    justifyContent: "center", // 자식 요소를 수직 중앙 정렬
  },
  chart: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // 상자 그림자로 입체감 주기
  },
  centerText: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  itemContainer: {
    flex: 4,
  },
  item: {
    marginTop: 10,
    borderRadius: 10,
    height: 60,
    justifyContent: "center", // 내용을 세로 방향으로 중앙 정렬
    alignItems: "stretch", // 내용을 가로 방향으로 중앙 정렬
    backgroundColor: "f0f0f0",
    marginBottom: -15,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedItem: {
    height: 200,
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  nameContainer: {
    padding: 18,
    backgroundColor: "#6495ED",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  infoContainer: {
    justifyContent: "space-between",
    alignContent: "stretch",
    flexWrap: "wrap",
  },
  itemText: {
    fontSize: 16,
    textAlign: "center", // 텍스트를 가운데 정렬
    marginBottom: 3,
  },
});
export default PortfolioDetails;
