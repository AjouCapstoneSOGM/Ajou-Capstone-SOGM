import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import ManualPage1 from "../make/manual/ManualPage1";
import ManualPage2 from "../make/manual/ManualPage2";
import ManualAddPage3 from "../make/manual/ManualAddPage3";
import { Button, Divider } from "@rneui/base";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePortfolio } from "../../utils/PortfolioContext";

const AddStockInManual = ({ route, navigation }) => {
  const pfId = route.params.pfId;
  const [stockList, setStockList] = useState([]);
  const [step, setStep] = useState(1);
  const [disabled, setDisabled] = useState(false);
  const { loadData } = usePortfolio();

  const handleNextStep = () => {
    setStep(step + 1);
  };

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
    if (step === 4) {
      loadData();
      navigation.popToTop();
      navigation.navigate("ViewPortfolio");
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
      case 3:
        return <ManualAddPage3 stockList={stockList} pfId={pfId} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Divider style={styles.topDivider} />
      {renderManualStep()}
      <View style={styles.nextButtonContainer}>
        <Button
          buttonStyle={styles.nextButton}
          title="다음"
          onPress={handleNextStep}
          disabled={disabled}
        />
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },
  topDivider: {
    marginVertical: 70,
    borderWidth: 4,
    borderColor: "#bbb",
  },
  textContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
  },
  contentsContainer: {
    flex: 1,
    backgroundColor: "#333",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  nextButton: {
    backgroundColor: "#6262e8",
    borderRadius: 10,
    height: 60,
  },
  nextButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#333",
  },
});
export default AddStockInManual;
