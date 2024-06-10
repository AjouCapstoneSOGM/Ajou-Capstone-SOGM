import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { getUsertoken } from "../../../utils/localStorageUtils";
import urls from "../../../utils/urls";
import Loading from "../../../utils/Loading";
import AppText from "../../../utils/AppText";
import { usePortfolio } from "../../../utils/PortfolioContext";
import { Button, Divider, Icon } from "@rneui/base";
import { width, height } from "../../../utils/utils";

const ListPage2 = ({ step, setStep, interest, stockList, setStockList }) => {
  const {
    fetchStocksByPortfolioId,
    fetchRebalanceList,
    fetchDelete,
  } = usePortfolio();
  const [loading, setLoading] = useState(true);
  const [pfId, setPfId] = useState("");
  const [portfolio, setPortfolio] = useState([]);
  const [initRebalance, setInitRebalance] = useState([]);

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handleSelectedStocks = (stock) => {
    setStockList((prevSelectedStocks) => {
      const isSelected = prevSelectedStocks.some(
        (s) => s.ticker === stock.ticker
      );
      if (isSelected) {
        // 이미 선택된 종목이면 제거
        return prevSelectedStocks.filter((s) => s.ticker !== stock.ticker);
      } else {
        // 선택되지 않은 종목이면 추가
        return [...prevSelectedStocks, stock];
      }
    });
  };

  useEffect(() => {
    if (pfId) {
      const loadPortfolio = async () => {
        const portfolio = await fetchStocksByPortfolioId(pfId);
        const rebalance = await fetchRebalanceList(pfId);
        setPortfolio(portfolio);
        setInitRebalance(rebalance[0].rebalancings);
        setLoading(false);
      };
      const loadAndDelete = async () =>{
        await loadPortfolio();
        await fetchDelete(pfId);
      }
      loadAndDelete();
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
              sector: [interest],
              asset: 10000000,
              riskValue: 1,
            }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Success:", data);
          setPfId(data.pfId);
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error:", error);
        throw error;
      }
    };

    if (portfolio.length === 0) fetchAutoInfo();
  }, []);

  if (loading)
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <AppText style={styles.titleText}>
            {"\n"}
            {"\n"}
          </AppText>
        </View>
        <View style={styles.contentsContainer}>
          <Loading />
        </View>
      </View>
    );
    
  const result3 = () => {
    return (
      <View style={styles.pageContainer}>
        <TouchableOpacity onPress={console.log("init: ", initRebalance)} />
        <View style={styles.itemContainer}>
          <View style={styles.selectedContainer}>
            <ScrollView>
              {initRebalance.map((stock, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestion}
                  onPress={() => handleSelectedStocks(stock)}
                >
                  <View style={{ flexDirection: "row" }}>
                    <AppText style={{ color: "#f0f0f0" }}>
                      {stock.name}
                      {"  "}
                    </AppText>
                    <AppText style={{ fontSize: 13, color: "#888" }}>
                      {stock.ticker}
                    </AppText>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <AppText style={{ fontSize: 13, color: "#fff" }}>{stock.price.toLocaleString()} 원</AppText>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <AppText style={styles.titleText}>
          추가하실 종목을 선택해주세요
        </AppText>
      </View>
      <View style={styles.contentsContainer}>
        <View style={styles.selectedContainer}>
          {stockList.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.selectedItem}
              onPress={() => handleSelectedStocks(item)}
            >
              <AppText>{item.name}</AppText>
              <Icon name="close" size={12} color="#222" />
            </TouchableOpacity>
          ))}
        </View>
        {result3()}
      </View>
      <View style={styles.nextButtonContainer}>
        <Button
          buttonStyle={styles.nextButton}
          title={"완료"}
          onPress={handleNextStep}
        />
      </View>
    </View>
  );
};

export default ListPage2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },
  textContainer: {
    paddingHorizontal: width * 10,
    paddingBottom: height * 10,
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
    paddingTop: height * 20,
  },
  column: {
    flexDirection: "row",
    marginBottom: height * 5,
  },
  pageContainer: {
    flex: 1,
    paddingHorizontal: height * 15,
  },
  labelItemContent: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 12,
    marginTop: 12,
    borderBottomColor: "#434343",
    borderBottomWidth: 1,
  },
  itemName: {
    flex: 1,
    color: "#f0f0f0",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },
  itemNameBox: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
  nextButton: {
    backgroundColor: "#6262e8",
    borderRadius: 10,
    height: height * 50,
  },
  nextButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: height * 5,
    backgroundColor: "#333",
  },
  itemContainer: {
    flex: 1,
    backgroundColor: "#333",
  },
  selectedContainer: {
    paddingVertical: 5,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    padding: 7,
    margin: 5,
  },
  suggestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    marginHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#434343",
  },
});
