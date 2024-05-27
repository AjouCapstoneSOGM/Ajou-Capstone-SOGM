import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { getUsertoken } from "../../../utils/localStorageUtils";
import urls from "../../../utils/urls";
import Loading from "../../../utils/Loading";
import AppText from "../../../utils/AppText";
import { usePortfolio } from "../../../utils/PortfolioContext";
import PagerView from "react-native-pager-view";
import PortfolioPieChart from "../../../utils/PortfolioPieChart";
import { Icon } from "@rneui/base";
import { colorScale } from "../../../utils/utils";

const AutoPage4 = ({ amount, riskLevel, interest }) => {
  const { fetchStocksByPortfolioId, fetchCurrentPrice, fetchRebalanceList } =
    usePortfolio();
  const [loading, setLoading] = useState(true);
  const [pfId, setPfId] = useState("");
  const [portfolio, setPortfolio] = useState([]);
  const [initRebalance, setInitRebalance] = useState([]);
  const [selectedId, setSelectedId] = useState();

  const handleSelectedId = (index) => {
    if (selectedId === index) setSelectedId(null);
    else setSelectedId(index);
  };

  useEffect(() => {
    if (pfId) {
      const loadPortfolio = async () => {
        const portfolio = await fetchStocksByPortfolioId(pfId);
        const rebalance = await fetchRebalanceList(pfId);
        setPortfolio(portfolio);
        setInitRebalance(rebalance[0]);
        setLoading(false);
      };
      loadPortfolio();
    }
  }, [pfId]);

  useEffect(() => {
    const fetchAutoInfo = async () => {
      try {
        const token = await getUsertoken();
        const response = await fetch(
          `${urls.springUrl}/api/portfolio/create/auto`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              country: "KOR",
              name: "테스트",
              sector: [interest],
              asset: amount,
              riskValue: riskLevel,
            }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          setPfId(data.pfId);
          console.log("Success:", data);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
        throw error;
      }
    };

    fetchAutoInfo();
  }, []);
  if (loading) return <Loading />;

  const result1 = () => {
    return (
      <View style={styles.pageContainer}>
        <View style={styles.infoContainer}>
          <AppText
            style={{ color: "#f0f0f0", fontSize: 18, fontWeight: "bold" }}
          >
            현재 기업들의 가치지표 순위에 따라 다음과 같은 종목이 선별되었어요
          </AppText>
        </View>
        <View style={styles.labelContainer}>
          <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
            {portfolio.stocks.map(
              (stock, index) =>
                stock.equity === "보통주" && (
                  <TouchableOpacity
                    key={index}
                    style={styles.labelItemContent}
                    onPress={() => handleSelectedId(index)}
                  >
                    <AppText style={styles.itemName}>
                      {stock.companyName}
                    </AppText>
                    <AppText style={styles.itemTicker}>{stock.ticker}</AppText>
                  </TouchableOpacity>
                )
            )}
          </ScrollView>
        </View>
      </View>
    );
  };
  const result2 = () => {
    return (
      <View style={styles.pageContainer}>
        <View style={styles.infoContainer}>
          <AppText
            style={{ color: "#f0f0f0", fontSize: 18, fontWeight: "bold" }}
          >
            그리고 두 개의 안전자산을 포함시킬게요{"\n"}
          </AppText>
        </View>
        <View style={styles.labelContainer}>
          <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
            {portfolio.stocks.map(
              (stock, index) =>
                stock.equity === "안전자산" && (
                  <TouchableOpacity
                    key={index}
                    style={styles.labelItemContent}
                    onPress={() => handleSelectedId(index)}
                  >
                    <AppText style={styles.itemName}>
                      {stock.companyName}
                    </AppText>
                    <AppText style={styles.itemTicker}>{stock.ticker}</AppText>
                  </TouchableOpacity>
                )
            )}
          </ScrollView>
        </View>
      </View>
    );
  };
  const result3 = () => {
    return (
      <View style={styles.pageContainer}>
        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={styles.chartContainer}>
            <PortfolioPieChart
              data={{
                currentCash: 0,
                stocks: initRebalance.rebalancings.map((stock) => ({
                  companyName: stock.name,
                  quantity: stock.number,
                  currentPrice: stock.price,
                })),
              }}
              selectedId={selectedId}
              size={0.6}
            />
          </View>
          <View>
            <AppText
              style={{ color: "#f0f0f0", marginBottom: 10, fontWeight: "bold" }}
            >
              다음과 같은 비율로 종목이 구성돼요
            </AppText>
            {initRebalance.rebalancings.map((stock, index) => (
              <TouchableOpacity
                key={index}
                style={styles.labelItemContent}
                onPress={() => handleSelectedId(index)}
              >
                <Icon
                  name="checkcircle"
                  type="antdesign"
                  color={colorScale[index]}
                  size={15}
                  style={{ marginRight: 5 }}
                />
                <AppText style={styles.itemName}>{stock.name}</AppText>
                <AppText style={styles.itemNumber}>{stock.number}주</AppText>
                <AppText style={styles.itemPrice}>
                  {Number(stock.price).toLocaleString()}원
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <AppText style={styles.titleText}>생성이 완료되었어요!{"\n"}</AppText>
      </View>
      <View style={styles.contentsContainer}>
        <PagerView style={styles.contentsContainer} initialPage={0}>
          {result1()}
          {result2()}
          {result3()}
        </PagerView>
      </View>
    </View>
  );
};

export default AutoPage4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },
  textContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
  },
  contentsContainer: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: "#333",
    paddingVertical: 20,
  },
  pageContainer: {
    paddingHorizontal: 20,
  },
  infoContainer: {
    alignItems: "flex-start",
    marginBottom: 20,
  },
  labelItemContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    marginTop: 12,
    marginHorizontal: 5,
    borderBottomColor: "#434343",
    borderBottomWidth: 1,
  },
  chartContainer: {
    alignItems: "center",
  },
  itemName: {
    flex: 1.5,
    color: "#f0f0f0",
    marginRight: 10,
    fontWeight: "bold",
    textAlign: "left",
    fontSize: 15,
  },
  itemNumber: {
    flex: 1,
    color: "#f0f0f0",
    textAlign: "center",
    fontSize: 15,
  },
  itemPrice: {
    flex: 1,
    color: "#f0f0f0",
    textAlign: "center",
    fontSize: 15,
  },
  itemTicker: {
    color: "#f0f0f0",
    textAlign: "center",
    fontSize: 15,
  },
});
