import React, { useCallback, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Button, Divider, Icon } from "@rneui/base";

import { SafeAreaView } from "react-native-safe-area-context";
import AppText from "../../utils/AppText.js";
import { usePortfolio } from "../../utils/PortfolioContext.js";
import { useFocusEffect } from "@react-navigation/native";

const AlertList = ({ route, navigation }) => {
  const { rebalances } = usePortfolio();
  const [rebalanceList, setRebalanceList] = useState([]);

  const getIsBuyCount = (stocks) => {
    const buyCount = stocks.filter((item) => item.isBuy === true).length;
    const sellCount = stocks.length - buyCount;
    return { buyCount, sellCount };
  };

  useFocusEffect(
    useCallback(() => {
      if (route.params) {
        setRebalanceList(
          rebalances.filter((rebalance) => rebalance.pfId === route.params.pfId)
        );
      } else {
        setRebalanceList(rebalances);
      }
    }, [])
  );
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button
          type="clear"
          onPress={() => {
            navigation.goBack();
          }}
          icon={{ name: "left", type: "antdesign", color: "#333" }}
        />
      </View>
      <View style={styles.textContainer}>
        <AppText style={{ fontSize: 30, fontWeight: "bold" }}>알림</AppText>
      </View>
      <ScrollView style={styles.alertList}>
        {rebalanceList.map((item, index) => {
          const { buyCount, sellCount } = getIsBuyCount(item.rebalancings);
          return (
            <View key={index}>
              <TouchableOpacity
                style={styles.alertContainer}
                onPress={() => {
                  navigation.navigate("ModifyPortfolio", {
                    pfId: item.pfId,
                    rnId: item.rnId,
                    rebalancing: item.rebalancings,
                  });
                }}
              >
                <View style={styles.alertHeader}>
                  <AppText>
                    <Icon
                      name="settings-sharp"
                      type="ionicon"
                      color="#f0f0f0"
                      size={16}
                    />
                    <AppText style={{ fontSize: 13, color: "#808080" }}>
                      {"  "}
                      리밸런싱 알림
                    </AppText>
                  </AppText>
                  <AppText style={{ fontSize: 13, color: "#808080" }}>
                    {item.createdDate}
                  </AppText>
                </View>
                <AppText style={styles.alertContent}>
                  테스트용 포트폴리오 1 에서 {buyCount}개의 매수, {sellCount}
                  개의 매도 알림이 생성되었어요
                </AppText>
              </TouchableOpacity>
              <Divider />
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: "#f0f0f0",
  },
  header: {
    height: 60,
    alignItems: "flex-start",
  },
  textContainer: {
    height: 90,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  alertList: {
    backgroundColor: "#333",
    padding: 10,
  },
  alertContainer: {
    padding: 5,
  },
  alertHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  alertContent: {
    fontSize: 16,
    color: "#f0f0f0",
    marginLeft: 10,
    paddingBottom: 20,
  },
});
export default AlertList;
