import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import urls from "../utils/urls.js";
import { ScrollView } from "react-native-gesture-handler";
import AppText from "../utils/AppText";
import Loading from "../utils/Loading";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Icon, color } from "@rneui/base";
import { getUsertoken } from "../utils/localStorageUtils";

const NewsSummary = ({ route, navigation }) => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState([]);
  const { ticker, name } = route.params;
  const fetchNewsSummary = async (ticker) => {
    try {
      const token = await getUsertoken();
      const response = await fetch(
        `${urls.springUrl}/api/ticker/${ticker}/news`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        if (response.status === 204) return "";
        else {
          const data = await response.json();
          return data.summary;
        }
      } else {
        console.log("fetch error: ", response.status);
        return [];
      }
    } catch (error) {
      console.error("News Error :", error);
      throw error;
    }
  };
  const isNewsExist = () => {
    if (summary.length > 0) {
      return true;
    }
    return false;
  };
  useEffect(() => {
    const loadNewsData = async () => {
      try {
        const result = await fetchNewsSummary(ticker);
        if (result.length > 0) {
          const sections = result.trim().split("## ").slice(1);
          const summaryJson = sections.map((section) => {
            const [title, ...contentArray] = section.split("\n");
            return {
              title: title.trim(),
              content: contentArray.join("\n").trim(),
            };
          });
          setSummary(summaryJson);
        }
        setLoading(false);
      } catch (error) {
        console.error("Data load error: ", error);
      }
    };
    loadNewsData();
  }, []);
  if (loading) {
    return <Loading />;
  }

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
        <AppText style={{ fontSize: 30, fontWeight: "bold" }}>뉴스</AppText>
      </View>
      <View style={styles.newsContainer}>
        <View style={styles.nameHeader}>
          <AppText style={{ fontSize: 20, color: "#f0f0f0" }}>{name}</AppText>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AppText style={{ color: "#888", fontWeight: "bold" }}>
            최근 한 달간의 뉴스가 ChatGPT를 통하여 요약되었습니다.{"  "}
          </AppText>
          <Icon name="robot" type="material-community" color="#888" />
        </View>
        <ScrollView>
          {isNewsExist() ? (
            summary.map((news, index) => (
              <View key={index} style={styles.newsContent}>
                <View style={styles.newsHeader}>
                  <AppText style={styles.title}>{news.title}</AppText>
                </View>
                <View style={styles.newsItem}>
                  <AppText style={styles.content}>&ensp;{news.content}</AppText>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.newsContainer}>
              <AppText style={styles.title}>최근 뉴스가 없습니다.</AppText>
            </View>
          )}
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
  header: {
    height: 60,
    alignItems: "flex-start",
  },
  textContainer: {
    height: 90,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  newsContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: "#333",
  },
  nameHeader: {
    flexDirection: "row",
  },
  newsContent: {
    padding: 5,
    marginVertical: 20,
  },
  newsHeader: {
    borderColor: "#777",
    borderBottomWidth: 1,
    marginVertical: 10,
    paddingVertical: 10,
  },
  newsItem: {
    alignItems: "stretch",
    backgroundColor: "#333",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#f0f0f0",
  },
  content: {
    fontSize: 15,
    lineHeight: 20,
    color: "#f0f0f0",
    textAlign: "justify",
  },
});
export default NewsSummary;
