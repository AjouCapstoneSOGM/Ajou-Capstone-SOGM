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
import PagerView from "react-native-pager-view";
import PortfolioPieChart from "../../../utils/PortfolioPieChart";
import { Icon } from "@rneui/base";
import { colorScale } from "../../../utils/utils";
import { width, height } from "../../../utils/utils";

const AutoPage4 = ({ amount, riskLevel, interest, step }) => {
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
        <View style={styles.column}>
          <AppText style={styles.columnName}>종목</AppText>
          <AppText style={styles.columnTicker}>티커</AppText>
        </View>
        <View style={styles.labelContainer}>
          <ScrollView persistentScrollbar={true}>
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
        <View style={styles.column}>
          <AppText style={styles.columnName}>종목</AppText>
          <AppText style={styles.columnTicker}>티커</AppText>
        </View>
        <View style={styles.labelContainer}>
          <ScrollView>
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
            size={width * 0.55}
          />
        </View>
        <View>
          <AppText
            style={{ color: "#f0f0f0", marginBottom: 10, fontWeight: "bold" }}
          >
            다음과 같은 비율로 종목이 구성돼요
          </AppText>
        </View>
        <View style={[styles.column, { paddingLeft: 20 }]}>
          <AppText style={styles.columnName}>종목</AppText>
          <AppText style={styles.columnNumber}>수량</AppText>
          <AppText style={styles.columnPrice}>1주 당 금액</AppText>
        </View>
        <ScrollView>
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
        </ScrollView>
      </View>
    );
  };
  const result4 = () => {
    return (
      <View style={styles.pageContainer}>
        <View style={styles.infoContainer}>
          <ScrollView>
            <AppText
              style={{ color: "#ffbf44", fontSize: 20, fontWeight: "bold" }}
            >
              최초 포트폴리오에 관한 자세한 정보는 리밸런싱 알림의 형태로
              제공돼요.
            </AppText>
            <View style={styles.imageContainer}>
              <Image
                source={require("../../../assets/images/guide.png")}
                style={styles.image}
              />
            </View>
            <AppText style={{ color: "#f0f0f0", fontSize: 16 }}>
              포트폴리오 상세 정보 페이지에서 포트폴리오 정보를 확인하고, 다른
              주식 거래 서비스를 통해 종목을 직접 매수하고 난 뒤에, 알림을
              반영하면 포트폴리오가 완성돼요.
              {"\n\n"}
            </AppText>
            <AppText
              style={{ color: "#f0f0f0", fontSize: 20, fontWeight: "bold" }}
            >
              이후에도 저희가 알림을 통해 지속적으로 포트폴리오 관리를
              도와드릴게요!
            </AppText>
          </ScrollView>
        </View>
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <AppText style={styles.titleText}>생성이 완료되었어요!{"\n"}</AppText>
      </View>
      <View style={styles.contentsContainer}>
        {step === 4 && result1()}
        {step === 5 && result2()}
        {step === 6 && result3()}
        {step === 7 && result4()}
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
    paddingHorizontal: width * 10,
    paddingBottom: height * 10,
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
  },
  infoContainer: {
    marginTop: height * -10,
    marginBottom: height * 10,
  },
  contentsContainer: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: "#333",
    paddingTop: height * 20,
  },
  labelContainer: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: "#333",
    paddingTop: 0,
  },
  column: {
    flexDirection: "row",
    marginBottom: height * 5,
  },
  columnName: {
    flex: 1,
    marginLeft: width * 20,
    marginRight: width * 35,
    color: "#808080",
    textAlign: "center",
  },
  columnNumber: {
    flex: 1,
    color: "#808080",
  },
  columnPrice: {
    flex: 1,
    marginRight: width * 15,
    color: "#808080",
    textAlign: "center",
  },
  columnTicker: {
    flex: 1,
    color: "#808080",
    textAlign: "center",
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
    marginHorizontal: 5,
    borderBottomColor: "#434343",
    borderBottomWidth: 1,
  },
  chartContainer: {
    alignItems: "center",
  },
  itemName: {
    flex: 1,
    color: "#f0f0f0",
    marginRight: width * -15,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
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
    flex: 1,
    color: "#f0f0f0",
    textAlign: "center",
    fontSize: 15,
  },
  imageContainer: {
    marginVertical: 30,
    width: "100%",
    height: 200,
    borderColor: "#888",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
});
