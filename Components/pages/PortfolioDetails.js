import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Button,
  StyleSheet,
} from "react-native";
import { VictoryPie } from "victory-native";

const screenWidth = Dimensions.get("window").width;

const PortfolioDetails = ({ route }) => {
  const { portfolio } = route.params;
  const [selectedId, setSelectedId] = useState(null);
  const [details, setDetails] = useState([]);
  const [totalPrice, setTotalPrice] = useState(null);

  const colorScale = [
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
  ];

  // API로 받아온 데이터

  const chartData = details.map((detail) => ({
    x: detail.name,
    y: detail.average_price * detail.number,
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
        current_price: 80000,
        average_price: 90000,
      },
      {
        id: 1,
        name: "LG",
        number: 5,
        current_price: 50000,
        average_price: 70000,
      },
      {
        id: 2,
        name: "SK",
        number: 15,
        current_price: 70000,
        average_price: 80000,
      },
      {
        id: 3,
        name: "기타",
        number: 15,
        current_price: 110000,
        average_price: 80000,
      },
      {
        id: 4,
        name: "네이버",
        number: 12,
        current_price: 130000,
        average_price: 110000,
      },
      {
        id: 5,
        name: "카카오",
        number: 9,
        current_price: 70000,
        average_price: 95000,
      },
    ];
    stocks.sort(
      (a, b) => b.average_price * b.number - a.average_price * a.number
    );
    setTotalPrice(
      stocks.reduce((sum, stock) => sum + stock.number * stock.average_price, 0)
    );
    setDetails(stocks);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{portfolio.name}</Text>
      <View style={styles.chartContainer}>
        <VictoryPie
          data={chartData}
          colorScale={colorScale}
          width={screenWidth}
          height={400}
          innerRadius={({ index }) => (index === selectedId ? 45 : 50)}
          labelRadius={({ index }) => (index === selectedId ? 130 : 110)}
          radius={({ index }) => (index === selectedId ? 110 : 100)} // 선택된 조각의 반경을 증가
          labels={({ datum }) => `${datum.x}`}
          style={{
            labels: {
              fill: "black",
              fontSize: 15,
            },
          }}
        />
        {selectedId !== null && (
          <Text style={styles.centerText}>{`${
            ((
              (details[selectedId].number * details[selectedId].average_price) /
              totalPrice
            ).toFixed(3) *
              1000) /
            10 // 소숫점 계산 오류 방지를 위함
          }%`}</Text>
        )}
      </View>
      <View style={styles.itemContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {details.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.item,
                selectedId === index ? styles.selectedItem : {},
              ]}
              onPress={() => handleSelectItem(index)}
            >
              <View style={styles.nameContainer}>
                <Text style={{ textAlign: "left", fontSize: 16, padding: 10 }}>
                  {item.name}
                </Text>
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.itemText}>
                  {item.current_price.toLocaleString()}
                </Text>
                <Text style={styles.itemText}>
                  {item.average_price.toLocaleString()}
                </Text>
                <Text style={styles.itemText}>
                  {(item.average_price * item.number).toLocaleString()}
                </Text>
                <Text
                  style={[
                    styles.itemText,
                    item.current_price > item.average_price
                      ? { color: "blue" }
                      : { color: "red" },
                  ]}
                >
                  {((
                    (item.average_price - item.current_price) /
                    item.average_price
                  ).toFixed(4) *
                    10000) /
                    100}
                  %
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {/* <View style={styles.detailItem}>
        <View>
          <Text style={styles.itemText}>
            평단가 {}
            {selectedId === null
              ? ""
              : details[selectedId].average_price.toLocaleString()}
          </Text>
          <Text Style={styles.itemText}>
            {selectedId === null
              ? ""
              : (
                  details[selectedId].average_price * details[selectedId].number
                ).toLocaleString() + " 원"}
          </Text>
          {selectedId !== null && (
            <Text
              style={[
                styles.itemText,
                details[selectedId].current_price >
                details[selectedId].average_price
                  ? { color: "blue" }
                  : { color: "red" },
              ]}
            >
              {((
                (details[selectedId].average_price -
                  details[selectedId].current_price) /
                details[selectedId].average_price
              ).toFixed(4) *
                10000) /
                100}
              %
            </Text>
          )}
        </View>
        {selectedId != null && (
          <Button title="자세히 보기" onPress={() => {}} />
        )}
      </View> */}
      <View style={styles.buttonContainer}>
        <Button title="뉴스 요약" onPress={() => {}} />
        <Button title="수정" onPress={() => {}} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    padding: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  chartContainer: {
    flex: 4,
    overflow: "hidden",
    position: "relative", // 컨테이너를 상대 위치로 설정
    alignItems: "center", // 자식 요소를 수평 중앙 정렬
    justifyContent: "center", // 자식 요소를 수직 중앙 정렬
  },
  centerText: {
    position: "absolute", // Text 컴포넌트를 절대 위치로 설정
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
  },
  itemContainer: {
    flex: 4,
    flexDirection: "column",
    overflow: "hidden",
  },
  nameContainer: {
    flex: 2,
  },
  infoContainer: {
    flex: 4,
    justifyContent: "space-between",
    alignContent: "stretch",
    flexWrap: "wrap",
  },
  item: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 5,
    height: 120,
    justifyContent: "center", // 내용을 세로 방향으로 중앙 정렬
    alignItems: "center", // 내용을 가로 방향으로 중앙 정렬
    marginHorizontal: 10, // 박스끼리의 수평 간격
    shadowColor: "#000", // 그림자 색
    shadowOpacity: 1.25, // 그림자 투명도
    shadowRadius: 4, // 그림자 퍼짐
    elevation: 4, // Android에서 그림자 효과
    marginBottom: 5, // 아래쪽 여백 추가
    marginTop: 5,
  },
  selectedItem: {
    backgroundColor: "#E5FFDD",
  },
  itemText: {
    fontSize: 16,
    textAlign: "center", // 텍스트를 가운데 정렬
    marginBottom: 3,
  },
  detailItem: {
    flex: 2,
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    width: 400, // 박스의 폭을 고정
    height: 200, // 박스의 높이를 고정
    padding: 20,
    justifyContent: "space-between", // 내용을 세로 방향으로 중앙 정렬
    alignItems: "center", // 내용을 가로 방향으로 중앙 정렬
    shadowColor: "#000", // 그림자 색
    shadowOpacity: 1.25, // 그림자 투명도
    shadowRadius: 4, // 그림자 퍼짐
    elevation: 4, // Android에서 그림자 효과
    marginBottom: 10, // 아래쪽 여백 추가
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "space-around",
  },
});
export default PortfolioDetails;
