import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { Button, SearchBar } from "@rneui/base";
import AppText from "../../../utils/AppText";
import { useSearch } from "../../../utils/SearchStock";
import StockInfo from "../../portfolio/StockInfo";
import { height, width } from "../../../utils/utils";

const ManualPage1 = ({ step, setStep, stockList, setStockList }) => {
  const { query, setQuery, suggestions } = useSearch();
  const [disabled, setDisabled] = useState(true);
  const [stockInfoVisible, setStockInfoVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const toggleStockModal = () => {
    setStockInfoVisible(!stockInfoVisible);
  };

  const handleSelectedIndex = (index) => {
    setSelectedIndex(index);
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
    if (stockList.length === 0) setDisabled(true);
    else setDisabled(false);
  }, [stockList]);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <AppText style={styles.titleText}>추가하실 종목을 선택해주세요</AppText>
      </View>
      <SearchBar
        placeholder="종목 이름, 티커로 검색"
        onChangeText={setQuery}
        value={query}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInputContainer}
      />
      <View style={styles.itemContainer}>
        <View style={styles.selectedContainer}>
          {stockList.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.selectedItem}
              onPress={() => handleSelectedStocks(item)}
            >
              <AppText>{item.name} </AppText>
              <Icon name="close" size={12} color="#222" />
            </TouchableOpacity>
          ))}
        </View>
        <ScrollView>
          {suggestions &&
            suggestions.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelectedStocks(item)}
                style={styles.suggestion}
              >
                <View style={{ flexDirection: "row" }}>
                  <AppText style={{ color: "#f0f0f0" }}>
                    {item.name}
                    {"  "}
                  </AppText>
                  <AppText style={{ fontSize: 13, color: "#888" }}>
                    {item.exchange}
                  </AppText>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <AppText style={{ color: "#888" }}>{item.ticker}</AppText>
                  <Button
                    buttonStyle={styles.infoButton}
                    type="clear"
                    onPress={() => {
                      handleSelectedIndex(index);
                      toggleStockModal();
                    }}
                    icon={{
                      name: "infocirlceo",
                      type: "antdesign",
                      color: "#f0f0f0",
                    }}
                  />
                </View>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
      {suggestions[selectedIndex] && (
        <StockInfo
          isVisible={stockInfoVisible}
          onToggle={toggleStockModal}
          ticker={suggestions[selectedIndex].ticker}
        />
      )}
      <View style={styles.nextButtonContainer}>
        <Button
          buttonStyle={styles.nextButton}
          title="다음"
          onPress={handleNextStep}
          disabled={disabled}
        />
      </View>
    </View>
  );
};
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
  searchBarContainer: {
    height: 90,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  searchContainer: {
    backgroundColor: "#333",
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    padding: width * 5,
    height: height * 50,
  },
  searchInputContainer: {
    backgroundColor: "#f0f0f0",
    height: height * 40,
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
  itemContainer: {
    flex: 1,
    backgroundColor: "#333",
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
  infoButton: {
    marginRight: -5,
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
export default ManualPage1;
