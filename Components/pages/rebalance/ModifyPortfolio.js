import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { arraysEqual, deepCopy, filteringNumber } from "../../utils/utils";
import GetCurrentPrice from "../../utils/GetCurrentPrice";
import { usePortfolio } from "../../utils/PortfolioContext";

const ModifyPortfolio = ({ route, navigation }) => {
  const [loading, setLoading] = useState(true);
  const [rebalances, setRebalances] = useState([]);
  const [rebalancesOffer, setRebalancesOffer] = useState([]);
  const { fetchModify } = usePortfolio();
  const rnId = route.params.rnId;
  const portId = route.params.portId;

  const updateKey = (reblances) => {
    const updated = reblances.map((stock) => {
      return {
        isBuy: stock.isBuy,
        quantity: Number(stock.number),
        price: parseFloat(stock.price),
        ticker: stock.ticker,
      };
    });

    return updated;
  };

  const handleModify = async () => {
    const rebalanceData = updateKey([...rebalances]);
    Alert.alert("수정 확인", "위 항목으로 포트폴리오를 수정하실건가요?", [
      {
        text: "취소",
        onPress: () => {},
      },
      {
        text: "확인",
        onPress: async () => {
          setLoading(true);
          try {
            await fetchModify(rebalanceData, portId, rnId);

            // 변경 여부 확인
            if (!arraysEqual(rebalances, rebalancesOffer)) {
              console.log("다릅니다.");
            }

            // 수정 완료 알림
            Alert.alert("수정 완료", "수정이 완료되었습니다.", [
              {
                text: "확인",
                onPress: () => {
                  navigation.navigate("PortfolioDetails", { id: portId });
                },
                style: "destructive", // iOS에서만 적용되는 스타일 옵션
              },
            ]);
          } catch (error) {
            console.error("수정 중 오류 발생:", error);
            Alert.alert(
              "수정 실패",
              "수정 중 오류가 발생했습니다. 다시 시도해주세요.",
              [{ text: "확인", onPress: () => {} }]
            );
          } finally {
            setLoading(false);
          }
        },
        style: "destructive", // iOS에서만 적용되는 스타일 옵션
      },
    ]);
  };

  const fetchAllCurrent = async (tickerList) => {
    const result = await Promise.all(tickerList.map(GetCurrentPrice));
    return result;
  };

  const handleChangePrices = (index, value) => {
    const newRebalances = [...rebalances];
    if (value <= 9999999) newRebalances[index].price = filteringNumber(value);
    setRebalances(newRebalances);
  };

  const handleChangeBuy = (index, value) => {
    const newRebalances = [...rebalances];
    newRebalances[index].isBuy = value;
    setRebalances(newRebalances);
  };

  const handleChangeNumber = (index, value) => {
    const newRebalances = [...rebalances];
    if (value <= 9999) newRebalances[index].number = filteringNumber(value);
    setRebalances(newRebalances);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const stockList = route.params.list;
        const tickerList = stockList.map((item) => item.ticker);
        const currentPrices = await fetchAllCurrent(tickerList);
        const rebalancesWithCurrent = stockList.map((item, index) => ({
          ...item,
          price: currentPrices[index].currentPrice,
        }));

        const deepcopyResult1 = deepCopy(rebalancesWithCurrent);
        const deepcopyResult2 = deepCopy(rebalancesWithCurrent);

        setRebalancesOffer(deepcopyResult1);
        setRebalances(deepcopyResult2);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load data", error);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.rebalanceContainer}>
          {rebalances.map((item, index) => (
            <View style={styles.rebalanceBlock} key={index}>
              <View>
                <Text style={{ fontSize: 20, paddingHorizontal: 10 }}>
                  {item.name}
                </Text>
              </View>
              <View style={styles.inputContainer}>
                <View style={styles.inputTextContainer}>
                  <TextInput
                    style={styles.input_Amount}
                    keyboardType="numeric"
                    value={item.price.toString()}
                    onChangeText={(text) => handleChangePrices(index, text)}
                    placeholder={rebalancesOffer[index].price.toString()}
                    placeholderTextColor="#bbb"
                  />
                  <Text style={{ fontWeight: "bold", fontSize: 17 }}>
                    원에&nbsp;&nbsp;
                  </Text>
                  <TextInput
                    style={styles.input_Amount}
                    keyboardType="numeric"
                    value={item.number.toString()}
                    placeholder={rebalancesOffer[index].number.toString()}
                    placeholderTextColor="#bbb"
                    onChangeText={(text) => handleChangeNumber(index, text)}
                  />
                  <Text style={{ fontWeight: "bold", fontSize: 17 }}>주를</Text>
                </View>
                <View style={styles.tradeButtonContainer}>
                  <TouchableOpacity
                    style={[
                      styles.tradeButton,
                      item.isBuy ? { backgroundColor: "#6495ED" } : "",
                    ]}
                    onPress={() => handleChangeBuy(index, true)}
                  >
                    <Text
                      style={[
                        { fontSize: 18 },
                        item.isBuy ? { color: "white" } : "",
                      ]}
                    >
                      매수
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.tradeButton,
                      !item.isBuy ? { backgroundColor: "#6495ED" } : "",
                    ]}
                    onPress={() => handleChangeBuy(index, false)}
                  >
                    <Text
                      style={[
                        { fontSize: 18 },
                        !item.isBuy ? { color: "white" } : "",
                      ]}
                    >
                      매도
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.button} onPress={() => handleModify()}>
        <Text style={{ fontSize: 18, color: "white" }}>수정</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "stretch",
    padding: 5,
    backgroundColor: "#f5f5f5",
  },
  rebalanceContainer: {
    justifyContent: "flex-start",
  },
  rebalanceBlock: {
    alignItems: "stretch",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginVertical: 5,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    marginTop: 10,
  },
  inputTextContainer: {
    flexDirection: "row",
    flexGrow: 1,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  input_Amount: {
    justifyContent: "center", // 가로 방향에서 중앙 정렬
    alignItems: "center",
    backgroundColor: "#ddd",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginVertical: 12,
    marginHorizontal: 6,
    fontSize: 18,
  },
  tradeButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexGrow: 1,
  },
  tradeButton: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#aaa",
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

export default ModifyPortfolio;
