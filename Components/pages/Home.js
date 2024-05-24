import React, { useState } from "react";
import { SafeAreaView, View, StyleSheet } from "react-native";
import { removeUsertoken } from "../utils/localStorageUtils.js";
import { useAuth } from "../utils/AuthContext.js";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

import AppText from "../utils/AppText.js";
import { usePortfolio } from "../utils/PortfolioContext.js";
import { Button, Divider, Icon } from "@rneui/base";
import HeaderComponent from "../utils/Header.js";
import FooterComponent from "../utils/Footer.js";
import { SearchBar } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";

const Home = ({ navigation }) => {
  const { isLoggedIn, logout } = useAuth();
  const { removePortfolios } = usePortfolio();
  const { FGI, setFGI } = useState(55);
  const [search, setSearch] = useState("");
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
  const setLogout = () => {
    removeUsertoken();
    removePortfolios();
    logout();
  };
  const updateSearch = (search) => {
    setSearch(search);
  };
  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent />
      <ScrollView>
        <SearchBar
          placeholder="주식종목 검색"
          onChangeText={updateSearch}
          value={search}
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInputContainer}
        ></SearchBar>
        <View style={styles.FGIContainer}>
          <View style={styles.FGIHeader}>
            <AppText
              style={{ fontWeight: "bold", fontSize: 20, color: "#f0f0f0" }}
            >
              공포탐욕지수
            </AppText>
            <Button
              buttonStyle={{ marginHorizontal: -10 }}
              type="clear"
              onPress={() => {}}
              icon={{
                name: "questioncircleo",
                type: "antdesign",
                color: "white",
              }}
            />
          </View>
          <View style={styles.FGIContent}>
            <AppText style={{ fontSize: 20 }}>
              <AppText style={{ fontSize: 25, fontWeight: "bold" }}>
                55{" "}
              </AppText>
              <AppText>/ 100</AppText>
            </AppText>
            <LinearGradient
              colors={["#ff5c5c", "#93ff93"]} // 빨간색에서 초록색으로 변하는 그라데이션
              start={{ x: 0, y: 0 }} // 그라데이션 시작 위치
              end={{ x: 1, y: 0 }} // 그라데이션 종료 위치
              style={styles.FGIBar}
            />
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
      <FooterComponent />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    backgroundColor: "#f5f5f5",
  },
  searchContainer: {
    backgroundColor: "#333",
    borderTopColor: "#333",
    borderBottomColor: "#333",
  },
  searchInputContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 23,
  },
  FGIContainer: {
    backgroundColor: "#333",
    paddingHorizontal: 10,
    paddingVertical: 30,
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
  FGIBar: {
    height: 15,
    width: "80%",
    borderRadius: 10,
    marginTop: 20,
  },
  newsContainer: {
    backgroundColor: "#333",
    paddingHorizontal: 10,
    paddingVertical: 30,
  },
  newsHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f0f0f0",
    marginBottom: 30,
  },
  newsTitle: {
    fontSize: 18,
    color: "#f0f0f0",
    marginBottom: 15,
  },
});
export default Home;
