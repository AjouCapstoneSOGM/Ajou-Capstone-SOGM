import React from "react";
import { StyleSheet, View } from "react-native";
import { VictoryPie, VictoryAnimation } from "victory-native";

const PortfolioPieChart = ({ data, cash, selectedId }) => {
  const colorScale = [
    "hsl(348, 100%, 80%)", // 파스텔 핑크,
    "hsl(207, 94%, 80%)", // 파스텔 블루,
    "hsl(48, 100%, 78%)", // 파스텔 옐로우,
    "hsl(144, 76%, 76%)", // 파스텔 그린,
    "hsl(20, 100%, 72%)", // 파스텔 오렌지,
    "hsl(262, 100%, 80%)", // 파스텔 퍼플,
    "hsl(174, 100%, 70%)", // 파스텔 시안,
    "hsl(338, 90%, 72%)", // 파스텔 레드,
    "hsl(20, 20%, 60%)", // 연 회색,
    "hsl(300, 90%, 80%)", // 파스텔 시안-그린,
    "#333",
    "#777",
    "#ccc",
  ];

  const chartData = data.map((stock) => ({
    x: stock.companyName,
    y: stock.averageCost * stock.quantity,
  }));

  chartData.push({ x: "현금", y: cash });

  return (
    <View style={styles.chartContainer}>
      <VictoryPie
        data={chartData}
        colorScale={colorScale}
        innerRadius={({ index }) => (index === selectedId ? 80 : 105)}
        radius={140}
        labels={() => {}}
        animate={{
          duration: 300,
          onLoad: { duration: 300 },
          onExit: {
            duration: 300,
            before: () => ({ y: 0, label: " " }),
          },
          onEnter: {
            duration: 300,
            before: () => ({ y: 0, label: " " }),
          },
        }}
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
  chart: {},
});

export default PortfolioPieChart;
