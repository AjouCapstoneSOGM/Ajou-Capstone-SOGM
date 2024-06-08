import React, { useEffect, useState } from "react";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLegend,
  VictoryPie,
} from "victory-native";
import { colorScale, height, width } from "./utils";
import AppText from "./AppText";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
const PortfolioPieChart = ({
  data,
  selectedId,
  size,
  mode,
  type,
  animate = true,
}) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getTotalPrice = (stocks) => {
    const totalPrice = stocks?.reduce(
      (total, stock) =>
        total + Number(stock.currentPrice) * Number(stock.quantity),
      0
    );
    return totalPrice;
  };

  useEffect(() => {
    setLoading(true);
    if (typeof data === "object") {
      switch (type) {
        case "portfolio":
          const portfolioTotal = data?.reduce(
            (total, portfolio) =>
              total +
              getTotalPrice(portfolio.detail.stocks) +
              portfolio.detail.currentCash,
            0
          );
          const portfolioChartData =
            data?.map((portfolio) => {
              const totalPrice =
                getTotalPrice(portfolio.detail.stocks) +
                portfolio.detail.currentCash;
              return {
                x: portfolio.name,
                y: totalPrice,
                rate: ((totalPrice * 100) / portfolioTotal).toFixed(2) + "%",
              };
            }) || [];
          setChartData(portfolioChartData);
          break;
        case "stock":
          const stockTotal = getTotalPrice(data?.stocks) + data?.currentCash;
          const stockChartData =
            data?.stocks.map((stock) => ({
              x: stock.companyName,
              y: stock.currentPrice * stock.quantity,
              rate:
                (stockTotal > 0
                  ? (
                      ((stock.currentPrice * stock.quantity) / stockTotal) *
                      100
                    ).toFixed(2)
                  : 0) + "%",
            })) || [];
          stockChartData?.push({ x: "현금", y: data.currentCash });
          setChartData(stockChartData);
          break;
        case "rate":
          const rateChartData = data?.map((item, index) => ({
            x: item.name,
            y: item.rate,
          }));
          setChartData(rateChartData);
          break;
      }
    }
    setLoading(false);
  }, [data]);

  return (
    <View style={styles.victoryContainer}>
      {type == "asdf" && (
        <View style={styles.chartContainer}>
          <VictoryChart domainPadding={20}>
            <VictoryAxis dependentAxis tickFormat={(tick) => `${tick}%`} />
            <VictoryAxis
              tickFormat={["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"]}
            />
            <VictoryBar data={data} x="x" y="y" />
          </VictoryChart>
        </View>
      )}
      {type != "rate" && (
        <View style={styles.chartContainer}>
          <VictoryPie
            data={chartData}
            colorScale={colorScale}
            innerRadius={({ index }) =>
              animate && index === selectedId ? 80 * size : 105 * size
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
            style={{
              data: {
                fill: ({ datum, index }) =>
                  datum.x === "현금"
                    ? "#ccc"
                    : colorScale[index % colorScale.length],
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
      )}
      {type == "stock" && (
        <View
          style={[
            styles.labelContainer,
            {
              height: Math.min(
                height * 250 * size,
                (height * 450 * size * chartData?.length) / 13
              ),
            },
          ]}
        >
          <ScrollView>
            <VictoryLegend
              x={30 * width}
              orientation="vertical"
              data={chartData
                .slice(0, chartData?.length || 0)
                .map((item, index) => ({
                  name: item.x,
                  symbol: {
                    fill:
                      item.x === "현금"
                        ? "#ccc"
                        : colorScale[index % colorScale.length],
                  },
                }))}
              width={width * 200 * size}
              height={(height * 450 * size * (chartData?.length || 1)) / 13}
              style={{
                labels: {
                  fontFamily: "pretendard",
                  fontSize: 20 * size,
                  fill: mode === "dark" ? "#f0f0f0" : "#333",
                },
              }}
            />
          </ScrollView>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  victoryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  chartLabel: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  labelContainer: {
    alignItems: "center",
  },
});
export default PortfolioPieChart;
