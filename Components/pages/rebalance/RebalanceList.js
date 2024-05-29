import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { getUsertoken } from "../../utils/localStorageUtils";
import urls from "../../utils/urls";
import AppText from "../../utils/AppText";
import Loading from "../../utils/Loading";
import { usePortfolio } from "../../utils/PortfolioContext";

const RebalanceList = ({ route, navigation }) => {
  const portfolioId = route.params.id;
  const { rebalances } = usePortfolio();
  const [rebalanceList, setRebalanceList] = useState([]);

  useEffect(() => {
    const rebalance = rebalances.filter(
      (rebalance) => (rebalance.pfId = portfolioId)
    );
    setRebalanceList(rebalance);
  }, []);

  return (
    <View style={styles.container}>
      <AppText style={{ fontSize: 30, padding: 10, marginBottom: 20 }}>
        알림 목록
      </AppText>
      {rebalanceList.map((rebalance, index) => (
        <View key={index}>
          <TouchableOpacity
            style={styles.alertBox}
            onPress={() => {
              navigation.navigate("ModifyPortfolio", {
                portId: rebalance.pfId,
                rnId: rebalance.rnId,
                list: [...rebalance.rebalancings],
              });
            }}
          >
            <AppText style={{ fontSize: 25 }}>알림 2024-05-20</AppText>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    padding: 5,
    backgroundColor: "#f5f5f5",
  },
  alertBox: {
    backgroundColor: "#ddd",
    borderRadius: 5,
    margin: 10,
    marginTop: 10,
    padding: 10,
  },
});
export default RebalanceList;
