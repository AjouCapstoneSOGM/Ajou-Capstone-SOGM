import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { getUsertoken } from "../../utils/localStorageUtils";
import urls from "../../utils/urls";
import AppText from "../../utils/AppText";
import Loading from "../../utils/Loading";
import NotificationBubble from "../../utils/Notification";

const RebalanceList = ({ route, navigation }) => {
  const portfolioId = route.params.id;
  const [rebalanceList, setRebalanceList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRebalanceList = async () => {
    try {
      const token = await getUsertoken();
      const response = await fetch(
        `${urls.springUrl}/api/rebalancing/${portfolioId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data.rebalancing;
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchRebalanceList();
        setRebalanceList(result);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load data", error);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <Loading />;
  }

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
                portId: portfolioId,
                rnId: rebalance.rnId,
                list: [...rebalance.rebalancings],
              });
            }}
          >
            <AppText style={{ fontSize: 25 }}>알림 1</AppText>
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
