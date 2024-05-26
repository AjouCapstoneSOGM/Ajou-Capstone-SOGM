import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import ManualPage1 from "./ManualPage1";
import ManualPage2 from "./ManualPage2";
import ManualPage3 from "./ManualPage3";

const MakeManualPortfolio = ({ step, setDisabled }) => {
  const [stockList, setStockList] = useState([]);

  useEffect(() => {
    if (step === 1) {
      if (stockList.length === 0) setDisabled(true);
      else setDisabled(false);
    }
    if (step === 2) {
      const result = stockList.filter(
        (stock) => stock.currentPrice === 0 || stock.quantity === 0
      );
      if (result.length) setDisabled(true);
      else setDisabled(false);
    }
  }, [step, stockList]);

  const renderManualStep = () => {
    switch (step) {
      case 1:
        return (
          <ManualPage1 stockList={stockList} setStockList={setStockList} />
        );
      case 2:
        return (
          <ManualPage2 stockList={stockList} setStockList={setStockList} />
        );
      case 3: {
        return (
          <ManualPage3 stockList={stockList} setStockList={setStockList} />
        );
      }
    }
  };
  return <View style={styles.container}>{renderManualStep()}</View>;
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },
});
export default MakeManualPortfolio;
