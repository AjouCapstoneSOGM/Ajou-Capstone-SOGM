import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Button,
} from "react-native";
import { VictoryPie, VictoryAnimation } from "victory-native";

const screenWidth = Dimensions.get("window").width;

const PortfolioDetails = ({ route }) => {
  const { portfolio } = route.params;
  const [selectedId, setSelectedId] = useState(null);
  const [details, setDetails] = useState([]);

  // API로 받아온 데이터

  const data = details.map((detail) => ({
    x: detail.name,
    y: detail.cur_proportion,
  }));

  const handleSelectItem = (id) => {
    setSelectedId(id);
  };

  useEffect(() => {
    stocks = [
      {
        id: 0,
        name: "삼성",
        number: 10,
        buying_price: 90000,
        init_proportion: 20,
        cur_proportion: 30,
      },
      {
        id: 1,
        name: "LG",
        number: 5,
        buying_price: 70000,
        init_proportion: 25,
        cur_proportion: 25,
      },
      {
        id: 2,
        name: "SK",
        number: 15,
        buying_price: 80000,
        init_proportion: 55,
        cur_proportion: 45,
      },
      {
        id: 3,
        name: "기타",
        number: 15,
        buying_price: 80000,
        init_proportion: 10,
        cur_proportion: 20,
      },
      {
        id: 4,
        name: "네이버",
        number: 12,
        buying_price: 110000,
        init_proportion: 15,
        cur_proportion: 10,
      },
      {
        id: 5,
        name: "카카오",
        number: 9,
        buying_price: 95000,
        init_proportion: 5,
        cur_proportion: 5,
      },
    ];
    stocks.sort((a, b) => b.cur_proportion - a.cur_proportion);
    setDetails(stocks);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{portfolio.name}</Text>
      <VictoryPie
        data={data}
        colorScale={[
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#F77825",
          "#9966FF",
          "#00BFA5",
          "#C94D77",
          "#4D4D4D",
          "#7CDDDD",
        ]}
        width={screenWidth}
        height={300}
        innerRadius={({ index }) =>
          index === details.findIndex((detail) => detail.id === selectedId)
            ? 40
            : 50
        }
        labelRadius={({ index }) =>
          index === details.findIndex((detail) => detail.id === selectedId)
            ? 130
            : 110
        }
        radius={({ index }) =>
          index === details.findIndex((detail) => detail.id === selectedId)
            ? 110
            : 100
        } // 선택된 조각의 반경을 증가
        style={{
          labels: {
            fill: "black",
            fontSize: 15,
          },
        }}
      />
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
      >
        {details.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.item,
              selectedId === item.id ? styles.selectedItem : styles.item,
            ]}
            onPress={() => handleSelectItem(item.id)}
          >
            <Text style={styles.itemText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.detailItem}>
        <Text style={styles.itemText}>
          {selectedId === null ? "" : details[selectedId].cur_proportion}
        </Text>
        <Text Style={styles.itemText}>
          {selectedId === null
            ? ""
            : details[selectedId].buying_price * details[selectedId].number}
        </Text>
      </View>
      <Button title="뉴스 요약" onPress={() => {}} />
      <Button title="수정" onPress={() => {}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  horizontalScroll: {
    flexDirection: "row",
    paddingVertical: 10, // 스크롤뷰에 상하 패딩 추가
    overflow: "visible", // 스크롤뷰에서 그림자가 보이도록 설정
  },
  item: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 10,
    width: 130, // 박스의 폭을 고정
    height: 60, // 박스의 높이를 고정
    justifyContent: "center", // 내용을 세로 방향으로 중앙 정렬
    alignItems: "center", // 내용을 가로 방향으로 중앙 정렬
    marginHorizontal: 10, // 박스끼리의 수평 간격
    shadowColor: "#000", // 그림자 색
    shadowOpacity: 1.25, // 그림자 투명도
    shadowRadius: 4, // 그림자 퍼짐
    elevation: 4, // Android에서 그림자 효과
    marginBottom: 10, // 아래쪽 여백 추가
    marginTop: 10,
  },
  selectedItem: {
    backgroundColor: "#E5FFDD",
    padding: 10,
    borderRadius: 10,
    width: 130, // 박스의 폭을 고정
    height: 60, // 박스의 높이를 고정
    justifyContent: "center", // 내용을 세로 방향으로 중앙 정렬
    alignItems: "center", // 내용을 가로 방향으로 중앙 정렬
    marginHorizontal: 10, // 박스끼리의 수평 간격
    shadowColor: "#000", // 그림자 색
    shadowOpacity: 1.25, // 그림자 투명도
    shadowRadius: 4, // 그림자 퍼짐
    elevation: 4, // Android에서 그림자 효과
    marginBottom: 10, // 아래쪽 여백 추가
    marginTop: 10,
  },
  itemText: {
    fontSize: 16,
    textAlign: "center", // 텍스트를 가운데 정렬
    marginBottom: 5,
  },
  detailItem: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    width: 400, // 박스의 폭을 고정
    height: 200, // 박스의 높이를 고정
    padding: 10,
    justifyContent: "center", // 내용을 세로 방향으로 중앙 정렬
    alignItems: "center", // 내용을 가로 방향으로 중앙 정렬
    shadowColor: "#000", // 그림자 색
    shadowOpacity: 1.25, // 그림자 투명도
    shadowRadius: 4, // 그림자 퍼짐
    elevation: 4, // Android에서 그림자 효과
    marginBottom: 10, // 아래쪽 여백 추가
  },
});

export default PortfolioDetails;
