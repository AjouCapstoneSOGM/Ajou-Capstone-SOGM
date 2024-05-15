import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/AntDesign";
import { VictoryPie } from "victory-native";
import { usePortfolio } from "../utils/PortfolioContext";
import { getUsertoken } from "../utils/localStorageUtils";
import urls from "../utils/urls";

const PortfolioDetails = ({ route, navigation }) => {
  const { getPortfolioById } = usePortfolio();
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState({
    id: null,
    name: "",
    stocks: [],
    currentCash: 0,
    totalPrice: 0,
  });
  const [selectedId, setSelectedId] = useState(null);
  const [chartData, setChartData] = useState([]);
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const currentPortfolio = getPortfolioById(route.params.id);
        await getAlertExists(currentPortfolio.id);
        setPortfolio({
          id: currentPortfolio.id,
          name: currentPortfolio.name,
          stocks: currentPortfolio.detail.stocks,
          currentCash: currentPortfolio.detail.currentCash,
        });
        setLoading(false);
      } catch (error) {
        console.log("Detail loadData error: ", error);
      }
    };

    loadData();
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

  useLayoutEffect(() => {
    if (portfolio) {
      navigation.setOptions({
        title: `pfId: ${portfolio.id}`, // 실행 시간에 제목 변경
        headerRight: () => (
          <TouchableOpacity
            style={styles.manageButton}
            onPress={() => navigation.navigate("ManagementPage", { portfolio })}
          >
            <Text style={{ fontSize: 16, color: "white" }}>관리</Text>
          </TouchableOpacity>
        ),
      });
    }
  }, [portfolio]);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.outline}>
        <Text>총 자산</Text>
        <Text>{portfolio.currentCash.toLocaleString()}원</Text>
      </View>
      <View style={styles.chartContainer}>
        <VictoryPie
          data={chartData}
          colorScale={colorScale}
          innerRadius={({ index }) => (index === selectedId ? 60 : 70)}
          radius={({ index }) => (index === selectedId ? 135 : 120)} // 선택된 조각의 반경을 증가
          labels={() => ""}
          style={styles.chart}
        />
        {selectedId !== null && (
          <View style={{ position: "absolute", alignItems: "center" }}>
            <Text style={[styles.centerText, { fontWeight: "bold" }]}>{`${
              (getStockRate(selectedId).toFixed(3) * 1000) / 10 // 소숫점 계산 오류 방지를 위함
            }%`}</Text>
            <Text style={[styles.centerText, { fontSize: 17 }]}>
              {portfolio.stocks[selectedId].companyName}
            </Text>
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
          {portfolio.stocks.map((item, index) => {
            const roi = getStockROI(index);
            const roiFormatted = roi >= 0 ? `+${roi}` : `${roi}`;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.item,
                  selectedId === index ? styles.selectedItem : {},
                ]}
                onPress={() => handleSelectedId(index)}
              >
                <View style={styles.infoContainer}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 17, color: "#222" }}>
                      {item.companyName}
                    </Text>
                    <Text style={{ fontSize: 13, color: "#777" }}>
                      {Number(item.quantity).toLocaleString()} 주
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      alignItems: "flex-end",
                      paddingHorizontal: 10,
                    }}
                  >
                    <Text style={{ fontSize: 19 }}>
                      {(item.averageCost * item.quantity).toLocaleString()} 원
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={[
                          styles.itemText,
                          { paddingHorizontal: 15 },
                          roi >= 0
                            ? { color: "#4CAF50" }
                            : { color: "#F44336" },
                        ]}
                      >
                        {Number(item.currentPrice).toLocaleString()} 원
                      </Text>
                      <Text
                        style={[
                          styles.itemText,
                          roi >= 0
                            ? { color: "#4CAF50" }
                            : { color: "#F44336" },
                        ]}
                      >
                        {roiFormatted}%
                      </Text>
                    </View>
                  </View>
                  <Icon name="down" size={23} color="#222" />
                </View>
                {selectedId === index && (
                  <View style={styles.utilContainer}>
                    <TouchableOpacity
                      style={{ backgroundColor: "#ddd" }}
                      onPress={() => {
                        navigation.navigate("NewsSummary", {
                          ticker: item.ticker,
                        });
                      }}
                    >
                      <Text style={{ fontSize: 20, color: "black" }}>
                        뉴스 요약 보기
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <TouchableOpacity
        style={styles.alert}
        onPress={() => {
          navigation.navigate("RebalanceList", { id: portfolio.id });
        }}
      >
        <Icon name="bells" size={35} color="#555" />
        {alertExist && <View style={styles.alertDot} />}
      </TouchableOpacity>
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
  outline: {},
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
    fontSize: 20,
  },
  itemContainer: {
    flex: 4,
    borderTopWidth: 5,
    borderColor: "#ccc",
  },
  item: {
    height: 80,
    justifyContent: "flex-start", // 내용을 세로 방향으로 중앙 정렬
    alignItems: "stretch", // 내용을 가로 방향으로 중앙 정렬
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
  },
  selectedItem: {
    height: 120,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 80,
  },
  utilContainer: {
    justifyContent: "space-between",
    alignContent: "stretch",
    flexWrap: "wrap",
  },
  itemText: {
    fontSize: 16,
    textAlign: "center", // 텍스트를 가운데 정렬
    marginBottom: 3,
  },
  manageButton: {
    paddingRight: 20,
  },
  button: {
    justifyContent: "center", // 가로 방향에서 중앙 정렬
    backgroundColor: "#6495ED",
    alignItems: "center",
    borderRadius: 10,
    padding: 18,
    margin: 5,
  },
});
export default PortfolioDetails;
