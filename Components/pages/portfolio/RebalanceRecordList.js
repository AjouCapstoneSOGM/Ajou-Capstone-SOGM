import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Button, Divider, Icon } from "@rneui/base";

import { SafeAreaView } from "react-native-safe-area-context";
import AppText from "../../utils/AppText.js";
import { usePortfolio } from "../../utils/PortfolioContext.js";
import { useFocusEffect } from "@react-navigation/native";
import Loading from "../../utils/Loading";

const RebalanceRecordList = ({ route, navigation }) => {
  const { rebalanceRecords } = usePortfolio();
  const [loading, setLoading] = useState(true);
  const [rebalanceRecordList, setrebalanceRecordList] = useState([]);
  const [tickerName, setTickerName] = useState([]);

  useFocusEffect(
    useCallback(() => {
      if (route.params) {
        setrebalanceRecordList(
          rebalanceRecords.filter((rebalanceRecords) => rebalanceRecords.pfId === route.params.id)
        );
        const name = route.params.stocks.reduce((acc, item) => {
          acc[item.ticker] = item.companyName;
          return acc;
        }, {});
        setTickerName(name);
      } else {
        setrebalanceRecordList(rebalanceRecords);
      }
      setrebalanceRecordList(
        rebalanceRecordList.sort((a, b) => new Date(b.date) - new Date(a.date))
      );
    setLoading(false);
    }, [])
  );
useEffect(() =>{
    //console.log("rblist: ", rebalanceRecordList);
  }, [])

  if (loading) return <Loading />;
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
        <AppText style={{ fontSize: 30, fontWeight: "bold" }}>리밸런싱 내역</AppText>
      </View>
      <ScrollView style={styles.alertList}>
        {rebalanceRecordList.map((item, index) => {
          return (
            <View key={index}>
              <TouchableOpacity
                style={styles.alertContainer}
                onPress={async () => {
                  navigation.navigate("ViewRebalanceRecord", {
                    pfId: item.pfId,
                    date: item.date,
                    records: item.records,
                    tickerName: tickerName
                  });
                }}
              >
                <View style={styles.alertHeader}>
                  <AppText>
                    <Icon
                      name="book"
                      type="ionicon"
                      color="#f0f0f0"
                      size={16}
                    />
                    <AppText style={{ fontSize: 13, color: "#808080" }}>
                      {"  "}
                      리밸런싱 내역
                    </AppText>
                  </AppText>
                </View>
                <AppText style={styles.alertContent}>
                  {item.date.replace("T", " ")}에 진행한 리밸런싱 내역입니다.
                </AppText>
                <View style={styles.moveButton}>
                  <AppText style={{ color: "#999" }}>
                    확인하러 가기 &gt;
                  </AppText>
                </View>
              </TouchableOpacity>
              <Divider style={{ marginVertical: 10 }} />
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
  },
  moveButton: {
    backgroundColor: "#333",
    borderRadius: 10,
    alignItems: "flex-end",
  },
});

export default RebalanceRecordList;
