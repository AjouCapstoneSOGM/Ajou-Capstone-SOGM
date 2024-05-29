import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { VictoryPie, VictoryAnimation } from "victory-native";

const PortfolioPieChart = ({ data, selectedId, size }) => {
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
    const chartData = data.stocks.map((stock) => ({
      x: stock.companyName,
      y: stock.currentPrice * stock.quantity,
    }));
    chartData.push({ x: "현금", y: data.currentCash });
    while (chartData.length < 13) {
      chartData.push({ x: "dummy", y: 0 });
    }
    setChartData(chartData);
  }, [data]);

  return (
    <VictoryPie
      data={chartData}
      colorScale={colorScale}
      innerRadius={({ index }) =>
        index === selectedId ? 80 * size : 105 * size
      }
      width={350 * size}
      height={350 * size}
      radius={140 * size}
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
  );
};
export default PortfolioPieChart;
