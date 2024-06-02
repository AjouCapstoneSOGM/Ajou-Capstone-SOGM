import React, { useEffect, useState } from "react";
import { VictoryPie } from "victory-native";
import { height, width } from "./utils";
import AppText from "./AppText";
import { StyleSheet, View } from "react-native";

const PortfolioPieChart = ({ data, selectedId, size, mode }) => {
  const [chartData, setChartData] = useState([]);
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
    "#00ac00",
    "#ffd700",
    "#ccc",
  ];

  useEffect(() => {
    const total =
      data?.stocks.reduce(
        (acc, cur) => acc + cur.currentPrice * cur.quantity,
        0
      ) + data?.currentCash;
    const chartData =
      data?.stocks.map((stock) => ({
        x: stock.companyName,
        y: stock.currentPrice * stock.quantity,
        rate:
          (total > 0
            ? (((stock.currentPrice * stock.quantity) / total) * 100).toFixed(2)
            : 0) + "%",
      })) || [];
    chartData?.push({ x: "현금", y: data.currentCash });
    while (chartData.length < 13) {
      chartData.push({ x: "dummy", y: 0, rate: 0 });
    }
    setChartData(chartData);
  }, [data]);

  return (
    <View>
      <VictoryPie
        data={chartData}
        colorScale={colorScale}
        innerRadius={({ index }) =>
          index === selectedId ? 80 * size : 105 * size
        }
        width={width * 250 * size}
        height={height * 250 * size}
        radius={width * 120 * size}
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
      />
      <View style={styles.chartLabel}>
        <AppText
          style={{
            fontWeight: "bold",
            fontSize: 15 * height,
            color: mode === "dark" ? "#f0f0f0" : "#333",
          }}
        >
          {chartData[selectedId]?.rate}
        </AppText>
        <AppText
          style={{
            fontSize: 9 * height,
            color: mode === "dark" ? "#f0f0f0" : "#333",
          }}
        >
          {chartData[selectedId]?.x}
        </AppText>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  chartLabel: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default PortfolioPieChart;
