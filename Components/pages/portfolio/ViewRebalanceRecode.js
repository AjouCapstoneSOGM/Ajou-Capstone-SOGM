import React, { useCallback, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Divider, Icon } from "@rneui/base";
import { width, height, deepCopy, filteringNumber } from "../../utils/utils";
import AppText from "../../utils/AppText";
import Loading from "../../utils/Loading";

const ViewRebalanceRecode = ({ route, navigation }) => {
  const { pfId, date, records, tickerName} = route.params;
  const [rebalanceRecord, setrebalanceRecord] = useState(records)
  const [loading, setLoading] = useState(true);
  const [isAscending, setIsAscending] = useState(true);

  const handleSort = (prop) => {
    setIsAscending(!isAscending);

    if (prop === "name") {
      setrebalanceRecord(
        [...rebalanceRecord].sort((a, b) => {
          return isAscending
            ? b.name.localeCompare(a.name)
            : a.name.localeCompare(b.name);
        })
      );
    } else {
      setrebalanceRecord(
        [...rebalanceRecord].sort((a, b) => {
          const sortFactor = isAscending ? 1 : -1;
          return (Number(a[prop]) - Number(b[prop])) * sortFactor;
        })
      );
    }
  };

  useEffect(() => {
    setrebalanceRecord(records.map(record => {
      record.name = tickerName[record.ticker];
      record.totalPrice = (record.price * record.number);
      return record;
    }))
    console.log(rebalanceRecord);
    setLoading(false);
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
        <AppText
          style={{ fontSize: 30, fontWeight: "bold" }}
        >
          리밸런싱 내역
        </AppText>
      </View>
      <View style={styles.headerContainer}>
        <Divider />
        <View style={styles.column}>
          <Icon
            name="checkcircle"
            type="antdesign"
            color="#333"
            size={15}
            style={{ marginRight: 5 }}
          />
          {/*열 맞추기용*/}
          <Button
            title="기업명"
            type="clear"
            containerStyle={styles.columnName}
            titleStyle={{ color: "#808080", fontSize: 12 }}
            onPress={() => {
              handleSort("name");
            }}
            icon={{
              type: "antdesign",
              name: "caretdown",
              color: "#808080",
              size: 11,
            }}
            iconPosition="right"
          />
          <Button
            title="수량"
            type="clear"
            containerStyle={styles.columnNumber}
            titleStyle={{ color: "#808080", fontSize: 12 }}
            onPress={() => {
              handleSort("number");
            }}
            icon={{
              type: "antdesign",
              name: "caretdown",
              color: "#808080",
              size: 11,
            }}
            iconPosition="right"
          />
          <Button
            title="매매 총액"
            type="clear"
            containerStyle={styles.columnPrice}
            titleStyle={{ color: "#808080", fontSize: 12 }}
            onPress={() => {
              handleSort("totalPrice");
            }}
            icon={{
              type: "antdesign",
              name: "caretdown",
              color: "#808080",
              size: 11,
            }}
            iconPosition="right"
          />
          <Button
            title="매매 유형"
            type="clear"
            containerStyle={styles.columnRateDiff}
            titleStyle={{ color: "#808080", fontSize: 12 }}
            onPress={() => {
              handleSort("buy");
            }}
            icon={{
              type: "antdesign",
              name: "caretdown",
              color: "#808080",
              size: 11,
            }}
            iconPosition="right"
          />
        </View>
      </View>
      <View style={{ flex: 2 }}>
        <ScrollView style={styles.rebalanceList} persistentScrollbar={true}>
          {rebalanceRecord.map((item, index) => (
            <View key={index} style={styles.rebalanceItem}>
              <TouchableOpacity style={styles.rebalanceItemContent}>
                <View style={styles.itemNameBox}>
                  <AppText style={styles.itemName}>{item.name}</AppText>
                  <AppText style={styles.itemOnePrice}>{item.price.toLocaleString()}</AppText>
                </View>
                <AppText style={styles.itemNumber}>{item.number.toLocaleString()}</AppText>
                <AppText style={styles.itemPrice}>{item.totalPrice.toLocaleString()} 원</AppText>
                <AppText
                    style={{
                      flex: 1,
                      textAlign: "center",
                      color: item.buy ? "#ff5858" : "#5878ff",
                      fontSize: 15,
                    }}
                  >
                    {item.buy ? " 매수" : " 매도"}
                  </AppText>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: "#f0f0f0",
  },
  textContainer: {
    height: 90,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  rebalanceList: {
    backgroundColor: "#333",
    paddingHorizontal: width * 15,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: height * 10,
    backgroundColor: "#333",
  },
  header: {
    height: 60,
    alignItems: "flex-start",
  },
  rebalanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 5,
  },
  column: {
    flexDirection: "row",
    marginVertical: 8,
  },
  columnName: {
    flex: 1,
    textAlign: "center",
  },
  columnNumber: {
    flex: 1,
    color: "#808080",
    textAlign: "center",
  },
  columnPrice: {
    flex: 1.2,
    color: "#808080",
    textAlign: "center",
  },
  columnRateDiff: {
    flex: 1,
    color: "#808080",
    textAlign: "center",
  },
  rebalanceItem: {
    flexDirection: "row",
    marginVertical: 5,
  },
  rebalanceItemContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  itemNameBox: {
    flex: 1.5,
  },
  itemName: {
    flex: 1,
    fontSize: 13,
    color: "#f0f0f0",
    fontWeight: "bold",
    textAlign: "center",
  },
  itemNumber: {
    flex: 0,
    fontSize: 14,
    color: "#f0f0f0",
    textAlign: "right",
  },
  itemOnePrice: {
    color: "#999",
    textAlign: "center",
    fontSize: 12,
  },
  itemPrice: {
    flex: 1.5,
    fontSize: 15,
    color: "#f0f0f0",
    textAlign: "right",
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
});

export default ViewRebalanceRecode;
