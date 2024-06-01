import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import ManualPage1 from "./ManualPage1";
import ManualPage2 from "./ManualPage2";
import ManualPage3 from "./ManualPage3";

const MakeManualPortfolio = () => {
  const [stockList, setStockList] = useState([]);
  const [step, setStep] = useState(1);

  const renderManualStep = () => {
    switch (step) {
      case 1:
        return (
          <ManualPage1
            step={step}
            setStep={setStep}
            stockList={stockList}
            setStockList={setStockList}
          />
        );
      case 2:
        return (
          <ManualPage2
            step={step}
            setStep={setStep}
            stockList={stockList}
            setStockList={setStockList}
          />
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
