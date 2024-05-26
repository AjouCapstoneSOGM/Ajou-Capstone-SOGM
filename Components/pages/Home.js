import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import AppText from "../utils/AppText.js";
import { Button, Divider } from "@rneui/base";
import HeaderComponent from "../utils/Header.js";
import FooterComponent from "../utils/Footer.js";
import { SearchBar } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = ({ navigation }) => {
  const [FGI, setFGI] = useState(55);
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

  const updateSearch = (search) => {
    setSearch(search);
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent />
      <View style={styles.searchBarContainer}>
        <SearchBar
          placeholder="주식종목 검색"
          onChangeText={updateSearch}
          value={search}
          containerStyle={styles.searchContainer}
          inputContainerStyle={styles.searchInputContainer}
        ></SearchBar>
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
              buttonStyle={{ marginHorizontal: -10 }}
              type="clear"
              onPress={() => {}}
              icon={{
                name: "questioncircleo",
                type: "antdesign",
                color: "#f0f0f0",
              }}
            />
          </View>
          <View style={styles.FGIContent}>
            <AppText style={{ fontSize: 20 }}>
              <AppText style={{ fontSize: 25, fontWeight: "bold" }}>
                {FGI}{" "}
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
      <View style={{ height: 70 }} />
      {/* footer 높이 만큼 증가 */}
      <FooterComponent />
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
    height: 90,
    backgroundColor: "#f0f0f0",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  searchContainer: {
    borderRadius: 30,
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    padding: 4,
    paddingRight: 50,
    height: 50,
  },
  searchInputContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    height: 40,
  },
  mainTheme: {
    backgroundColor: "#333",
  },
  FGIContainer: {
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
