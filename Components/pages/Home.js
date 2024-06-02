import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import AppText from "../utils/AppText.js";
import { Button, Divider, Icon } from "@rneui/base";
import HeaderComponent from "../utils/Header.js";
import FooterComponent from "../utils/Footer.js";
import { SearchBar } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { width, height } from "../utils/utils";
import { FlatList } from "react-native-gesture-handler";
import { useSearch } from "../utils/SearchStock.js";
import StockInfo from "./portfolio/StockInfo.js";
import ModalComponent from "../utils/Modal.js";

const Home = ({ navigation }) => {
  const { query, setQuery, suggestions } = useSearch();
  const [FGI, setFGI] = useState(55);
  const [isVisible, setIsVisible] = useState(false);
  const [stockInfoVisible, setStockInfoVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const toggleStockModal = () => {
    setStockInfoVisible(!stockInfoVisible);
  };

  const handleSelectedIndex = (index) => {
    setSelectedIndex(index);
  };

  const news = [
    {
      title: "아스트라제네카, 2030년까지 800억달러 매출 목표",
      source: "이데일리",
      date: "2024-05-24",
    },
    {
      title: "아스트라제네카, 2030년까지 800억달러 매출 목표",
      source: "이데일리",
      date: "2024-05-24",
    },
    {
      title: "아스트라제네카, 2030년까지 800억달러 매출 목표",
      source: "이데일리",
      date: "2024-05-24",
    },
    {
      title: "아스트라제네카, 2030년까지 800억달러 매출 목표",
      source: "이데일리",
      date: "2024-05-24",
    },
    {
      title: "아스트라제네카, 2030년까지 800억달러 매출 목표",
      source: "이데일리",
      date: "2024-05-24",
    },
    {
      title: "아스트라제네카, 2030년까지 800억달러 매출 목표",
      source: "이데일리",
      date: "2024-05-24",
    },
  ];

  const toggleModal = () => {
    setIsVisible(!isVisible);
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent />
      <SearchBar
        placeholder="주식종목 검색"
        onChangeText={setQuery}
        value={query}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInputContainer}
      />
      <View style={{ zIndex: 1 }}>
        <FlatList
          style={styles.searchResult}
          data={suggestions.slice(0, 5)}
          keyExtractor={(item) => item.ticker}
          renderItem={({ item, index }) => (
            <View key={index} style={styles.suggestion}>
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
            </View>
          )}
        />
      </View>
      <ScrollView style={styles.mainTheme}>
        <View style={styles.FGIContainer}>
          <View style={styles.FGIHeader}>
            <AppText
              style={{ fontWeight: "bold", fontSize: 20, color: "#f0f0f0" }}
            >
              공포탐욕지수
            </AppText>
            <Button
              containerStyle={{ marginHorizontal: -10 }}
              type="clear"
              onPress={() => {
                toggleModal();
              }}
              icon={{
                name: "questioncircleo",
                type: "antdesign",
                color: "#f0f0f0",
              }}
            />
          </View>

          <View style={styles.FGIContent}>
            <AppText style={{ fontSize: 15 }}>
              <AppText style={{ fontSize: 25, fontWeight: "bold" }}>
                {FGI}{" "}
              </AppText>
              <AppText>/ 100</AppText>
            </AppText>
            <View style={styles.FGIBarContainer}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <AppText style={{ fontWeight: "bold", fontSize: 18 }}>
                  😱
                </AppText>
                <AppText style={{ fontWeight: "bold", fontSize: 18 }}>
                  🤑
                </AppText>
              </View>
              <Icon
                type="antdesign"
                name="caretdown"
                color="#333"
                style={{ alignSelf: "flex-start", left: `${FGI - 3}%` }}
                size={20}
              />
              <LinearGradient
                colors={["#5878ff", "#ff5858"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.FGIBar}
              />
            </View>
          </View>
        </View>
        <View style={styles.newsContainer}>
          <AppText style={styles.newsHeader}>실시간 뉴스</AppText>
          {news.map((newsItem, index) => (
            <TouchableOpacity key={index}>
              <AppText style={styles.newsTitle}>{newsItem.title}</AppText>
              <AppText style={{ color: "#7d7d7d", fontSize: 13 }}>
                <AppText>{newsItem.source} </AppText>
                <AppText>{newsItem.date}</AppText>
              </AppText>
              <Divider style={{ marginVertical: 15 }} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <View style={{ height: height * 30 }} />
      {/* footer 높이 만큼 증가 */}
      <FooterComponent />
      <ModalComponent isVisible={isVisible} onToggle={toggleModal}>
        <AppText
          style={{ fontSize: 13, marginBottom: 20, color: "#f0f0f0" }}
        >{`공포탐욕지수는 금융 시장의 투자자 감정을 나타내는 지표로, 0에서 100까지의 값을 가집니다.\n\n'공포'는 낮은 값으로, 시장 참여자들이 불안감을 느끼고 주식을 팔아치우는 상황을 나타냅니다. 😱\n\n'탐욕'은 높은 값으로, 투자자들이 주식을 많이 사려고 하여 주가가 오르는 상황을 나타냅니다. 🤑`}</AppText>
        <Divider style={{ marginVertical: 10 }} />
        <View style={styles.FGIInfoColumn}>
          <AppText style={[styles.FGIPart, { color: "#5878ff" }]}>
            0~25{" "}
          </AppText>
          <AppText style={styles.FGIInfo}>
            시장이 과도하게 두려워하는 상태로, 주식 매수의 좋은 기회일 수
            있습니다.
          </AppText>
        </View>
        <View style={styles.FGIInfoColumn}>
          <AppText style={[styles.FGIPart, { color: "#956cc3" }]}>
            25~50{" "}
          </AppText>
          <AppText style={styles.FGIInfo}>
            불안감이 약간 존재하며 매수 기회일 수 있습니다.
          </AppText>
        </View>
        <View style={styles.FGIInfoColumn}>
          <AppText style={[styles.FGIPart, { color: "#ce618a" }]}>
            50~75{" "}
          </AppText>
          <AppText style={styles.FGIInfo}>
            시장 참여자들이 욕심을 내기 시작하며, 주의해야 할 시점입니다.
          </AppText>
        </View>
        <View style={styles.FGIInfoColumn}>
          <AppText style={[styles.FGIPart, { color: "#ff5858" }]}>
            75~100{" "}
          </AppText>
          <AppText style={styles.FGIInfo}>
            시장이 매우 욕심이 많은 상태로, 매도 시점을 고려할 때입니다.
          </AppText>
        </View>
      </ModalComponent>
      {suggestions[selectedIndex] && (
        <StockInfo
          isVisible={stockInfoVisible}
          onToggle={toggleStockModal}
          ticker={suggestions[selectedIndex].ticker}
        />
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: "#f0f0f0",
  },
  searchBarContainer: {
    backgroundColor: "#f0f0f0",
    paddingVertical: height * 20,
    paddingHorizontal: width * 15,
    zIndex: 2,
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
  searchResult: {
    position: "absolute",
    left: 0,
    right: 0,
  },
  suggestion: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#434343",
    backgroundColor: "#333",
  },
  infoButton: {
    marginRight: -5,
  },
  mainTheme: {
    backgroundColor: "#333",
    zIndex: 0,
  },
  FGIContainer: {
    paddingHorizontal: width * 20,
    paddingVertical: height * 10,
  },
  FGIHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  FGIContent: {
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    marginVertical: 10,
    paddingVertical: 20,
    borderRadius: 10,
  },
  FGIBarContainer: {
    width: "80%",
  },
  FGIBar: {
    height: 15,
    borderRadius: 10,
  },
  FGIInfoColumn: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  FGIPart: {
    width: "20%",
    color: "#aaa",
    fontSize: 12,
  },
  FGIInfo: {
    width: "80%",
    color: "#f0f0f0",
    fontSize: 12,
  },
  newsContainer: {
    paddingHorizontal: width * 10,
    paddingVertical: height * 15,
  },
  newsHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f0f0f0",
    marginBottom: height * 15,
  },
  newsTitle: {
    fontSize: 18,
    color: "#f0f0f0",
    marginBottom: height * 10,
  },
});
export default Home;
