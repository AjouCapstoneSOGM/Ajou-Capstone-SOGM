import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import urls from "../../../utils/urls";
import { getUsertoken } from "../../../utils/localStorageUtils";

import AutoPage1 from "./AutoPage1";
import AutoPage2 from "./AutoPage2";
import AutoPage3 from "./AutoPage3";
import AutoPage4 from "./AutoPage4";

const AutoPortfolio = () => {
  const [amount, setAmount] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [interest, setInterest] = useState("");
  const [sector, setSector] = useState("");
  const [step, setStep] = useState(1);

  const fetchSector = async () => {
    try {
      const token = await getUsertoken();
      const response = await fetch(`${urls.springUrl}/api/sector/list`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchSector().then((data) => setSector(data));
  }, []);

  const renderAutoStep = () => {
    switch (step) {
      case 1:
        return (
          <AutoPage1
            step={step}
            setStep={setStep}
            amount={amount}
            setAmount={setAmount}
          />
        );
      case 2:
        return (
          <AutoPage2
            step={step}
            setStep={setStep}
            riskLevel={riskLevel}
            setRiskLevel={setRiskLevel}
          />
        );
      case 3:
        return (
          <AutoPage3
            step={step}
            setStep={setStep}
            sector={sector}
            interest={interest}
            setInterest={setInterest}
          />
        );
      case 4:
        return (
          <AutoPage4
            step={step}
            setStep={setStep}
            amount={amount}
            riskLevel={riskLevel}
            interest={interest}
          />
        );
      case 5:
        return (
          <AutoPage4
            step={step}
            setStep={setStep}
            amount={amount}
            riskLevel={riskLevel}
            interest={interest}
          />
        );
      case 6:
        return (
          <AutoPage4
            step={step}
            setStep={setStep}
            amount={amount}
            riskLevel={riskLevel}
            interest={interest}
          />
        );
      case 7:
        return (
          <AutoPage4
            step={step}
            setStep={setStep}
            amount={amount}
            riskLevel={riskLevel}
            interest={interest}
          />
        );
    }
  };
  return <View style={styles.container}>{renderAutoStep()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
  },
});
export default AutoPortfolio;
