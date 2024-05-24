import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import urls from "../../../utils/urls";
import { getUsertoken } from "../../../utils/localStorageUtils";
import { usePortfolio } from "../../../utils/PortfolioContext";

import Loading from "../../../utils/Loading";
import AutoPage1 from "./AutoPage1";
import AutoPage2 from "./AutoPage2";
import AutoPage3 from "./AutoPage3";

const AutoPortfolio = ({ step, setDisabled }) => {
  const { loadData } = usePortfolio();
  const [amount, setAmount] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [interest, setInterest] = useState("");
  const [sector, setSector] = useState("");

  const fetchUserInfo = async (userInfo) => {
    setPortLoading(true);
    try {
      const token = await getUsertoken();
      const response = await fetch(
        `${urls.springUrl}/api/portfolio/create/auto`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            country: "KOR",
            sector: [userInfo.interest],
            asset: userInfo.amount,
            riskValue: userInfo.riskLevel,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Success:", data);
      }
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
    await loadData();
  };

  useEffect(() => {
    if (step === 1) {
      if (amount < 100000) setDisabled(true);
      else setDisabled(false);
    }
  }, [step, amount]);

  useEffect(() => {
    if (step === 2) {
      if (riskLevel < 1) setDisabled(true);
      else setDisabled(false);
    }
  }, [step, riskLevel]);

  useEffect(() => {
    if (step === 3) {
      if (interest === "") setDisabled(true);
      else setDisabled(false);
    }
  }, [step, interest]);

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
        return <AutoPage1 amount={amount} setAmount={setAmount} />;
      case 2:
        return <AutoPage2 riskLevel={riskLevel} setRiskLevel={setRiskLevel} />;
      case 3:
        return (
          <AutoPage3
            sector={sector}
            interest={interest}
            setInterest={setInterest}
          />
        );

      case 4:
        return <Loading />;
      default:
        setCurrentStep(0);
    }
  };
  return <View style={styles.container}>{renderAutoStep()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  inputContainer: {
    flex: 2,
    alignItems: "stretch",
    padding: 20,
  },
  riskContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  riskInfo: {
    flex: 1,
    padding: 30,
    marginTop: 30,
  },
  infoText: {
    fontSize: 18,
    marginBottom: 40,
    textAlign: "justify",
  },
  input_Amount: {
    justifyContent: "center", // 가로 방향에서 중앙 정렬
    marginVertical: 10,
    fontSize: 30,
    borderBottomWidth: 1,
  },
  addButton: {
    backgroundColor: "#ddd",
    marginRight: 10,
    padding: 8,
    borderRadius: 5,
  },
  input_Risk: {
    justifyContent: "center", // 가로 방향에서 중앙 정렬
    height: 100,
    backgroundColor: "#ddd",
    alignItems: "center",
    padding: 15,
    borderRadius: 5,
  },
  sectorContainer: {
    flex: 2,
    flexDirection: "row",
    padding: 20,
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  input_Interest: {
    flexGrow: 1,
    justifyContent: "center", // 가로 방향에서 중앙 정렬
    backgroundColor: "#ddd",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    margin: 10,
  },
  selectedInput: {
    backgroundColor: "#6495ED",
  },
  buttonContainer: {
    alignItems: "stretch",
    padding: 20,
  },
  disabledButton: {
    backgroundColor: "#DADADA", // 비활성화 상태의 배경색 변경
  },
  button: {
    justifyContent: "center", // 가로 방향에서 중앙 정렬
    backgroundColor: "#6495ED",
    alignItems: "center",
    alignSelf: "stretch",
    borderRadius: 10,
    padding: 18,
  },
});
export default AutoPortfolio;
