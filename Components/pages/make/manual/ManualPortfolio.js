import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import ManualPage1 from "./ManualPage1";
import ManualPage2 from "./ManualPage2";
import ManualPage3 from "./ManualPage3";
import { Button, Divider } from "@rneui/base";
import { useNavigation } from "@react-navigation/native";

const ManualPortfolio = () => {
  const navigation = useNavigation();
  const [stockList, setStockList] = useState([]);
  const [step, setStep] = useState(1);

  const handleStep = (value) => {
    setStep(value);
  };

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
      default: {
        navigation.goBack();
      }
    }
  };
  return (
    <View style={styles.container}>
      <Button
        containerStyle={styles.goBackButton}
        type="clear"
        onPress={() => {
          step <= 2 ? handleStep(step - 1) : navigation.goBack();
        }}
        icon={{ name: "left", type: "antdesign", color: "#333" }}
      />
      <Divider style={styles.topDivider} />
      {renderManualStep()}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },
  goBackButton: {
    alignSelf: "flex-start",
    marginTop: 5,
  },
  topDivider: {
    marginVertical: 50,
    borderWidth: 4,
    borderColor: "#bbb",
  },
});
export default ManualPortfolio;
