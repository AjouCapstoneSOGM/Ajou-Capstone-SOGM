import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import urls from "../utils/urls.js";
import { ScrollView } from "react-native-gesture-handler";
import AppText from "../utils/AppText.js";
import Loading from "../utils/Loading.js";

const NewsSummary = ({ route }) => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState([]);
  const { ticker } = route.params;

  const fetchNewsSummary = async (ticker) => {
    try {
      //   const token = await getUsertoken();
      const response = await fetch(`${urls.fastapiUrl}/getNews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ticker: ticker,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        return data.summary;
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
    if (summary) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchNewsSummary(ticker);
        setSummary(result);
        setLoading(false);
      } catch (error) {
        console.error("Data load error: ", error);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {isNewsExist() ? (
          summary.map((news, index) => (
            <View key={index} style={styles.newsContainer}>
              <View style={styles.header}>
                <AppText style={styles.title}>{news.title}</AppText>
              </View>
              <View style={styles.newsItem}>
                <AppText style={styles.content}>&ensp;{news.content}</AppText>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.newsContainer}>
            <AppText>뉴스가 없습니다.</AppText>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },

  newsContainer: {
    flex: 1,
    margin: 5,
    backgroundColor: "#d5d5d5", // 신문의 전형적인 회색 톤 배경
    padding: 10,
    borderRadius: 5,
    marginBottom: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "left", // 헤더는 왼쪽 정렬
    borderBottomWidth: 2,
    borderColor: "#333", // 헤더 아래의 강조선
  },
  newsItem: {
    alignItems: "stretch",
    backgroundColor: "#fff", // 각 뉴스 아이템의 배경은 흰색
    padding: 10,
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // 상자 그림자로 입체감 주기
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
  },
  content: {
    fontSize: 15,
    lineHeight: 25, // 텍스트 줄 간격
    color: "#333", // 어두운 회색 텍스트
    textAlign: "justify",
  },
});
export default NewsSummary;
